import { Heart, Target, CheckCircle, Award, Users, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  { icon: Heart, title: "People First", desc: "Great companies are built by great people. Every interaction matters." },
  { icon: Target, title: "Excellence", desc: "We strive for excellence in everything we do, from platform to service." },
  { icon: CheckCircle, title: "Integrity", desc: "Transparency and honesty guide all our relationships." },
  { icon: Award, title: "Innovation", desc: "We continuously innovate to improve the hiring experience for everyone." },
];

const stats = [
  { value: "50,000+", label: "Successful Placements" },
  { value: "1,000+", label: "Partner Companies" },
  { value: "95%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support Available" },
];

const team = [
  { name: "Sarah Johnson", role: "CEO & Founder", desc: "Former VP of Talent at major tech companies." },
  { name: "Michael Chen", role: "CTO", desc: "Tech veteran with 15+ years building scalable platforms." },
  { name: "Emily Rodriguez", role: "Head of Operations", desc: "Operations expert focused on seamless experiences." },
  { name: "David Kim", role: "Head of Product", desc: "Product leader passionate about user-centered design." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-blue-600 py-20 px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold">About HireVelocity</h1>
        <p className="mt-4 text-blue-100 text-lg max-w-2xl mx-auto">
          Revolutionizing the hiring process by connecting talented professionals with companies that value their skills.
        </p>
      </section>

      {/* Mission + Stats */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            We believe finding the right job shouldn't be frustrating. Through innovative technology and
            personalized service, we're building a platform where talent meets opportunity seamlessly.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            <Briefcase className="h-4 w-4" /> Explore Opportunities
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg grid grid-cols-2 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-blue-600">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="text-gray-500 mt-2">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-md transition">
                <div className="inline-flex p-3 rounded-full bg-blue-50 mb-4">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
          <p className="text-gray-500 mt-2">The passionate people behind HireVelocity</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map(({ name, role, desc }) => (
            <div key={name} className="text-center p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-blue-600 font-medium">{role}</p>
              <p className="text-xs text-gray-500 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 px-4 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to Transform Your Hiring?</h2>
        <p className="mt-3 text-blue-100">Join thousands of companies and candidates who trust HireVelocity.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/jobs"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition text-sm"
          >
            Find Your Next Role
          </Link>
          <Link
            to="/contact"
            className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition text-sm"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
