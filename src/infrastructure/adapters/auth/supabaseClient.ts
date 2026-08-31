import { createClient } from "@supabase/supabase-js";
import { ENV } from "../../../shared/constants/env";

/**
 * Global Supabase JS Client for Client-Side OAuth & Realtime Events
 */
export const supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
