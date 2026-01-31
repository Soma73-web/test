import React, { useState } from "react";
import { Link } from "react-router-dom";

const Courses = () => {
  const [activeTab, setActiveTab] = useState("neet");

  const courses = {
    neet: [
      {
        title: "NEET – Two Year Premier Course",
        duration: "2 Years",
        level: "Class 11th",
        features: [
          "Starts From July 2025",
          "For 11th-Grade Students",
          "15+ Hours Of Weekly (Offline Classes)",
          "Online Supportive Classes",
          "Topic-Wise Full Syllabus Notes",
          "Regular Assessment & Test Prep",
        ],
        price: "Contact for Fees",
        popular: true,
      },
      {
        title: "NEET – One Year Premier Course",
        duration: "1 Year",
        level: "Class 12th",
        features: [
          "Starts From June 2025",
          "For 12th-Grade Students",
          "15+ Hours Of Weekly (Offline Classes)",
          "Online Supportive Classes",
          "Topic-Wise Full Syllabus Notes",
          "Regular Assessment & Test Prep",
        ],
        price: "Contact for Fees",
        popular: false,
      },
      {
        title: "NEET Crash Course",
        duration: "1 Month",
        level: "Intensive",
        features: [
          "Starts From March 2025",
          "One Month Of Intensive Coaching",
          "54+ Hours Of Weekly (Online/Offline Classes)",
          "Live Doubt Clearing Session",
          "Online Supportive Classes",
          "Regular Assessment & Test Prep",
        ],
        price: "Contact for Fees",
        popular: false,
      },
      {
        title: "NEET Repeater Course",
        duration: "1 Year",
        level: "Post 12th",
        features: [
          "Starts From June 2025",
          "For Post-12th Graders To Excel In The Coming Year's NEET",
          "38+ Hours Of Weekly (Online/Offline Classes)",
          "Live Doubt Clearing Session",
          "Online Supportive Classes",
          "Topic-Wise Full Syllabus Notes",
          "Regular Assessment & Test Prep",
        ],
        price: "Contact for Fees",
        popular: false,
      },
    ],
    jee: [
      {
        title: "JEE – Main Course",
        duration: "2 Years",
        level: "Class 11th-12th",
        features: [
          "Comprehensive JEE Main preparation",
          "Expert faculty guidance",
          "Regular mock tests",
        ],
        price: "Contact for Fees",
        popular: false,
      },
      {
        title: "JEE – Advanced Course",
        duration: "1 Year",
        level: "JEE Main Qualified",
        features: [
          "Advanced problem solving",
          "IIT level preparation",
          "Personalized mentoring",
        ],
        price: "Contact for Fees",
        popular: false,
      },
    ],
    foundation: [
      {
        title: "Foundation for Class 8",
        duration: "1 Year",
        level: "Class 8th",
        features: [
          "Basics of Science & Math",
          "Early NEET/JEE concepts",
          "Foundation building",
        ],
        price: "Contact for Fees",
        popular: false,
      },
      {
        title: "Foundation for Class 9 & 10",
        duration: "2 Years",
        level: "Class 9th-10th",
        features: [
          "Physics, Chemistry, Math, Biology",
          "Olympiad Coaching",
          "Board exam preparation",
        ],
        price: "Contact for Fees",
        popular: false,
      },
    ],
  };

  return (
    <section
      id="courses"
      className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-600">Courses</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Choose from our comprehensive range of courses designed to help you
            excel in NEET, JEE, and foundation studies. Expert faculty, proven
            methodology, and personalized attention guaranteed.
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Course Category Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
            {["neet", "jee", "foundation"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {tab === "neet"
                  ? "NEET Courses"
                  : tab === "jee"
                    ? "JEE Courses"
                    : "Foundation Courses"}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {courses[activeTab].map((course, idx) => (
            <div
              key={idx}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border ${
                course.popular
                  ? "border-yellow-400 ring-2 ring-yellow-400 ring-opacity-50"
                  : "border-gray-200"
              }`}
            >
              {/* Popular Badge */}
              {course.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                  🌟 Popular
                </div>
              )}

              <div className="p-6">
                {/* Course Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">
                    {course.title}
                  </h3>

                  {/* Course Meta Info */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col space-y-1">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {course.duration}
                      </span>
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {course.level}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {course.price}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Course Features:
                  </h4>
                  <ul className="space-y-2">
                    {course.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start text-sm text-gray-600"
                      >
                        <svg
                          className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/contact"
                    className="w-full inline-block text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Enquire Now
                  </Link>
                  <button className="w-full text-center border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                    Download Brochure
                  </button>
                </div>
              </div>

              {/* Bottom Accent */}
              <div
                className={`h-2 ${course.popular ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-gradient-to-r from-blue-500 to-indigo-600"}`}
              ></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Not sure which course is right for you?
            </h3>
            <p className="text-gray-600 mb-6">
              Get personalized course recommendations based on your goals and
              current academic level
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-lg"
              >
                Get Free Counseling
              </Link>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300">
                Download Prospectus
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
