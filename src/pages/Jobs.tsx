import { useEffect, useState } from "react";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  department: string;
  location: string;
  salaryRange: string;
  status: string;
}

const API_URL = import.meta.env.VITE_API_URL;

function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      try {
        if (!API_URL) {
          throw new Error("API URL is not defined");
        }

        const res = await fetch(`${API_URL}/job`, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const rawData = await res.json();

        // ✅ SAFETY: ensure jobs is always an array
        if (Array.isArray(rawData)) {
          setJobs(rawData);
        } else if (Array.isArray(rawData.data)) {
          setJobs(rawData.data);
        } else if (rawData) {
          setJobs([rawData]);
        } else {
          setJobs([]);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="bg-gray-100 text-black py-6 text-center">
        <h1 className="text-4xl font-bold">Find Your Perfect Job</h1>
        <p className="mt-2">
          Discover opportunities that match your skills and career goals
        </p>
      </div>

      {/* Job Cards */}
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Available Jobs</h2>

        {loading && <p>Loading jobs…</p>}

        {error && (
          <p className="text-red-600 font-medium">
            Error: {error}
          </p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p>No jobs available.</p>
        )}

        {!loading &&
          !error &&
          jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-2xl p-6 shadow-md bg-white hover:shadow-lg transition mb-6"
            >
              {/* Title & Status */}
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {job.title}
                </h3>

                <span
                  className={`text-sm px-3 py-1 rounded-full capitalize ${
                    job.status === "open"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mt-3">
                {job.description}
              </p>

              {/* Job Details */}
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <p><strong>Department:</strong> {job.department}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Requirements:</strong> {job.requirements}</p>
                <p><strong>Salary:</strong> {job.salaryRange}</p>
              </div>

              {/* Action Button */}
              <button className="mt-6 w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition">
                Apply Now
              </button>
            </div>
          ))}
      </div>
    </>
  );
}

export default JobsPage;
