import JobsList from "./JobsList";

export default function JobsPage() {
  return (
    <div className="p-5">
      <div className="bg-gray-100 text-black py-6 text-center">
                <h1 className="text-6xl font-bold">Find Your Perfect Job</h1>
                <p className="mt-2">
                    Discover opportunities that match your skills and career goals
                </p>
            </div>
      <JobsList /> 
    </div>
  );
}
