import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebase";

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = value?.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

const Summary = ({ label, value }) => (
  <div className="border border-neutral-200 bg-neutral-50 p-3">
    <p className="font-jost text-[10px] font-medium uppercase tracking-wide text-neutral-500">{label}</p>
    <p className="mt-1 font-marcellus text-xl text-neutral-900">{value}</p>
  </div>
);

export const AdminRecords = () => {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadRecords = async (isRefresh = false) => {
    setError("");
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const snapshot = await getDocs(query(
        collection(db, "cookie_consents"),
        orderBy("submitted_at", "desc"),
        limit(500)
      ));
      setConsents(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
    } catch {
      setError("Cookie history could not be loaded. Check Firestore access rules.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadRecords(); }, []);

  const essentialCount = consents.filter((record) => record.choice === "essential").length;
  const allCount = consents.filter((record) => record.choice === "all").length;

  return (
    <section id="requests" data-testid="admin-requests" className="scroll-mt-24 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-marcellus text-xl text-neutral-900">Cookie consent</h2>
          <p className="mt-1 font-jost text-[13px] text-neutral-500">Visitor consent choices and timestamps.</p>
        </div>
        <button type="button" data-testid="admin-records-refresh" onClick={() => loadRecords(true)} disabled={loading || refreshing} aria-label="Refresh records" className="flex h-10 w-10 shrink-0 items-center justify-center border border-neutral-300 text-neutral-700 hover:border-wine hover:text-wine disabled:opacity-50">
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {error && <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 font-jost text-sm text-red-800">{error}</p>}
      {loading ? (
        <p className="font-jost text-sm text-neutral-500">Loading cookie choices…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Summary label="Essential only · latest 500" value={essentialCount} />
            <Summary label="Allow all · latest 500" value={allCount} />
          </div>

          <section aria-labelledby="admin-consent-title" className="border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-4 py-3">
              <h3 id="admin-consent-title" className="font-marcellus text-base text-neutral-900">Cookie consent history</h3>
            </div>
            {consents.length === 0 ? <p className="px-4 py-5 font-jost text-sm text-neutral-500">No consent records yet.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left">
                  <thead className="bg-neutral-50 font-jost text-[10px] uppercase tracking-wide text-neutral-500">
                    <tr><th className="px-4 py-3">Choice</th><th className="px-4 py-3">Recorded</th></tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-jost text-sm text-neutral-700">
                    {consents.map((record) => (
                      <tr key={record.id}>
                        <td className="px-4 py-3 capitalize">{record.choice === "all" ? "Allow all" : "Essential only"}</td>
                        <td className="px-4 py-3">{formatDateTime(record.submitted_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
};
