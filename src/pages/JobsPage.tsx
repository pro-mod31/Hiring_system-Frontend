import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import JobCard from "./JobCard";
import { getJobs, type Job } from "../services/jobs.api";

export default function JobsPage() {
  const [searchParams] = useSearchParams();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  // If arriving with a search query, show all statuses so results aren't hidden
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">(initialQuery ? "all" : "open");
  const [deptFilter, setDeptFilter] = useState("");

  // Fetch all jobs once
  useEffect(() => {
    getJobs()
      .then((data) => {
        setAllJobs(data);
      })
      .catch(() => setError("Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  // Re-filter whenever query / filters change
  useEffect(() => {
    let result = [...allJobs];

    if (statusFilter !== "all") {
      result = result.filter((j) => j.status === statusFilter);
    }

    if (deptFilter) {
      result = result.filter((j) =>
        j.department?.toLowerCase().includes(deptFilter.toLowerCase())
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.department?.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q) ||
          j.requirements?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [allJobs, query, statusFilter, deptFilter]);

  // Unique departments for filter dropdown
  const departments = Array.from(
    new Set(allJobs.map((j) => j.department).filter(Boolean))
  ).sort();

  const clearFilters = () => {
    setQuery("");
    setStatusFilter("open");
    setDeptFilter("");
  };

  const hasActiveFilters = query || statusFilter !== "open" || deptFilter;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-blue-600 py-14 px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold">Find Your Perfect Job</h1>
        <p className="mt-3 text-blue-100 text-lg">
          Discover opportunities that match your skills and career goals
        </p>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mt-8 bg-white rounded-xl flex items-center gap-2 px-4 py-2 shadow-lg">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by title, department, location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm text-gray-800 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters + Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="font-medium">Filters:</span>
          </div>

          {/* Status */}
          <div className="flex gap-1">
            {(["open", "closed", "all"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                  statusFilter === s
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>

          {/* Department */}
          {departments.length > 0 && (
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}

          {/* Clear */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-500 border border-red-200 hover:bg-red-50 transition"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}

          <span className="ml-auto text-xs text-gray-400">
            {loading ? "Loading..." : `${filtered.length} position${filtered.length !== 1 ? "s" : ""} found`}
          </span>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-sm py-12">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No jobs match your search.</p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-3 text-blue-600 text-sm hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
