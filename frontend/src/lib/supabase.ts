import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function createNoOpTable() {
  return {
    select: () => ({ from: () => ({ order: () => Promise.resolve({ data: [], error: null, count: 0 }) }) }),
    insert: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
    update: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
    delete: () => Promise.resolve({ data: [], error: null }),
    on: () => ({ unsubscribe: () => {} }),
  };
}

const mockSupabase = {
  from: (_table: string) => createNoOpTable(),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (_cb: unknown) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: "Not configured" } }),
    signUp: async () => ({ data: { user: null, session: null }, error: { message: "Not configured" } }),
    signOut: async () => ({ error: null }),
  },
  channel: () => ({
    on: () => ({ unsubscribe: () => {} }),
    subscribe: () => {},
  }),
  isConfigured,
};

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : (mockSupabase as any);

if (!isConfigured) {
  console.warn(
    "Missing Supabase environment variables. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set."
  );
}
