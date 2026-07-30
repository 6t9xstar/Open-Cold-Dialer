import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLead } from "@/hooks/useLeads";
import { useCallLog } from "@/hooks/useCallLogs";
import { useCreateCallLog } from "@/hooks/useCallLogs";
import { useUpdateLead, useDeleteLead } from "@/hooks/useLeads";
import { Softphone } from "@/components/softphone/Softphone";
import { CallScriptViewer } from "@/components/scripts/CallScriptViewer";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ArrowLeft, Edit3, Trash2, Phone, Clock, Mail, Globe, MapPin, FileText, Calendar } from "lucide-react";

export function LeadDetailPage() {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading } = useLead(leadId ?? "");
  const { data: callLogs } = useCallLog(leadId ?? "");
  const createCallLog = useCreateCallLog();
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showScript, setShowScript] = useState(false);

  function handleCallEnd(data: { outcome: string; duration: number; notes: string; direction: "outbound" | "inbound" }) {
    createCallLog.mutateAsync({
      lead_id: leadId ?? null,
      user_id: null,
      campaign_id: null,
      direction: data.direction,
      outcome: data.outcome as any,
      duration_seconds: data.duration,
      recording_url: null,
      transcript: null,
      sip_call_id: null,
      started_at: null,
      ended_at: null,
      notes: data.notes,
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lead not found</p>
        <button onClick={() => navigate("/leads")} className="mt-4 text-brand-600 hover:text-brand-700 text-sm">
          Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/leads")} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {lead.first_name} {lead.last_name}
            </h1>
            <StatusBadge status={lead.status} />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {lead.company ?? "No company"} · {lead.city ?? ""} {lead.state ?? ""} {lead.zip ?? ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowEdit(true)} className="p-2 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition" title="Edit">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Softphone lead={lead} onCallEnd={handleCallEnd} />
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-900">Call Script</h2>
            </div>
            <button onClick={() => setShowScript(true)} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View Script →
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{lead.phone ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{lead.email ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{lead.website ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{lead.address ?? "—"}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Notes</h2>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{lead.notes ?? "No notes yet"}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Details</h2>
            <dl className="space-y-3">
              {[
                ["Status", lead.status],
                ["Source", lead.source ?? "—"],
                ["Company", lead.company ?? "—"],
                ["Phone", lead.phone ?? "—"],
                ["Email", lead.email ?? "—"],
                ["Website", lead.website ?? "—"],
                ["Address", lead.address ?? "—"],
                ["City", [lead.city, lead.state, lead.zip].filter(Boolean).join(", ") || "—"],
                ["Calls", String(lead.call_count ?? 0)],
                ["Last Called", lead.last_called_at ? new Date(lead.last_called_at).toLocaleString() : "Never"],
                ["Created", new Date(lead.created_at).toLocaleDateString()],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs font-medium text-gray-400 uppercase">{label}</dt>
                  <dd className="text-sm text-gray-900 mt-0.5">{value as string}</dd>
                </div>
              ))}
            </dl>
          </div>

          {callLogs && callLogs.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Calls</h2>
              <div className="space-y-3">
                {callLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="border-l-2 border-brand-300 pl-3 py-2">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={log.outcome} />
                      <span className="text-xs text-gray-400 font-mono">{log.duration_seconds}s</span>
                    </div>
                    {log.notes && <p className="text-xs text-gray-500 mt-1">{log.notes}</p>}
                    <p className="text-xs text-gray-400 mt-1">{new Date(log.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          open={showDeleteConfirm}
          title="Delete Lead"
          message={`Delete "${lead.first_name} ${lead.last_name}"? This cannot be undone.`}
          variant="danger"
          confirmLabel="Delete"
          onConfirm={async () => {
            await deleteLeadMutation.mutateAsync(lead.id);
            navigate("/leads");
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showScript && (
        <CallScriptViewer
          onClose={() => setShowScript(false)}
        />
      )}
    </div>
  );
}
