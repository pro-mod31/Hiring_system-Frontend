import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserDashboard, type UserDashboard } from "../../services/dashboard.api";
import { getMatchedJobs } from "../../services/ai.api";
import { getFullName } from "../../utils/storage";
import { User, Briefcase, FileText, Calendar, TrendingUp, ChevronRight, Sparkles, MapPin, DollarSign } from "lucide-react";

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}><Icon className="h-5 w-5 text-white" /></div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<UserDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);

  useEffect(() => {
    getUserDashboard().then(setData).catch(console.error).finally(() => setLoading(false));
    // Load AI-matched jobs silently — don't block the page if it fails
    getMatchedJobs().then(setMatchedJobs).catch(() => null);
  }, []);

  const cards = [
    { icon: User,     label: "My Profile",       to: "/user/profile",      desc: "View and edit your profile" },
    { icon: Briefcase,label: "Browse Jobs",       to: "/jobs",              desc: "Explore open positions" },
    { icon: FileText, label: "My Applications",   to: "/user/applications", desc: "Track your applications" },
    { icon: Calendar, label: "My Interviews",     to: "/user/interviews",   desc: "View scheduled interviews" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {getFullName(user)} 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Here's your job search overview.</p>
          </div>
          <button onClick={logout} className="text-sm text-red-500 hover:text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition">Sign out</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {loading ? (
          <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={FileText}   label="Total Applications"  value={data.overview.totalApplications}  color="bg-blue-500" />
              <StatCard icon={TrendingUp} label="Active"              value={data.overview.activeApplications} color="bg-purple-500" />
              <StatCard icon={Calendar}   label="Upcoming Interviews" value={data.overview.upcomingInterviews}  color="bg-orange-500" />
              <StatCard icon={Briefcase}  label="Hired"               value={data.overview.totalHires}          color="bg-green-500" />
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Application Status</h3>
              <div className="grid grid-cols-5 gap-3 text-center">
                {[
                  { label: "Applied",      value: data.applicationStatus.applied,     color: "bg-blue-100 text-blue-700" },
                  { label: "Under Review", value: data.applicationStatus.underReview,  color: "bg-yellow-100 text-yellow-700" },
                  { label: "Interview",    value: data.applicationStatus.interview,    color: "bg-purple-100 text-purple-700" },
                  { label: "Hired",        value: data.applicationStatus.hired,        color: "bg-green-100 text-green-700" },
                  { label: "Rejected",     value: data.applicationStatus.rejected,     color: "bg-red-100 text-red-700" },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`p-3 rounded-xl ${color}`}>
                    <p className="text-xl font-bold">{value}</p>
                    <p className="text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Interviews */}
            {data.upcomingInterviews.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Upcoming Interviews</h3>
                  <Link to="/user/interviews" className="text-xs text-blue-600 hover:text-blue-700">View all</Link>
                </div>
                <div className="space-y-2">
                  {data.upcomingInterviews.map((iv) => (
                    <div key={iv.interviewId} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{iv.jobTitle}</p>
                        <p className="text-xs text-gray-500">{iv.company} · {iv.duration} min</p>
                        {iv.feedback && <p className="text-xs text-gray-400 mt-0.5">Feedback: {iv.feedback}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-700">{new Date(iv.scheduleDate).toLocaleDateString()}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          iv.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                          iv.status === "completed" ? "bg-green-100 text-green-700" :
                          "bg-red-100 text-red-700"
                        }`}>{iv.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Applications */}
            {data.recentApplications.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Recent Applications</h3>
                  <Link to="/user/applications" className="text-xs text-blue-600 hover:text-blue-700">View all</Link>
                </div>
                <div className="space-y-2">
                  {data.recentApplications.slice(0, 4).map((app) => (
                    <div key={app.applicationId} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{app.jobTitle}</p>
                        <p className="text-xs text-gray-500">{app.company} · {app.location}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                        app.status === "hired"        ? "bg-green-100 text-green-700" :
                        app.status === "rejected"     ? "bg-red-100 text-red-700" :
                        app.status === "interview"    ? "bg-purple-100 text-purple-700" :
                        app.status === "under_review" ? "bg-yellow-100 text-yellow-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>{app.status.replace("_", " ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}

        {/* AI Matched Jobs */}
        {matchedJobs.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI-Matched Jobs</h3>
                  <p className="text-xs text-gray-500">Jobs ranked by how well they match your profile</p>
                </div>
              </div>
              <Link to="/jobs" className="text-xs text-blue-600 hover:text-blue-700">Browse all</Link>
            </div>
            <div className="space-y-3">
              {matchedJobs.slice(0, 4).map((job: any) => (
                <div key={job.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                      {job.department && <span>{job.department}</span>}
                      {job.location && (
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" />{job.location}
                        </span>
                      )}
                      {job.salaryRange && (
                        <span className="flex items-center gap-0.5">
                          <DollarSign className="h-3 w-3" />{job.salaryRange}
                        </span>
                      )}
                    </div>
                  </div>
                  {job.matchScore !== undefined && (
                    <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                      job.matchScore >= 70 ? "bg-green-100 text-green-700" :
                      job.matchScore >= 40 ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {job.matchScore}% match
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ icon: Icon, label, to, desc }) => (
            <Link key={to} to={to}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4 group">
              <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition"><Icon className="h-5 w-5 text-blue-600" /></div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm">{label}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
