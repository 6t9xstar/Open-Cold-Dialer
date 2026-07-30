import React, { useState } from "react";
import { X } from "lucide-react";
import type { Database } from "@/types/database";

type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];

interface CampaignFormProps {
  onClose: () => void;
  onSubmit: (data: { name: string; type: "outbound" | "inbound" | "blended"; status: "active" | "paused" | "completed"; settings: Record<string, unknown> | null }) => Promise<void>;
  initialData?: Campaign;
}

export function CampaignForm({ onClose, onSubmit, initialData }: CampaignFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [type, setType] = useState<"outbound" | "inbound" | "blended">(initialData?.type ?? "outbound");
  const [status, setStatus] = useState<"active" | "paused" | "completed">(initialData?.status ?? "active");
  const [settingsText, setSettingsText] = useState<string>(JSON.stringify(initialData?.settings ?? {}, null, 2));
  const [settingsError, setSettingsError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSettingsError("");

    let parsedSettings: Record<string, unknown> | null = null;
    const trimmed = settingsText.trim();
    if (trimmed && trimmed !== "{}") {
      try {
        parsedSettings = JSON.parse(trimmed);
      } catch {
        setSettingsError("Invalid JSON. Please check your syntax.");
        return;
      }
    }

    await onSubmit({ name, type, status, settings: parsedSettings });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{initialData ? "Edit Campaign" : "New Campaign"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white">
                <option value="outbound">Outbound</option>
                <option value="inbound">Inbound</option>
                <option value="blended">Blended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Settings (JSON)</label>
            <textarea value={settingsText} onChange={(e) => setSettingsText(e.target.value)} rows={4} className={`w-full px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none ${settingsError ? "border-red-300 bg-red-50" : "border-gray-300"}`} />
            {settingsError && <p className="text-xs text-red-600 mt-1">{settingsError}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition">Save Campaign</button>
          </div>
        </form>
      </div>
    </div>
  );
}
