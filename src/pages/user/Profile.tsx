import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getMyProfile, createCandidate, updateCandidate,
  type Candidate, type CandidatePayload,
} from "../../services/candidates.api";
import { getProfileCompleteness } from "../../services/ai.api";
import { getFullName } from "../../utils/storage";
import { User, Mail, Phone, MapPin, Link as LinkIcon, Edit2, Check, X, AlertCircle } from "lucide-react";

const EMPTY_FORM: CandidatePayload = {
  name: "", email: "", phoneNumber: "",
  temporaryAddress: "", permanentAddress: "", cvUrl: "",
};

export default function Profile() {
  const { user } = useAuth();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [completeness, setCompleteness] = useState<{ score: number; missing: string[] } | null>(null);
  const [form, setForm] = useState<CandidatePayload>(EMPTY_FORM);

  // These always come from the auth account — never editable
  const authName  = getFullName(user);
  const authEmail = user?.email || "";

  useEffect(() => {
    getMyProfile()
      .then((c) => {
        if (c) {
          setCandidate(c);
          setForm({
            name:              authName,   // always from signup firstName + lastName
            email:             authEmail,  // always from signup email
            phoneNumber:       c.phoneNumber       || "",
            temporaryAddress:  c.temporaryAddress  || "",
            permanentAddress:  c.permanentAddress  || "",
            cvUrl:             c.cvUrl             || "",
          });
          getProfileCompleteness().then(setCompleteness).catch(() => null);
        } else {
          // No profile yet — open edit mode with auth data pre-filled
          setForm({ ...EMPTY_FORM, name: authName, email: authEmail });
          setEditing(true);
        }
      })
      .catch(() => {
        setForm({ ...EMPTY_FORM, name: authName, email: authEmail });
        setEditing(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setError(""); setSuccess("");
    try {
      // name and email come from auth — always use auth values, never send email on update
      const payload: CandidatePayload = {
        name:             authName,
        email:            authEmail,
        phoneNumber:      form.phoneNumber,
        temporaryAddress: form.temporaryAddress,
        permanentAddress: form.permanentAddress,
        cvUrl:            form.cvUrl?.trim() || undefined,
      };

      if (candidate?.id) {
        // UPDATE — candidate exists, strip email and name to avoid unique/constraint issues
        const { email: _e, name: _n, ...updatePayload } = payload;
        const updated = await updateCandidate(candidate.id, updatePayload);
        setCandidate(updated ?? { ...candidate, ...updatePayload });
        setForm({
          name:             authName,
          email:            authEmail,
          phoneNumber:      (updated ?? candidate).phoneNumber       || "",
          temporaryAddress: (updated ?? candidate).temporaryAddress  || "",
          permanentAddress: (updated ?? candidate).permanentAddress  || "",
          cvUrl:            (updated ?? candidate).cvUrl             || "",
        });
      } else {
        // CREATE — no profile yet, send all fields including email
        const created = await createCandidate(payload);
        setCandidate(created);
        setForm({
          name:             authName,
          email:            authEmail,
          phoneNumber:      created.phoneNumber       || "",
          temporaryAddress: created.temporaryAddress  || "",
          permanentAddress: created.permanentAddress  || "",
          cvUrl:            created.cvUrl             || "",
        });
      }

      setSuccess("Profile saved successfully!");
      setEditing(false);
      getProfileCompleteness().then(setCompleteness).catch(() => null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Fields that are always read-only (from auth account)
  const readOnlyKeys = ["name", "email"];

  const fields: { icon: React.ElementType; label: string; key: keyof CandidatePayload; type?: string }[] = [
    { icon: User,     label: "Full Name",         key: "name" },
    { icon: Mail,     label: "Email",              key: "email",            type: "email" },
    { icon: Phone,    label: "Phone Number",       key: "phoneNumber" },
    { icon: MapPin,   label: "Temporary Address",  key: "temporaryAddress" },
    { icon: MapPin,   label: "Permanent Address",  key: "permanentAddress" },
    { icon: LinkIcon, label: "CV / Resume URL",    key: "cvUrl" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-4">

        {/* Profile Completeness */}
        {completeness && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-700">Profile Completeness</p>
              <span className={`text-sm font-bold ${
                completeness.score >= 80 ? "text-green-600" :
                completeness.score >= 50 ? "text-yellow-600" : "text-red-500"
              }`}>{completeness.score}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  completeness.score >= 80 ? "bg-green-500" :
                  completeness.score >= 50 ? "bg-yellow-500" : "bg-red-400"
                }`}
                style={{ width: `${completeness.score}%` }}
              />
            </div>
            {completeness.missing?.length > 0 && (
              <div className="mt-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500">
                  Missing: <span className="text-yellow-700 font-medium">{completeness.missing.join(", ")}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {(user?.firstName || user?.email || "U")[0].toUpperCase()}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">{authName}</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                {authEmail}
              </span>
            </div>
          </div>

          {/* Banners */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-2 rounded-lg">
              {success}
            </div>
          )}
          {!candidate && !editing && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-2 rounded-lg">
              You don't have a candidate profile yet. Fill in your details to start applying for jobs.
            </div>
          )}

          {/* Fields */}
          <div className="space-y-3">
            {fields.map(({ icon: Icon, label, key, type }) => {
              const isReadOnly = readOnlyKeys.includes(key);
              // For read-only fields always show auth values
              const displayValue = key === "name"
                ? authName
                : key === "email"
                ? authEmail
                : (form[key] as string) || "";

              return (
                <div key={key} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-blue-100 rounded-lg mt-0.5">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">
                      {label}
                      {isReadOnly && (
                        <span className="ml-1.5 text-gray-400">(from your account)</span>
                      )}
                    </p>
                    {editing && !isReadOnly ? (
                      <input
                        type={type || "text"}
                        value={(form[key] as string) || ""}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className={`text-sm font-medium ${isReadOnly ? "text-gray-700" : "text-gray-900"}`}>
                        {displayValue || <span className="text-gray-400 italic">Not set</span>}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                {candidate && (
                  <button
                    onClick={() => { setEditing(false); setError(""); }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                  >
                    <X className="h-4 w-4" />Cancel
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => { setEditing(true); setSuccess(""); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-blue-200 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-50 transition"
              >
                <Edit2 className="h-4 w-4" />Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
