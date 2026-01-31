import React, { useState, useCallback } from "react";
import {
  FaChartLine,
  FaLightbulb,
  FaRocket,
  FaHandshake,
  FaCogs,
  FaUserGraduate,
  FaAward,
  FaChalkboardTeacher,
} from "react-icons/fa";
import api from '../api';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const About = () => {
  const [achievements, setAchievements] = useState([]);
  const [achLoading, setAchLoading] = useState(true);
  const [achError, setAchError] = useState(null);

  const fetchAchievements = useCallback(async (refreshType = 'initial') => {
    setAchLoading(true);
    setAchError(null);
    try {
      console.log(`Fetching achievements (${refreshType})...`);
      const res = await api.get('/api/achievements');
      setAchievements(res.data || []);
    } catch (err) {
      setAchError('Failed to load achievements');
    } finally {
      setAchLoading(false);
    }
  }, []);

  // Use the auto-refresh hook
  useAutoRefresh(fetchAchievements, [], 30000);

  const getImageUrl = (image, id) => {
    if (image && image.startsWith('data:')) return image;
    return `${API_BASE}/api/achievements/${id}/image`;
  };

  return (
    <section id="about" className="bg-white pt-[120px]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-indigo-100 py-16 mb-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-800 mb-4 drop-shadow-sm">
            About Vagus Science Academy
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
            Empowering students to achieve their dreams through quality education, mentorship, and innovation.
                </p>
          <a
            href="#contact"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-indigo-700 transition"
          >
            Join Us
          </a>
            </div>
          </div>

      {/* Academy Overview & Director's Message */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center mb-20">
        {/* Overview */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Who We Are</h2>
          <p className="text-gray-700 mb-4">
            Vagus Science Academy is dedicated to nurturing the next generation of medical and science professionals. Our mission is to provide a supportive, inclusive, and innovative environment where every student can thrive and reach their full potential. We believe in integrity, operational excellence, and a student-first approach.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2"><FaChartLine className="text-blue-600" /> Focused on growth and progress for every student</li>
            <li className="flex items-center gap-2"><FaHandshake className="text-green-600" /> Building trust and lifelong relationships</li>
            <li className="flex items-center gap-2"><FaRocket className="text-pink-500" /> Embracing innovation in teaching and learning</li>
          </ul>
        </div>
        {/* Director's Message */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">About Vagus Science Academy</h3>
          <p className="text-gray-600 mb-3 text-sm">
            Hear from our Director about our vision, values, and commitment to student success.
          </p>
          <div className="rounded-lg overflow-hidden aspect-video">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/uQzFihB5-B4"
              title="Director's Message"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Achievements Row */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-indigo-50 rounded-lg p-6 flex flex-col items-center">
            <FaUserGraduate className="text-3xl text-indigo-600 mb-2" />
            <div className="text-2xl font-bold text-indigo-800">2000+</div>
            <div className="text-gray-700">Students Trained</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-6 flex flex-col items-center">
            <FaAward className="text-3xl text-yellow-500 mb-2" />
            <div className="text-2xl font-bold text-yellow-600">100+</div>
            <div className="text-gray-700">Top NEET Ranks</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-6 flex flex-col items-center">
            <FaChalkboardTeacher className="text-3xl text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-700">15+</div>
            <div className="text-gray-700">Expert Faculty</div>
          </div>
          </div>
        </div>

      {/* Core Values Grid */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center mb-8">
          <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full inline-block">
            Our Core Values
          </span>
          <h2 className="text-2xl font-bold mt-2">Unleash Your Potential</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            We are committed to fostering creativity, innovation, and integrity in every aspect of our academy.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <FaLightbulb className="text-indigo-600 text-xl" />,
              title: "Creative Thinking",
              desc: "We nurture problem-solving and new ideas through critical thinking.",
            },
            {
              icon: <FaRocket className="text-pink-500 text-xl" />,
              title: "Innovation",
              desc: "Empowering students through innovative methods and digital tools.",
            },
            {
              icon: <FaHandshake className="text-green-500 text-xl" />,
              title: "Integrity",
              desc: "Trust, honesty and responsibility in everything we do.",
            },
            {
              icon: <FaCogs className="text-yellow-500 text-xl" />,
              title: "Operational Excellence",
              desc: "Systematic processes that ensure results and consistency.",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded p-5 shadow-sm hover:shadow-md transition flex flex-col items-start"
            >
              <div className="mb-3">{card.icon}</div>
              <h4 className="font-semibold text-gray-800 mb-2">{card.title}</h4>
              <p className="text-sm text-gray-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements & Appreciation Section */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="text-center mb-8">
          <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full inline-block">
            Achievements & Appreciation
          </span>
          <h2 className="text-2xl font-bold mt-2">Our Achievements</h2>
        </div>
        {achLoading ? (
          <div className="text-center text-gray-500">Loading achievements...</div>
        ) : achError ? (
          <div className="text-center text-red-600">{achError}</div>
        ) : achievements.length === 0 ? (
          <div className="text-center text-gray-500">No achievements added yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {achievements.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden aspect-square relative">
                {item.image && (
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={getImageUrl(item.image, item.id)}
                      alt={item.title}
                      className="w-full h-full object-contain object-center"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
