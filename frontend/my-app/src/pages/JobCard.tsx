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

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="border rounded-2xl p-6 shadow-md bg-white hover:shadow-lg transition mb-6">
      {/* Title & Status */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800">{job.title}</h3>
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
      <p className="text-gray-600 mt-3">{job.description}</p>

      {/* Job Details */}
      <div className="mt-4 space-y-2 text-sm text-gray-700">
        <p><strong>Department:</strong> {job.department}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Requirements:</strong> {job.requirements}</p>
        <p><strong>Salary:</strong> {job.salaryRange}</p>
      </div>

      {/* Action Button */}
      <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-800 transition cursor-pointer">
        Apply Now
      </button>
    </div>
  );
}
