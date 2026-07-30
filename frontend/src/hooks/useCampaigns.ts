import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/apiClient";
import type { Database } from "@/types/database";

type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];

const API_URL = import.meta.env.VITE_API_URL || "";
const isApiMode = Boolean(API_URL);

export function useCampaigns() {
  return useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: async () => {
      if (isApiMode) {
        return api.campaigns.list();
      }
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation<Campaign, Error, { name: string; type: string; status: string; settings: Record<string, unknown> | null }>({
    mutationFn: async ({ name, type, status, settings }) => {
      if (isApiMode) {
        return api.campaigns.create({ name, type, status, settings });
      }
      const { data, error } = await supabase.from("campaigns").insert({ name, type, status, settings }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation<Campaign, Error, Partial<Campaign> & { id: string }>({
    mutationFn: async ({ id, ...updates }) => {
      if (isApiMode) {
        return api.campaigns.update(id, updates);
      }
      const { data, error } = await supabase
        .from("campaigns")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (isApiMode) {
        return api.campaigns.delete(id);
      }
      const { error } = await supabase.from("campaigns").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}
