import { useState } from "react";
import { MapPin, Building2, DollarSign, Tag, X, FileText, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../services/applications.api";
import type { Job } from "../services/jobs.api";

interface Props { job: Job }

export default function JobCard({ job }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [cvText, setCvText] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  const openModal = () => {
    if (!user || user.role !== "user") return;
    if (job.status !== "open") return;
    setError("");
    setShowModal(true);
  };

  const handleApply = async () => {
    setApplying(true); setError("");
    try {
      await createApplication({
        jobId: job.id,
        // Only send cvText if user actually typed something
        ...(cvText.trim() ? { cvText: cvText.trim() } : {}),
      });
      setApplied(true);
      setShowModal(false);
      setTimeout(() => navigate("/user/applications", { state: { justApplied: true } }), 800);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to apply. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{job.title}</h3>
          <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
            job.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}>
            {job.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          {job.department  && <div className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-blue-400" />{job.department}</div>}
          {job.location    && <div className="flex items-center gap-1.5"><MapPin    className="h-3.5 w-3.5 text-blue-400" />{job.location}</div>}
          {job.salaryRange && <div className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-blue-400" />{job.salaryRange}</div>}
          {job.requirements && <div className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5 text-blue-400" /><span className="truncate">{job.requirements}</span></div>}
        </div>

        {user?.role === "user" ? (
          <button
            onClick={openModal}
            disabled={job.status !== "open" || applied}
            className={`mt-auto w-full py-2.5 rounded-xl text-sm font-semibold transition ${
              applied            ? "bg-green-100 text-green-700 cursor-default" :
              job.status !== "open" ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
              "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {applied ? "✓ Applied" : job.status === "open" ? "Apply Now" : "Closed"}
          </button>
        ) : (
          <div className={`mt-auto w-full py-2.5 rounded-xl text-sm font-medium text-center ${
            job.status === "open" ? "bg-gray-50 text-gray-400" : "bg-gray-100 text-gray-400"
          }`}>
            {job.status === "open" ? "Open Position" : "Closed"}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Apply for {job.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{job.department} · {job.location}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* AI match tip */}
            <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-800">Boost your match score</p>
                <p className="text-xs text-blue-700 mt-0.5">
                  Paste your CV or resume text below. Our AI uses keyword matching + TF-IDF to calculate
                  how well your profile fits this job. Without CV text, your score will be based on
                  your profile name and address only — which gives a low score.
                </p>
              </div>
            </div>

            {/* CV text area */}
            <div className="mb-4">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                <FileText className="h-3.5 w-3.5" />
                Paste your CV / Resume text
                <span className="text-gray-400 font-normal">(optional but recommended)</span>
              </label>
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder={`Example:\nReact developer with 3 years experience in TypeScript, Node.js, REST APIs, frontend development. Worked at XYZ company building scalable web applications...`}
                rows={6}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
              />
              {cvText.trim() && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {cvText.trim().split(/\s+/).length} words — AI will compute your match score
                </p>
              )}
              {!cvText.trim() && (
                <p className="text-xs text-gray-400 mt-1">
                  No CV text — score will be computed from your profile data only
                </p>
              )}
            </div>

            {error && (
              <div className="mb-3 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {applying ? "Submitting..." : "Submit Application"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
