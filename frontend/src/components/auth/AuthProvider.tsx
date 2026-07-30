import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

const DEV_USER: User = {
  id: "dev-user-001",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: { full_name: "Admin User", avatar_url: null },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "dev@example.com",
  email_confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: "authenticated",
  updated_at: new Date().toISOString(),
  phone: undefined,
  confirmed_at: new Date().toISOString(),
} as User;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!(supabase as any).isConfigured) {
      setUser(DEV_USER);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        console.warn("No active Supabase session. Using dev user for development.");
        setUser(DEV_USER);
      }
      setLoading(false);
    }).catch(() => {
      setUser(DEV_USER);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: any) => {
        setUser(session?.user ?? DEV_USER);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}