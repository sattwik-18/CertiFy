import { supabase } from '../../lib/supabase';
import { computeFileHash } from '../../lib/crypto';
import { Database } from '../../lib/database.types';

export type CertificateRow = Database['public']['Tables']['certificates']['Row'];
export type InsertCertificate = Database['public']['Tables']['certificates']['Insert'];

export const certificatesService = {
  /**
   * Upload file to storage and create certificate record
   */
  async createCertificate(
    file: File,
    metadata: {
      userId: string;
      issuedTo?: string;
      issuedBy?: string;
    }
  ) {
    try {
      // 1. Compute Hash (Client Side) FIRST
      const fileHash = await computeFileHash(file);

      // 2. Check for Duplicate Hash in DB
      const { data: existingCert } = await supabase
        .from('certificates')
        .select('id')
        .eq('user_id', metadata.userId)
        .eq('file_hash', fileHash)
        .single();

      if (existingCert) {
        throw new Error(`File "${file.name}" has already been processed.`);
      }

      // 3. Unique Filename Strategy
      // user_id/timestamp_clean_filename
      const fileExt = file.name.split('.').pop();
      const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
      const uniqueName = `${Date.now()}_${cleanName}.${fileExt}`;
      const filePath = `${metadata.userId}/${uniqueName}`;

      // 4. Upload file to Storage
      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 5. Insert Record
      const { data, error: dbError } = await supabase
        .from('certificates')
        .insert({
          user_id: metadata.userId,
          file_name: file.name,
          file_path: filePath,
          file_hash: fileHash,
          issued_to: metadata.issuedTo || '',
          issued_by: metadata.issuedBy || '',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return data;
    } catch (error) {
      console.error('Certificate creation failed:', error);
      throw error;
    }
  },

  /**
   * Fetch certificates for current user
   */
  async getUserCertificates(userId: string) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Fetch recent certificates (limit 5)
   */
  async getRecentCertificates(userId: string, limit = 5) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Fetch counts/stats
   */
  async getStats(userId: string) {
    // Note: 'count' requires head: true, but we also want to return it. 
    // Supabase JS .select('*', { count: 'exact' }) returns data + count.
    const { count, error } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;

    return {
      totalIssued: count || 0,
    };
  },


  /**
   * Verify a certificate by hash
   */
  async verifyCertificate(hash: string) {
    // 1. Fetch Certificate
    const { data: cert, error: certError } = await supabase
      .from('certificates')
      .select('*')
      .eq('file_hash', hash)
      .single();

    if (certError && certError.code !== 'PGRST116') throw certError;
    if (!cert) return null;

    // 2. Fetch Profile separately (avoids Join/RLS schema cache issues)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', cert.user_id)
      .single();

    // Return combined object structure expected by UI
    return {
      ...cert,
      profiles: profile || { name: 'Unknown Issuer', email: 'N/A' }
    };
  },

  /**
   * Log a verification event
   */
  async logVerificationEvent(event: {
    certificateId?: string;
    certificateHash: string;
    success: boolean;
    verifierUserId?: string;
    verifierOrgName?: string;
    ownerId?: string;
    ipAddress?: string;
    geoCountry?: string;
    userAgent?: string;
    latencyMs?: number; // Added
  }) {
    console.log('Logging verification event:', event);
    const { error } = await supabase
      .from('verification_events')
      .insert({
        certificate_id: event.certificateId,
        certificate_hash: event.certificateHash,
        success: event.success,
        verifier_user_id: event.verifierUserId,
        verifier_org_name: event.verifierOrgName,
        owner_id: event.ownerId,
        ip_address: event.ipAddress,
        geo_country: event.geoCountry,
        user_agent: event.userAgent,
        latency_ms: event.latencyMs, // Insert into DB (Re-enabled)
        verified_at: new Date().toISOString() // Explicitly set timestamp
      });

    if (error) console.error('Failed to log verification event:', error);
  },

  /**
   * Get verification stats for an issuer
   */
  async getVerificationStats(userId: string) {
    // Total pings (count events where cert belongs to user)
    // This requires a join or a view, but RLS allows us to just query verification_events
    // because "Issuers can view verification events for their certs".
    // So we can just select count where 1=1 (filtered by RLS).

    const { count, error } = await supabase
      .from('verification_events')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return {
      totalVerifications: count || 0
    };
  },

  /**
   * Get recent verifications for dashboard
   */
  async getRecentVerifications(userId: string, limit = 5) {
    // 1. Fetch Events
    console.log('[Service] Querying verification_events...');
    const { data: events, error: eventsError } = await supabase
      .from('verification_events')
      .select('*')
      .eq('owner_id', userId) // EXPLICIT FILTER
      .order('verified_at', { ascending: false })
      .limit(limit);

    if (eventsError) {
      console.error('[Service] Error querying events:', eventsError);
      throw eventsError;
    }
    console.log('[Service] Raw events:', events);

    if (!events || events.length === 0) return [];

    // 2. Fetch Certificates for these events
    const certIds = Array.from(new Set(events.map(e => e.certificate_id).filter(Boolean)));

    let certsMap: Record<string, { issued_to: string; file_name: string }> = {};

    if (certIds.length > 0) {
      const { data: certs, error: certsError } = await supabase
        .from('certificates')
        .select('id, issued_to, file_name')
        .in('id', certIds);

      if (!certsError && certs) {
        certsMap = certs.reduce((acc, cert) => {
          acc[cert.id] = { issued_to: cert.issued_to, file_name: cert.file_name };
          return acc;
        }, {} as Record<string, any>);
      }
    }

    return events.map(event => ({
      ...event,
      certificates: event.certificate_id ? certsMap[event.certificate_id] : null
    }));
  },

  /**
   * Delete a certificate
   */
  async deleteCertificate(certificateId: string, filePath: string) {
    try {
      // 1. Delete from Storage
      const { error: storageError } = await supabase.storage
        .from('certificates')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        throw storageError;
      }

      // 2. Delete from Database
      const { error: dbError } = await supabase
        .from('certificates')
        .delete()
        .eq('id', certificateId);

      if (dbError) throw dbError;

      return true;
    } catch (error) {
      console.error('Delete certificate failed:', error);
      throw error;
    }
  },

  /**
   * Get Public URL for a file
   */
  getPublicUrl(filePath: string) {
    const { data } = supabase.storage
      .from('certificates')
      .getPublicUrl(filePath);
    return data.publicUrl;
  }
};
