import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/apiClient";
import type { Database } from "@/types/database";

type CallLog = Database["public"]["Tables"]["call_logs"]["Row"];

const API_URL = import.meta.env.VITE_API_URL || "";
const isApiMode = Boolean(API_URL);

export function useCallLogs() {
  return useQuery<CallLog[]>({
    queryKey: ["callLogs"],
    queryFn: async () => {
      if (isApiMode) {
        return api.callLogs.list();
      }
      const { data, error } = await supabase
        .from("call_logs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCallLog(leadId: string) {
  return useQuery<CallLog[]>({
    queryKey: ["callLogs", leadId],
    queryFn: async () => {
      if (isApiMode) {
        return api.callLogs.getByLead(leadId);
      }
      const { data, error } = await supabase
        .from("call_logs")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!leadId,
  });
}

export function useCreateCallLog() {
  const queryClient = useQueryClient();
  return useMutation<CallLog, Error, Omit<CallLog, "id" | "created_at">>({
    mutationFn: async (log) => {
      if (isApiMode) {
        return api.callLogs.create(log);
      }
      const { data, error } = await supabase
        .from("call_logs")
        .insert(log)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callLogs"] });
    },
  });
}
