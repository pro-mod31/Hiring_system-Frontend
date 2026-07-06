import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { login as loginApi, recruiterLogin } from "../services/auth.api";
import ParticlesComponent from "../components/ParticlesComponent";
import { Clock } from "lucide-react";

type LoginRole = "user" | "recruiter";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginRole, setLoginRole] = useState<LoginRole>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPendingVerification(false);
    setLoading(true);
    try {
      if (loginRole === "recruiter") {
        // Use recruiter-specific login endpoint
        const user = await recruiterLogin(email, password);
        login(user);
        navigate("/recruiter");
      } else {
        const user = await loginApi(email, password);
        login(user);
        if (user.role === "admin") navigate("/admin");
        else navigate("/user");
      }
    } catch (err: any) {
      const msg: string = err.response?.data?.message || "";
      // Backend returns 403 with a "not verified" message when recruiter is pending
      if (
        err.response?.status === 403 &&
        (msg.toLowerCase().includes("verif") || msg.toLowerCase().includes("pending") || msg.toLowerCase().includes("approved"))
      ) {
        setPendingVerification(true);
      } else {
        setError(msg || "Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="relative min-h-screen flex items-center justify-center px-4">
      <ParticlesComponent id="tsparticles" className="absolute inset-0 -z-10" />
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex overflow-hidden">

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 p-10 flex flex-col justify-center gap-4"
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
            <p className="text-sm text-gray-500 mt-1">Welcome back! Enter your credentials.</p>
          </div>

          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-2">
            {(["user", "recruiter"] as LoginRole[]).map((r) => (
              <button
                key={r} type="button"
                onClick={() => { setLoginRole(r); setError(""); setPendingVerification(false); }}
                className={`py-2 rounded-xl border text-sm font-medium transition ${
                  loginRole === r
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {r === "user" ? "Job Seeker / Admin" : "Recruiter"}
              </button>
            ))}
          </div>

          {/* Pending verification banner */}
          {pendingVerification && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-4 flex gap-3">
              <Clock className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">Verification Pending</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Your recruiter credentials are being verified by our admin team.
                  Please hold on — you'll be able to log in once approved.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <input
            type="email" placeholder="Email address" value={email}
            onChange={(e) => setEmail(e.target.value)} required disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </motion.form>

        {/* Right panel */}
        <motion.div
          className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-500 to-blue-800 text-white flex-col justify-center items-center p-10 rounded-l-[60px]"
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-3 text-center">Hello!</h2>
          <p className="text-sm text-center opacity-80 mb-6">
            Don't have an account yet? Sign up and start your journey.
          </p>
          <Link
            to="/signup"
            className="border border-white rounded-full px-6 py-2 text-sm font-medium hover:bg-white hover:text-blue-700 transition"
          >
            Sign Up
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
