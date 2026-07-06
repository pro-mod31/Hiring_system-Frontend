import { Briefcase, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Briefcase className="h-4 w-4" />
            </div>
            HireVelocity
          </div>
          <p className="text-sm leading-relaxed">
            Connecting top talent with great opportunities. Streamline your hiring process with our
            advanced recruitment platform.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/jobs", label: "Browse Jobs" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* For Employers */}
        <div>
          <h3 className="text-white font-semibold mb-4">For Employers</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/admin" className="hover:text-white transition-colors">Post a Job</Link></li>
            <li><span className="text-gray-500">Pricing</span></li>
            <li><span className="text-gray-500">Resources</span></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-400" />
              contact@hirevelocity.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-400" />
              +1 (555) 123-4567
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-400" />
              123 Business Ave, Suite 100
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} HireVelocity. All rights reserved.
      </div>
    </footer>
  );
}
