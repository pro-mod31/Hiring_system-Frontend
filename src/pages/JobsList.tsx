import { useEffect, useState } from "react";
import JobCard from "./JobCard";

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

// ✅ Define props interface
interface JobsListProps {
    limit?: number; // optional number of jobs to display
}

const API_URL = import.meta.env.VITE_API_URL;

export default function JobsList({ limit }: JobsListProps) { // Use props here
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchJobs() {
            try {
                if (!API_URL) throw new Error("API URL is not defined");

                const res = await fetch(`${API_URL}/job`, {
                    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
                });
                if (!res.ok) throw new Error("Failed to fetch jobs");

                const rawData = await res.json();
                let data: Job[] = [];
                if (Array.isArray(rawData)) data = rawData;
                else if (Array.isArray(rawData.data)) data = rawData.data;
                else if (rawData) data = [rawData];

                if (limit) data = data.slice(0, limit); // Only first N jobs
                setJobs(data);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        }

        fetchJobs();
    }, [limit]);

    if (loading) return <p>Loading jobs…</p>;
    if (error) return <p className="text-red-600 font-medium">Error: {error}</p>;
    if (jobs.length === 0) return <p>No jobs available.</p>;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-1">

                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </>


    );
}
