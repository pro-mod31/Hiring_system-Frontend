import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — wire to real API when ready
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-blue-600 py-16 px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
        <p className="mt-3 text-blue-100 text-lg">We'd love to hear from you. Reach out anytime.</p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-600">
              Have questions about our platform? Want to partner with us? We're here to help.
            </p>
          </div>

          {[
            { icon: Mail, label: "Email", value: "contact@hirevelocity.com" },
            { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
            { icon: MapPin, label: "Address", value: "123 Business Ave, Suite 100, New York, NY" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">{label}</p>
                <p className="text-sm text-gray-500">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Send className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
              <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Send a Message</h3>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Your message..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
