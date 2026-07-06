import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllRecruiters, deleteRecruiter,
  approveRecruiter, rejectRecruiter,
  type Recruiter,
} from "../../services/recruiters.api";
import { User, Trash2, Phone, MapPin, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Users() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<number | null>(null);

  useEffect(() => {
    getAllRecruiters()
      .then(setRecruiters)
      .catch(() => setError("Failed to load recruiters"))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: number) => {
    setActionId(id);
    try {
      await approveRecruiter(id);
      setRecruiters((prev) =>
        prev.map((r) => r.id === id ? { ...r, isVerified: true } : r)
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to approve");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm("Reject and delete this recruiter account?")) return;
    setActionId(id);
    try {
      await rejectRecruiter(id);
      setRecruiters((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reject");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this recruiter?")) return;
    await deleteRecruiter(id);
    setRecruiters((prev) => prev.filter((r) => r.id !== id));
  };

  const pending   = recruiters.filter((r) => !r.isVerified);
  const verified  = recruiters.filter((r) => r.isVerified);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Manage Recruiters</h1>
          <Link
            to="/admin/pending-recruiters"
            className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-xl hover:bg-yellow-100 transition"
          >
            <Clock className="h-4 w-4" />
            Pending Approvals
            {pending.length > 0 && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {pending.length}
              </span>
            )}
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* ── Pending section ── */}
        {!loading && pending.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Awaiting Approval ({pending.length})
            </h2>
            <div className="space-y-3">
              {pending.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-xl border border-yellow-100 px-5 py-4 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0 text-yellow-700 font-bold">
                      {(r.firstName || "R")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{r.firstName} {r.lastName}</p>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pending</span>
                      </div>
                      <p className="text-xs text-gray-500">{r.email}</p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                        {r.phoneNumber && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{r.phoneNumber}</span>}
                        {r.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.location}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(r.id)}
                      disabled={actionId === r.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(r.id)}
                      disabled={actionId === r.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Verified section ── */}
        {!loading && (
          <div>
            <h2 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Verified Recruiters ({verified.length})
            </h2>
            {verified.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">No verified recruiters yet.</p>
            )}
            <div className="space-y-3">
              {verified.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{r.firstName} {r.lastName}</p>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
                      </div>
                      <p className="text-xs text-gray-500">{r.email}</p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                        {r.phoneNumber && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{r.phoneNumber}</span>}
                        {r.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.location}</span>}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
