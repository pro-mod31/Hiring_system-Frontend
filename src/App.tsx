import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import ChatBox from "./components/ChatBox/ChatBox";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import JobsPage from "./pages/JobsPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAllUsers from "./pages/admin/AllUsers";
import AdminRecruiters from "./pages/admin/Users";          // recruiter management
import AdminJobs from "./pages/admin/Jobs";
import AdminPostJob from "./pages/admin/PostJob";
import AdminApplications from "./pages/admin/Applications";
import AdminInterviews from "./pages/admin/Interviews";
import AdminCandidates from "./pages/admin/Candidates";
import PendingRecruiters from "./pages/admin/PendingRecruiters";

// Recruiter pages
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import RecruiterProfile from "./pages/recruiter/Profile";
import RecruiterJobs from "./pages/recruiter/Jobs";
import RecruiterPostJob from "./pages/recruiter/PostJob";
import RecruiterApplications from "./pages/recruiter/Applications";
import RecruiterInterviews from "./pages/recruiter/Interviews";
import RecruiterCandidates from "./pages/admin/Candidates";
import RankedCandidates from "./pages/recruiter/RankedCandidates";

// User pages
import UserDashboard from "./pages/user/Dashboard";
import UserProfile from "./pages/user/Profile";
import UserApplication from "./pages/user/Application";
import UserInterviews from "./pages/user/Interviews";

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const defaultPath =
    user?.role === "admin" ? "/admin" :
    user?.role === "recruiter" ? "/recruiter" :
    "/user";

  return (
    <div className="flex flex-col min-h-screen">
      {user && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Root */}
          <Route path="/" element={<Navigate to={user ? defaultPath : "/login"} replace />} />

          {/* Auth */}
          <Route path="/login"  element={user ? <Navigate to={defaultPath} replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to={defaultPath} replace /> : <Signup />} />

          {/* Public (requires login) */}
          <Route path="/home"    element={<AuthRedirect><Home /></AuthRedirect>} />
          <Route path="/about"   element={<AuthRedirect><About /></AuthRedirect>} />
          <Route path="/contact" element={<AuthRedirect><Contact /></AuthRedirect>} />
          <Route path="/jobs"    element={<AuthRedirect><JobsPage /></AuthRedirect>} />

          {/* ── Admin ── */}
          <Route path="/admin"                    element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users"              element={<ProtectedRoute role="admin"><AdminAllUsers /></ProtectedRoute>} />
          <Route path="/admin/recruiters"         element={<ProtectedRoute role="admin"><AdminRecruiters /></ProtectedRoute>} />
          <Route path="/admin/pending-recruiters" element={<ProtectedRoute role="admin"><PendingRecruiters /></ProtectedRoute>} />
          <Route path="/admin/candidates"         element={<ProtectedRoute role="admin"><AdminCandidates /></ProtectedRoute>} />
          <Route path="/admin/jobs"               element={<ProtectedRoute role="admin"><AdminJobs /></ProtectedRoute>} />
          <Route path="/admin/post-job"           element={<ProtectedRoute role="admin"><AdminPostJob /></ProtectedRoute>} />
          <Route path="/admin/applications"       element={<ProtectedRoute role="admin"><AdminApplications /></ProtectedRoute>} />
          <Route path="/admin/interviews"         element={<ProtectedRoute role="admin"><AdminInterviews /></ProtectedRoute>} />

          {/* ── Recruiter ── */}
          <Route path="/recruiter"                      element={<ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/recruiter/profile"              element={<ProtectedRoute role="recruiter"><RecruiterProfile /></ProtectedRoute>} />
          <Route path="/recruiter/jobs"                 element={<ProtectedRoute role="recruiter"><RecruiterJobs /></ProtectedRoute>} />
          <Route path="/recruiter/jobs/:jobId/ranked"   element={<ProtectedRoute role="recruiter"><RankedCandidates /></ProtectedRoute>} />
          <Route path="/recruiter/post-job"             element={<ProtectedRoute role="recruiter"><RecruiterPostJob /></ProtectedRoute>} />
          <Route path="/recruiter/applications"         element={<ProtectedRoute role="recruiter"><RecruiterApplications /></ProtectedRoute>} />
          <Route path="/recruiter/interviews"           element={<ProtectedRoute role="recruiter"><RecruiterInterviews /></ProtectedRoute>} />
          <Route path="/recruiter/candidates"           element={<ProtectedRoute role="recruiter"><RecruiterCandidates /></ProtectedRoute>} />

          {/* ── User ── */}
          <Route path="/user"              element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/profile"      element={<ProtectedRoute role="user"><UserProfile /></ProtectedRoute>} />
          <Route path="/user/applications" element={<ProtectedRoute role="user"><UserApplication /></ProtectedRoute>} />
          <Route path="/user/interviews"   element={<ProtectedRoute role="user"><UserInterviews /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {user && <Footer />}
      {user && <ChatBox />}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
