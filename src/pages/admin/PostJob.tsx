// Admin view of PostJob — redirects to recruiter version
// Admins don't post jobs directly; recruiters do.
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

export default function AdminPostJob() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center max-w-md">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="h-7 w-7 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Job Posting</h2>
        <p className="text-gray-500 text-sm mb-6">
          Jobs are posted by recruiters. As an admin, you can view and manage all existing job listings.
        </p>
        <Link to="/admin/jobs" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
          View All Jobs
        </Link>
      </div>
    </div>
  );
}
