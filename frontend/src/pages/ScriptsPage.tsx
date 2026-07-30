import React, { useState } from "react";
import { BookOpen, AlertTriangle, Search } from "lucide-react";
import type { Database } from "@/types/database";

type Script = Database["public"]["Tables"]["call_scripts"]["Row"];

const SAMPLE_SCRIPT: Script = {
  id: "sample",
  title: "Cold Outreach Script — Medical Practices",
  category: "Medical",
  content: "Good morning, this is Luke from your company. I'm reaching out because we help specialty practices like yours streamline operations and reduce overhead. Do you have a few minutes to discuss how we can save your practice time and money each month?",
  objection_responses: {
    "We're happy with our current billing": {
      response: "That's great to hear. Many of our clients felt the same way until they saw our average 30% reduction in denied claims. Could I show you a quick comparison?",
      category: "satisfaction",
    },
    "I don't have time right now": {
      response: "I completely understand. This is a 15-minute conversation that could save hours each week. When would be a better time — tomorrow or later this week?",
      category: "time",
    },
    "Send me an email instead": {
      response: "I'd love to send over our case study, but a quick call is much faster. I can show you real numbers from practices just like yours. Would 10 minutes tomorrow work?",
      category: "deferral",
    },
    "We just changed billing companies": {
      response: "That's great! When they're ready, or if the new vendor doesn't meet expectations, I'd love to have a conversation. Mind if I follow up in 3 months?",
      category: "timing",
    },
  },
  campaign_id: null,
  created_by: null,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function ScriptsPage() {
  const [scripts] = useState<Script[]>([SAMPLE_SCRIPT]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [activeObjection, setActiveObjection] = useState<string | null>(null);

  const filtered = scripts.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const objections = selectedScript
    ? Object.entries(selectedScript.objection_responses ?? {})
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Call Scripts</h1>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search scripts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((script) => (
          <button
            key={script.id}
            onClick={() => {
              setSelectedScript(script);
              setActiveObjection(null);
            }}
            className="text-left bg-white rounded-xl p-5 border border-gray-200 hover:border-brand-300 hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              <h3 className="font-semibold text-gray-900">{script.title}</h3>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800">
              {script.category}
            </span>
            {script.is_active && (
              <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                Active
              </span>
            )}
          </button>
        ))}
      </div>

      {selectedScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-600" />
                <h2 className="text-lg font-semibold text-gray-900">{selectedScript.title}</h2>
              </div>
              <button
                onClick={() => setSelectedScript(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800">
                {selectedScript.category}
              </span>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedScript.content}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Common Objections & Responses
                </h3>
                <div className="space-y-2">
                  {objections.map(([objection, data]: [string, any]) => (
                    <div key={objection}>
                      <button
                        onClick={() =>
                          setActiveObjection(
                            activeObjection === objection ? null : objection
                          )
                        }
                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition text-sm"
                      >
                        <span className="font-medium text-gray-900">"{objection}"</span>
                        <span className="text-xs text-gray-400 ml-2">{data.category}</span>
                      </button>
                      {activeObjection === objection && (
                        <div className="mt-2 p-3 bg-brand-50 rounded-lg border border-brand-200 text-sm text-brand-900">
                          {data.response}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}