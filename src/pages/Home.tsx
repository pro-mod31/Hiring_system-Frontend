import { Search, Briefcase, Users, Target, CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import JobsList from "./JobsList";

const stats = [
  { icon: Briefcase, label: "Active Jobs", value: "2,500+" },
  { icon: Users, label: "Companies", value: "500+" },
  { icon: Target, label: "Successful Hires", value: "10,000+" },
  { icon: CheckCircle, label: "Success Rate", value: "95%" },
];

const steps = [
  { num: "01", title: "Search & Apply", desc: "Browse thousands of job opportunities and apply with one click." },
  { num: "02", title: "Get Interviewed", desc: "Connect with hiring managers and schedule your interview." },
  { num: "03", title: "Start Working", desc: "Receive job offers and start your new career journey." },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/jobs?q=${encodeURIComponent(q)}` : "/jobs");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-blue-600 py-20 px-4 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Find Your Dream Job <br />
          <span className="text-blue-200">Today</span>
        </h1>
        <p className="mt-5 text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
          Connect with top employers and discover opportunities that match your skills and aspirations.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mt-8 bg-white rounded-xl flex items-center gap-2 px-4 py-2 shadow-lg">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search for jobs, companies, or keywords"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm text-gray-800 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        <p className="mt-4 text-blue-200 text-xs">
          Popular: Software Engineer · Data Scientist · Product Manager · Designer
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-blue-100">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </section>

      {/* Latest Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Jobs</h2>
          <Link
            to="/jobs"
            className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <JobsList limit={3} />
      </section>

      {/* How it works */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="text-gray-500 mt-2">Get hired in three simple steps</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ num, title, desc }) => (
            <div key={num} className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 bg-blue-600 text-white text-xl font-bold rounded-full flex items-center justify-center">
                {num}
              </div>
              <h3 className="font-bold text-lg text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
