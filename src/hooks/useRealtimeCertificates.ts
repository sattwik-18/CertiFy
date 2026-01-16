import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { certificatesService, CertificateRow } from '../services/supabase/certificates';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeCertificates(userId: string | undefined) {
  const [certificates, setCertificates] = useState<CertificateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setCertificates([]);
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const data = await certificatesService.getUserCertificates(userId);
        setCertificates(data || []);
      } catch (err: any) {
        console.error('Error fetching certificates:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const setupSubscription = () => {
      channel = supabase
        .channel('certificates_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'certificates',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log('Realtime update:', payload);
            if (payload.eventType === 'INSERT') {
              setCertificates((prev) => [payload.new as CertificateRow, ...prev]);
            } else if (payload.eventType === 'DELETE') {
              setCertificates((prev) => prev.filter((cert) => cert.id !== payload.old.id));
            } else if (payload.eventType === 'UPDATE') {
              setCertificates((prev) =>
                prev.map((cert) => (cert.id === payload.new.id ? (payload.new as CertificateRow) : cert))
              );
            }
          }
        )
        .subscribe();
    };

    fetchInitialData();
    setupSubscription();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [userId]);

  return { certificates, loading, error };
}
