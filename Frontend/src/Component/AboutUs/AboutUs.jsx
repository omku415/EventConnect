import React from "react";

function AboutUs() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center">
        {/* Content Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 id="about" className="text-4xl font-bold text-gray-800">
            ABOUT US
          </h1>
          <p className="mt-4 text-gray-600">
            Welcome to Event Connect, your go-to platform for managing and
            participating in exciting college events! Our mission is to
            streamline the process of event organization and participation,
            making it easier for students, event managers, and administrators to
            connect and engage in a vibrant college community.
          </p>

          <h3 className="mt-6 text-xl font-semibold text-gray-800">
            JOIN US IN SHAPING EVENTS
          </h3>

          <p className="mt-2 text-gray-600">
            Whether you're a student looking to join exciting events, an event
            manager aiming to organize successful gatherings, or an admin
            wanting to streamline event oversight, Event Connect is here to
            support you. Join us today and be a part of a thriving college
            community.
          </p>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
          <img
            src="https://images.pexels.com/photos/31069508/pexels-photo-31069508/free-photo-of-detailed-view-of-a-half-moon-in-clear-night-sky.jpeg"
            alt="About Us"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
