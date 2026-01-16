import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { certificatesService } from '../services/supabase/certificates';
import { RealtimeChannel } from '@supabase/supabase-js';

// Define the shape of a verification event based on our SQL table
export interface VerificationEvent {
  id: string;
  certificate_id: string | null;
  certificate_hash: string;
  verifier_user_id: string | null;
  verifier_org_name: string | null;
  ip_address: string | null;
  geo_country: string | null;
  verified_at: string;
  certificates?: {
    issued_to: string;
    file_name: string;
  };
}

export function useRealtimeVerifications(userId: string | undefined) {
  const [events, setEvents] = useState<VerificationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        console.log('[Hook] Fetching verifications for user:', userId);
        // Using the service method we defined (need to ensure it returns properly typed data or cast it)
        const data = await certificatesService.getRecentVerifications(userId, 50);
        console.log('[Hook] Fetched data:', data);
        setEvents(data as unknown as VerificationEvent[] || []);
      } catch (err) {
        console.error('[Hook] Error fetching verifications:', err);
      } finally {
        setLoading(false);
      }
    };

    const setupSubscription = () => {
      channel = supabase
        .channel('verification_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'verification_events',
            filter: `owner_id=eq.${userId}`, // This uses the efficient column we added
          },
          (payload) => {
            console.log('New verification event:', payload);
            const newEvent = payload.new as VerificationEvent;
            // Note: The payload won't have the joined 'certificates' data immediately.
            // For a perfect UI, we might want to fetch that specific cert details, 
            // but for now we'll prepend it. The UI should handle missing joined data gracefully.
            setEvents((prev) => [newEvent, ...prev]);
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

  return { events, loading };
}
