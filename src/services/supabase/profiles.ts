import { supabase } from '../../lib/supabase';

export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  created_at: string;
}

export const profilesService = {
  /**
   * Ensures a profile exists for the given user.
   * If not, creates one.
   */
  async ensureProfile(userId: string, email: string | undefined, name?: string) {
    if (!userId) return null;

    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('Error fetching profile:', fetchError);
        return null;
      }

      if (existingProfile) {
        return existingProfile;
      }

      // Create new profile
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: email || null,
            name: name || null,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating profile:', insertError);
        throw insertError;
      }

      return newProfile;
    } catch (error) {
      console.error('Profile operation failed:', error);
      return null;
    }
  },

  /**
   * Get current user profile
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error getting profile:', error);
      return null;
    }
    return data;
  }
};
