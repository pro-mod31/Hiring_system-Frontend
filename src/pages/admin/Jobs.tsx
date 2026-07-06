

import { useEffect, useState } from "react";
import { getJobs, deleteJob, updateJob, type Job } from "../../services/jobs.api";
import { Trash2, MapPin, Building2, Edit2, Check, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Job>>({});

  useEffect(() => {
    getJobs()
      .then(setJobs)
      .catch(() => setError("Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this job?")) return;
    await deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const startEdit = (job: Job) => {
    setEditingId(job.id);
    setEditForm({ title: job.title, department: job.department, location: job.location, status: job.status });
  };

  const saveEdit = async (id: number) => {
    await updateJob(id, editForm);
    setJobs((prev) => prev.map((j) => j.id === id ? { ...j, ...editForm } : j));
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
          <Link
            to="/admin/post-job"
            className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            + Post Job
          </Link>
        </div>

        {loading && <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!loading && jobs.length === 0 && <p className="text-gray-400 text-sm text-center py-12">No jobs found.</p>}

        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm">
              {editingId === job.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {(["title", "department", "location"] as const).map((field) => (
                      <input
                        key={field}
                        value={(editForm as any)[field] || ""}
                        onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                        placeholder={field}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ))}
                    <select
                      value={editForm.status || "open"}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Job["status"] })}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(job.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition">
                      <Check className="h-3.5 w-3.5" /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition">
                      <X className="h-3.5 w-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{job.title}</p>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full capitalize ${job.status === "open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      {job.department && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{job.department}</span>}
                      {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => startEdit(job)} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(job.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
