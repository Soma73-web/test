import React, { useState, useEffect } from 'react';
import axios from 'axios';
import studentImg from '../assets/popupImage.png';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const LeadPopup = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [popupEnabled, setPopupEnabled] = useState(true);
  const [configChecked, setConfigChecked] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/leads/popup-config`);
        setPopupEnabled(res.data.enabled);
      } catch {
        setPopupEnabled(true);
      } finally {
        setConfigChecked(true);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (showSuccessAnim) {
      const timer = setTimeout(() => {
        setShowSuccessAnim(false);
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAnim, onClose]);

  if (!isOpen || !configChecked || !popupEnabled) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/leads`, form);
      setSuccess('Thank you! Your details have been submitted.');
      setForm({ name: '', phone: '' });
      setShowSuccessAnim(true);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Submission failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-lg border-2 border-blue-600 text-blue-700 text-3xl font-bold hover:bg-blue-600 hover:text-white transition"
        >
          &times;
        </button>
        {/* Full Background Image with Overlay */}
        <div className="relative w-full h-full min-h-[420px] flex flex-col items-center justify-center">
          <img
            src={studentImg}
            alt="Student"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-blue-900/70 z-0" />
          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6 py-8">
            <div className="bg-white/90 rounded-xl p-4 w-full max-w-xs mx-auto shadow-lg flex flex-col gap-4">
              <h2 className="text-lg font-bold text-blue-700 mb-2 text-center">
                Take your first step towards your doctor dream.
              </h2>
              <div className="flex items-center gap-2 text-base">
                <span className="text-blue-900 font-bold">Exemplary <span className="text-yellow-500">Faculty</span> <span className="text-green-500 ml-1">&#10003;</span></span>
              </div>
              <div className="flex items-center gap-2 text-base">
                <span className="text-blue-900 font-bold">Expert <span className="text-yellow-500">Guidance</span> <span className="text-green-500 ml-1">&#10003;</span></span>
              </div>
              <div className="flex items-center gap-2 text-base">
                <span className="text-blue-900 font-bold">Exemplary <span className="text-yellow-500">Result</span> <span className="text-green-500 ml-1">&#10003;</span></span>
              </div>
              {/* Form below credentials */}
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2 mt-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
                  maxLength={10}
                  pattern="\d{10}"
                  required
                />
                {error && <div className="text-red-600 text-xs">{error}</div>}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-1 transition text-base"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Get Started"}
                </button>
              </form>
              {showSuccessAnim && (
                <div className="flex flex-col items-center justify-center w-full animate-fade-in mt-2">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-3 animate-scale-in">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-green-700 text-base font-semibold mb-1 bg-white/80 px-3 py-1 rounded">Thank you!</div>
                  <div className="text-gray-700 text-center mb-1">We will get back to you.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadPopup; 