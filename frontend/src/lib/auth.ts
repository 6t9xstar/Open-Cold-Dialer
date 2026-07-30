import { supabase } from "@/lib/supabase";
import { api, setAuthToken } from "@/lib/apiClient";
import type { User } from "@supabase/supabase-js";

const API_URL = import.meta.env.VITE_API_URL || "";
const isApiMode = Boolean(API_URL);

export async function signUp(email: string, password: string, fullName: string) {
  if (isApiMode) {
    const { user, token } = await api.auth.signup(email, password, fullName);
    setAuthToken(token);
    return { user };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  if (isApiMode) {
    const { user, token } = await api.auth.login(email, password);
    setAuthToken(token);
    return { user };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (isApiMode) {
    setAuthToken(null);
    return;
  }
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  if (isApiMode) {
    try {
      const user = await api.auth.me();
      return user as unknown as User;
    } catch {
      return null;
    }
  }
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  if (isApiMode) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange((_event: string, session: { user: User | null; access_token: string | null } | null) => {
    callback(session?.user ?? null);
  });
}
