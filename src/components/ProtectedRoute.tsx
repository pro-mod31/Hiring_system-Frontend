import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../utils/storage";

interface Props {
  children: React.ReactElement;
  role?: Role | Role[];
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in — go to login
  if (!user) return <Navigate to="/login" replace />;

  // Wrong role — redirect to their correct dashboard, not /login (avoids redirect loop)
  if (role) {
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(user.role)) {
      const correctPath =
        user.role === "admin"     ? "/admin" :
        user.role === "recruiter" ? "/recruiter" :
        "/user";
      return <Navigate to={correctPath} replace />;
    }
  }

  return children;
}
