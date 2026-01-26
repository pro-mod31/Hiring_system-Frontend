import { Button } from "../components/ui/Button";
import { Search, Users, Briefcase, Target, CheckCircle } from "lucide-react";
import JobsList from "./JobsList";
import { Link } from "react-router-dom";

const Home = () => {
  const stats = [
    { icon: Briefcase, label: "Active Jobs", value: "2,500+" },
    { icon: Users, label: "Companies", value: "500+" },
    { icon: Target, label: "Successful Hires", value: "10,000+" },
    { icon: CheckCircle, label: "Success Rate", value: "95%" },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center bg-blue-600 p-4 h-max-screen">
        <h1 className="text-8xl font-bold text-white text-center mt-10">
          Find Your Dream Jobs <br />
          <span className="text-blue-800">Today</span>
        </h1>
        <p className="text-white text-center mt-9 max-w-4xl text-2xl">
          Connect with top employers and discover opportunities that <br />
          <span>match your skills and aspirations.</span>
        </p>

        {/* Search */}
        <div className="max-w-2xl w-full mx-auto bg-white backdrop-blur-sm rounded-lg p-1 mt-9 shadow-lg">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-1 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-800" />
              <input
                type="text"
                id="search"
                placeholder="Search for jobs, companies, or keywords"
                className="w-full p-1.5 rounded-lg pl-10 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <Button size="lg" className="px-6 bg-blue-600 text-white hover:bg-blue-700">
              Search Jobs
            </Button>
          </div>
        </div>

        <p className="text-white text-center mt-4 text-sm mb-10">
          Popular Searches: Software Engineer, Data Scientist, Product Manager, Designer
        </p>
      </div>

      {/* Stats Section */}
      <section className="p-5">
        <div className="mx-auto px-2 sm:px-6 lg:px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-1">
                <div className="inline-flex p-2 rounded-full bg-blue-100">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section className="p-5">
        <h2 className="text-3xl font-bold mb-6">Latest Jobs</h2>
        <JobsList limit={3} /> {/* Only show 3 jobs on Home */}
      </section>
      <div className="flex justify-center mt-1">
        <Link to="/jobs">
          <button className="text-black border-0.5 rounded-xl p-2 hover:bg-blue-600 hover:text-white transition">
            View All Jobs
          </button>
        </Link>
      </div>
      <div className="text-black mt-6">
        <div className=" justify-center text-center">
          <h2 className="font-bold text-4xl">How it work</h2>
          <p className="text-xl mt-1">Get hired in three simple steps</p>
        </div>
        <div className="grid grid-cols-3">
          <div>
            
          </div>

        </div>
      </div>

    </>
  );
};

export default Home;
