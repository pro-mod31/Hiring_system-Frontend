import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signup, recruiterSignup } from "../services/auth.api";
import ParticlesComponent from "../components/ParticlesComponent";
import { Clock, CheckCircle } from "lucide-react";

type RoleOption = "user" | "recruiter";
type Step = "form" | "pending";

export default function Signup() {
  const [role, setRole] = useState<RoleOption>("user");
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // User fields
  const [userForm, setUserForm] = useState({ firstName: "", lastName: "", email: "", password: "" });

  // Recruiter fields (extra: phoneNumber, location)
  const [recruiterForm, setRecruiterForm] = useState({
    firstName: "", lastName: "", email: "", password: "", phoneNumber: "", location: "",
  });

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await signup(userForm);
      // Redirect to login — user can log in immediately
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecruiterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await recruiterSignup(recruiterForm);
      // Show pending verification screen
      setStep("pending");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Pending verification screen (recruiter only) ──────────────────────────
  if (step === "pending") {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <ParticlesComponent id="pending-particles" className="absolute inset-0 -z-10" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Verification Pending</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Your recruiter account has been created successfully. Your credentials are currently
            being reviewed by our admin team.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 mb-6 text-left space-y-2">
            <p className="text-sm font-semibold text-yellow-800">What happens next?</p>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>Admin reviews your details</li>
              <li>You'll be approved or rejected</li>
              <li>Once approved, you can log in and start posting jobs</li>
            </ul>
          </div>
          <div className="flex items-center gap-2 justify-center text-xs text-gray-400 mb-6">
            <CheckCircle className="h-4 w-4 text-green-400" />
            Account registered as: <strong className="text-gray-600">{recruiterForm.email}</strong>
          </div>
          <Link
            to="/login"
            className="block w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition text-center"
          >
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Signup form ───────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <ParticlesComponent id="tsparticles" className="absolute inset-0 -z-10" />
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex overflow-hidden">

        {/* Left panel */}
        <motion.div
          className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-500 to-blue-800 text-white flex-col justify-center items-center p-10 rounded-r-[60px]"
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-3 text-center">Welcome!</h2>
          <p className="text-sm text-center opacity-80 mb-6">
            Already have an account? Sign in to continue.
          </p>
          <Link
            to="/login"
            className="border border-white rounded-full px-6 py-2 text-sm font-medium hover:bg-white hover:text-blue-700 transition"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Right panel — form */}
        <motion.div
          className="w-full md:w-1/2 p-10 flex flex-col justify-center gap-3 overflow-y-auto max-h-screen"
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
            <p className="text-sm text-gray-500 mt-1">Fill in your details to get started.</p>
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">I am a...</label>
            <div className="grid grid-cols-2 gap-2">
              {(["user", "recruiter"] as RoleOption[]).map((r) => (
                <button
                  key={r} type="button" onClick={() => { setRole(r); setError(""); }}
                  className={`py-2 rounded-xl border text-sm font-medium transition ${
                    role === r
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {r === "user" ? "Job Seeker" : "Recruiter"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* ── User form ── */}
          <AnimatePresence mode="wait">
            {role === "user" ? (
              <motion.form
                key="user-form"
                onSubmit={handleUserSubmit}
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text" placeholder="First name" value={userForm.firstName}
                    onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                    required disabled={loading}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="text" placeholder="Last name" value={userForm.lastName}
                    onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                    required disabled={loading}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <input
                  type="email" placeholder="Email address" value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="password" placeholder="Password" value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  required disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
              </motion.form>
            ) : (
              /* ── Recruiter form ── */
              <motion.form
                key="recruiter-form"
                onSubmit={handleRecruiterSubmit}
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-4 py-2 rounded-lg">
                  Recruiter accounts require admin approval before you can log in.
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text" placeholder="First name" value={recruiterForm.firstName}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, firstName: e.target.value })}
                    required disabled={loading}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="text" placeholder="Last name" value={recruiterForm.lastName}
                    onChange={(e) => setRecruiterForm({ ...recruiterForm, lastName: e.target.value })}
                    required disabled={loading}
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <input
                  type="email" placeholder="Email address" value={recruiterForm.email}
                  onChange={(e) => setRecruiterForm({ ...recruiterForm, email: e.target.value })}
                  required disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="password" placeholder="Password" value={recruiterForm.password}
                  onChange={(e) => setRecruiterForm({ ...recruiterForm, password: e.target.value })}
                  required disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="tel" placeholder="Phone number (e.g. +1234567890)" value={recruiterForm.phoneNumber}
                  onChange={(e) => setRecruiterForm({ ...recruiterForm, phoneNumber: e.target.value })}
                  required disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="text" placeholder="Location (e.g. New York, USA)" value={recruiterForm.location}
                  onChange={(e) => setRecruiterForm({ ...recruiterForm, location: e.target.value })}
                  required disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm"
                >
                  {loading ? "Submitting..." : "Submit for Approval"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
