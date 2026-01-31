import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/logoo.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center pt-10 pb-8 px-4 bg-gradient-to-br from-indigo-50 via-white to-blue-100 scroll-mt-24 overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute -top-16 -left-16 w-72 h-72 bg-indigo-100 rounded-full opacity-40 blur-2xl animate-pulse z-0" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-200 rounded-full opacity-30 blur-2xl animate-pulse z-0" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
        {/* Text Content */}
        <div className="space-y-7">
          <h1 className="text-5xl md:text-6xl font-black leading-tight text-gray-900 tracking-tight drop-shadow-lg font-sans">
            <span className="block">Bring Your <span className="text-indigo-700">NEET Vision</span> to Life</span>
            <span className="block mt-2">with <span className="text-indigo-700">Expert Mentorship</span></span>
          </h1>
          <p className="text-xl text-gray-700 max-w-xl font-medium tracking-wide">
            Join the ranks of top achievers with structured coaching, proven strategies, and expert guidance. Your medical dream starts here.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              to="/contact"
              className="inline-block bg-indigo-600 text-white text-lg font-semibold px-7 py-3 rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 transition duration-300"
            >
              Enquire Now →
            </Link>
            <Link
              to="/about"
              className="inline-block bg-white border border-indigo-600 text-indigo-700 text-lg font-semibold px-7 py-3 rounded-full shadow hover:bg-indigo-50 hover:scale-105 transition duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
        {/* Image Section */}
        <div className="flex justify-center items-center relative">
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-200 rounded-full opacity-30 blur-2xl animate-pulse z-0" />
          <img
            src={heroImage}
            alt="Students learning at NEET Academy"
            className="w-full max-w-md md:max-w-lg rounded-3xl shadow-2xl object-contain border-4 border-indigo-100 animate-fade-in z-10"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
