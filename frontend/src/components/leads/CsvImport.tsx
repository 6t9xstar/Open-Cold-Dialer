import React, { useState, useCallback } from "react";
import { X, Upload } from "lucide-react";
import Papa from "papaparse";

interface CsvRow {
  first_name?: string;
  last_name?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  source?: string;
  status?: string;
  [key: string]: string | undefined;
}

interface CsvImportProps {
  onClose: () => void;
  onImport: (rows: CsvRow[]) => Promise<void>;
}

const csvColumns = [
  "first_name", "last_name", "company", "phone", "email",
  "website", "address", "city", "state", "zip", "source", "status",
];

export function CsvImport({ onClose, onImport }: CsvImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState<Record<string, string | undefined>>({});
  const [parsedData, setParsedData] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError("");
    setParsedData([]);
    setHeaders([]);
    setMapping({});

    Papa.parse<CsvRow>(f, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const h = results.meta.fields ?? [];
        setHeaders(h);
        setParsedData(results.data as CsvRow[]);
      },
      error(err: Error) {
        setError(`Failed to parse CSV: ${err.message}`);
      },
    });
  }, []);

  async function handleImport() {
    if (!parsedData.length) return;
    setLoading(true);
    try {
      const mapped = parsedData.map((row) => {
        const mappedRow: CsvRow = {};
        csvColumns.forEach((col) => {
          const sourceKey = mapping[col];
          if (sourceKey && row[sourceKey] !== undefined) {
            mappedRow[col] = row[sourceKey];
          }
        });
        return mappedRow;
      });
      await onImport(mapped);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Import CSV</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {!parsedData.length ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select CSV File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-400 transition cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to select or drag and drop a CSV file</p>
                <p className="text-xs text-gray-400 mt-1">Supports quoted fields, commas, and multi-line cells</p>
                <input
                  type="file"
                  accept=".csv,.tsv,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="mt-3 inline-block px-4 py-2 text-sm font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 cursor-pointer transition"
                >
                  Choose File
                </label>
              </div>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">{parsedData.length} rows parsed. Map CSV columns to database fields.</p>
              <div className="space-y-2">
                {csvColumns.map((col) => {
                  const csvOptions = ["— None —", ...headers];
                  return (
                    <div key={col} className="flex items-center gap-3">
                      <span className="w-32 text-sm font-medium text-gray-700 capitalize">{col.replace(/_/g, " ")}</span>
                      <select
                        value={mapping[col] ?? ""}
                        onChange={(e) => setMapping((prev) => ({ ...prev, [col]: e.target.value || undefined }))}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
                      >
                        {csvOptions.map((opt) => (
                          <option key={opt} value={opt === "— None —" ? "" : opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {headers.slice(0, 5).map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-medium text-gray-600">{h}</th>
                      ))}
                      {headers.length > 5 && <th className="px-3 py-2 text-left font-medium text-gray-600">...</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parsedData.slice(0, 3).map((row, i) => (
                      <tr key={i}>
                        {headers.slice(0, 5).map((h, j) => (
                          <td key={j} className="px-3 py-1.5 text-gray-600 truncate max-w-[120px]">{row[h] ?? "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={() => { setParsedData([]); setMapping({}); }} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Change File</button>
                <div className="flex gap-3">
                  <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Cancel</button>
                  <button type="button" onClick={handleImport} disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 rounded-lg transition">
                    {loading ? "Importing..." : "Import"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
