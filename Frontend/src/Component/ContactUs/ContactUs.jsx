import React from "react";

function ContactUs() {
  return (
    <section className="bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          CONTACT US
        </h2>

        <div className="grid md:grid-cols-2 gap-8 bg-white shadow-lg rounded-lg p-8">
          {/* Contact Form */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-700">
              Send Us a Message
            </h3>
            <form
              action="https://api.web3forms.com/submit"
              method="POST"
              className="space-y-4"
            >
              <input
                type="hidden"
                name="access_key"
                value={import.meta.env.VITE_ACCESS_KEY}
              />

              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none h-32"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-700">
              Contact Information
            </h3>
            <p className="text-gray-600">
              <strong>Phone:</strong> +91 6202924319
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> omku415@gmail.com
            </p>
            <p className="text-gray-600">
              <strong>Address:</strong> CUCEK
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
