import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAdminDashboard, type AdminDashboard } from "../../services/dashboard.api";
import { getPendingRecruiters, type Recruiter } from "../../services/recruiters.api";
import { getFullName } from "../../utils/storage";
import {
  Users, Briefcase, FileText, Calendar, TrendingUp,
  UserCheck, Settings, ChevronRight, Clock, AlertCircle,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number | string; color: string;
}) {
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

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [pending, setPending] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminDashboard().catch(() => null),
      getPendingRecruiters().catch(() => []),
    ]).then(([dash, pend]) => {
      if (dash) setData(dash);
      setPending(pend);
    }).finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { icon: Users,      label: "Total Users",   value: data.overview.totalUsers,        color: "bg-blue-500" },
    { icon: UserCheck,  label: "Candidates",     value: data.overview.totalCandidates,   color: "bg-indigo-500" },
    { icon: Briefcase,  label: "Active Jobs",    value: data.overview.activeJobs,        color: "bg-green-500" },
    { icon: FileText,   label: "Applications",   value: data.overview.totalApplications, color: "bg-purple-500" },
    { icon: Calendar,   label: "Interviews",     value: data.overview.totalInterviews,   color: "bg-orange-500" },
    { icon: TrendingUp, label: "Total Hires",    value: data.overview.totalHires,        color: "bg-teal-500" },
  ] : [];

  const quickLinks = [
    { icon: Users,     label: "Manage Users",    desc: "View all users",                  to: "/admin/users" },
    { icon: UserCheck, label: "Candidates",       desc: "View all candidate profiles",     to: "/admin/candidates" },
    { icon: Settings,  label: "Recruiters",       desc: "Manage verified recruiters",      to: "/admin/recruiters" },
    { icon: Briefcase, label: "All Jobs",          desc: "View and manage job listings",    to: "/admin/jobs" },
    { icon: FileText,  label: "Applications",      desc: "Review all applications",         to: "/admin/applications" },
    { icon: Calendar,  label: "Interviews",        desc: "View all scheduled interviews",   to: "/admin/interviews" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome, {getFullName(user)}</p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ── Pending Recruiters Alert ── */}
        {pending.length > 0 && (
          <Link
            to="/admin/pending-recruiters"
            className="flex items-center justify-between gap-4 bg-yellow-50 border border-yellow-200 rounded-2xl px-6 py-4 hover:bg-yellow-100 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-200 rounded-xl">
                <Clock className="h-5 w-5 text-yellow-700" />
              </div>
              <div>
                <p className="text-sm font-bold text-yellow-900">
                  {pending.length} Recruiter{pending.length > 1 ? "s" : ""} Awaiting Approval
                </p>
                <p className="text-xs text-yellow-700 mt-0.5">
                  Review and approve or reject pending recruiter registrations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {pending.length}
              </span>
              <ChevronRight className="h-4 w-4 text-yellow-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map(({ icon, label, value, color }) => (
                <StatCard key={label} icon={icon} label={label} value={value} color={color} />
              ))}
            </div>

            {/* Hiring Funnel */}
            {data?.hiringFunnel && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-4">Hiring Funnel</h2>
                <div className="grid grid-cols-5 gap-3 text-center">
                  {[
                    { label: "Applied",      value: data.hiringFunnel.applied,      color: "bg-blue-100 text-blue-700" },
                    { label: "Under Review", value: data.hiringFunnel.underReview,  color: "bg-yellow-100 text-yellow-700" },
                    { label: "Interview",    value: data.hiringFunnel.interview,    color: "bg-purple-100 text-purple-700" },
                    { label: "Hired",        value: data.hiringFunnel.hired,        color: "bg-green-100 text-green-700" },
                    { label: "Rejected",     value: data.hiringFunnel.rejected,     color: "bg-red-100 text-red-700" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={`p-3 rounded-xl ${color}`}>
                      <p className="text-xl font-bold">{value}</p>
                      <p className="text-xs mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 text-center text-xs text-gray-500">
                  <div>App→Interview: <strong>{data.hiringFunnel.applicationToInterviewRate.toFixed(1)}%</strong></div>
                  <div>Interview→Hire: <strong>{data.hiringFunnel.interviewToHireRate.toFixed(1)}%</strong></div>
                  <div>Offer Acceptance: <strong>{data.hiringFunnel.offerAcceptanceRate.toFixed(1)}%</strong></div>
                </div>
              </div>
            )}

            {/* Recent Hires */}
            {data?.recentHires && data.recentHires.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-4">Recent Hires</h2>
                <div className="space-y-2">
                  {data.recentHires.slice(0, 5).map((h, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{h.candidateName}</p>
                        <p className="text-xs text-gray-500">{h.jobTitle} · {h.company}</p>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(h.hiredAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Pending approvals card — always visible */}
            <Link
              to="/admin/pending-recruiters"
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4 group relative"
            >
              <div className="p-3 bg-yellow-50 rounded-xl group-hover:bg-yellow-100 transition">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm">Pending Approvals</h3>
                <p className="text-xs text-gray-500 mt-0.5">Approve or reject recruiters</p>
              </div>
              {pending.length > 0 && (
                <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {pending.length}
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-yellow-500 transition" />
            </Link>

            {quickLinks.map(({ icon: Icon, label, desc, to }) => (
              <Link
                key={to} to={to}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4 group"
              >
                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{label}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
