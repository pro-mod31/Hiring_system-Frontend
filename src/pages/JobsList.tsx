import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { getJobs, type Job } from "../services/jobs.api";

interface Props {
  limit?: number;
}

export default function JobsList({ limit }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getJobs()
      .then((data) => setJobs(limit ? data.slice(0, limit) : data))
      .catch((err) => setError(err.message || "Failed to load jobs"))
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 text-sm">
        {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        No jobs available at the moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
