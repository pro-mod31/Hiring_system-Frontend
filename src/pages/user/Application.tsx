import { useEffect, useState } from "react";
import { getMyApplications, filterSkillKeywords, type Application } from "../../services/applications.api";
import { FileText, Briefcase, MapPin, DollarSign, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  applied:      { label: "Applied",      color: "bg-blue-100 text-blue-700" },
  under_review: { label: "Under Review", color: "bg-yellow-100 text-yellow-700" },
  interview:    { label: "Interview",    color: "bg-purple-100 text-purple-700" },
  hired:        { label: "Hired",        color: "bg-green-100 text-green-700" },
  rejected:     { label: "Rejected",     color: "bg-red-100 text-red-700" },
};

const STATUS_MESSAGE: Record<string, string> = {
  applied:      "Your application has been submitted. Waiting for recruiter review.",
  under_review: "The recruiter is currently reviewing your application.",
  interview:    "Congratulations! You've been selected for an interview.",
  hired:        "🎉 You've been hired! Congratulations!",
  rejected:     "Unfortunately, your application was not selected this time.",
};

export default function Application() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const justApplied = (location.state as any)?.justApplied === true;
  const [showBanner, setShowBanner] = useState(justApplied);

  useEffect(() => {
    getMyApplications()
      .then((data) => setApps(Array.isArray(data) ? data : []))
      .catch((err) => {
        const msg: string = err?.response?.data?.message || "";
        // If no candidate profile yet — show empty state, not error
        if (err?.response?.status === 404 || msg.toLowerCase().includes("profile")) {
          setApps([]);
        } else {
          setError("Failed to load applications. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!showBanner) return;
    const t = setTimeout(() => setShowBanner(false), 6000);
    return () => clearTimeout(t);
  }, [showBanner]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <Link to="/jobs" className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
            <Briefcase className="h-4 w-4" /> Browse Jobs
          </Link>
        </div>

        {/* Success banner after applying */}
        {showBanner && (
          <div className="mb-5 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800">Application Submitted Successfully!</p>
              <p className="text-xs text-green-700 mt-0.5">
                Your application has been submitted. Please wait for the recruiter to review it — your status will update here.
              </p>
            </div>
          </div>
        )}

        {/* Info banner when applications exist */}
        {apps.length > 0 && !showBanner && (
          <div className="mb-5 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3 flex items-center gap-3">
            <Clock className="h-4 w-4 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700">
              Your applications have been submitted. Please wait for recruiter actions — status updates will appear below.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!error && apps.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-7 w-7 text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Start applying to jobs to track your progress here.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        {/* Applications list */}
        {apps.length > 0 && (
          <div className="space-y-3">
            {apps.map((app) => {
              const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
              const statusMsg = STATUS_MESSAGE[app.status] || "";
              return (
                <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="p-3 bg-blue-50 rounded-xl shrink-0">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {app.Job?.title || `Job #${app.jobId}`}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                          {app.Job?.department && <span>{app.Job.department}</span>}
                          {app.Job?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />{app.Job.location}
                            </span>
                          )}
                          {app.Job?.salaryRange && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />{app.Job.salaryRange}
                            </span>
                          )}
                        </div>
                        {app.Job?.Recruiter && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            Recruiter: {app.Job.Recruiter.firstName} {app.Job.Recruiter.lastName}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          Applied {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Status message */}
                  {statusMsg && (
                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-gray-400 shrink-0" />
                      <p className="text-xs text-gray-500">{statusMsg}</p>
                    </div>
                  )}

                  {/* Match Score */}
                  {app.matchScore !== undefined && app.matchScore !== null && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
                          Match Score:
                          <strong className={`${
                            app.matchScore >= 70 ? "text-green-600" :
                            app.matchScore >= 40 ? "text-yellow-600" : "text-red-500"
                          }`}>{app.matchScore}%</strong>
                        </div>
                        {app.matchSummary && (
                          <span className="text-xs text-gray-400">· {app.matchSummary}</span>
                        )}
                      </div>
                      {/* Score bar */}
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            app.matchScore >= 70 ? "bg-green-500" :
                            app.matchScore >= 40 ? "bg-yellow-500" : "bg-red-400"
                          }`}
                          style={{ width: `${app.matchScore}%` }}
                        />
                      </div>
                      {/* Breakdown */}
                      {app.breakdown && (
                        <div className="flex gap-3 flex-wrap pt-0.5">
                          {app.breakdown.uniqueMatchCount !== undefined && (
                            <span className="text-xs text-gray-500 font-medium">
                              Matched skills:
                              <strong className="text-blue-600 ml-1">
                                {app.breakdown.uniqueMatchCount} / 20
                              </strong>
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            Keywords: <strong className="text-gray-600">{app.breakdown.keywordScore}%</strong>
                          </span>
                          <span className="text-xs text-gray-400">
                            TF-IDF: <strong className="text-gray-600">{app.breakdown.tfidfScore}%</strong>
                          </span>
                          <span className="text-xs text-gray-400">
                            Phrases: <strong className="text-gray-600">{app.breakdown.bigramScore}%</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Matched Keywords — filtered to show only skill keywords */}
                  {Array.isArray(app.matchedKeywords) && app.matchedKeywords.length > 0 && (() => {
                    const skillKws = filterSkillKeywords(app.matchedKeywords);
                    if (skillKws.length === 0) return null;
                    return (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {skillKws.slice(0, 8).map((kw) => (
                          <span key={kw} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                            {kw}
                          </span>
                        ))}
                        {skillKws.length > 8 && (
                          <span className="text-xs text-gray-400 px-1 py-0.5">
                            +{skillKws.length - 8} more
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
