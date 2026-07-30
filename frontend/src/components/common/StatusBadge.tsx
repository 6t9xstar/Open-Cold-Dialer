import React from "react";

interface StatusBadgeProps {
  status: string;
}

const statusColors: Record<string, string> = {
  new: "bg-brand-100 text-brand-800",
  contacted: "bg-blue-100 text-blue-800",
  interested: "bg-amber-100 text-amber-800",
  not_interested: "bg-gray-100 text-gray-800",
  callback: "bg-purple-100 text-purple-800",
  converted: "bg-green-100 text-green-800",
  do_not_contact: "bg-red-100 text-red-800",
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  scheduled: "bg-brand-100 text-brand-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  rescheduled: "bg-yellow-100 text-yellow-800",
  answered: "bg-green-100 text-green-800",
  no_answer: "bg-gray-100 text-gray-800",
  busy: "bg-red-100 text-red-800",
  voicemail: "bg-yellow-100 text-yellow-800",
  dnc: "bg-red-100 text-red-800",
  wrong_number: "bg-gray-100 text-gray-800",
  disconnected: "bg-gray-100 text-gray-800",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass = statusColors[status] ?? "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}