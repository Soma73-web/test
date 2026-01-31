import React, { useState } from 'react';
import { FaMapMarkerAlt, FaClock, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });

  const courses = [
    'NEET UG',
    'NEET Crash Course',
    '11th Foundation',
    '12th Foundation',
    'Repeater Batch'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, course, message } = formData;

    if (!name || !email || !phone || !course || !message) {
      alert('Please fill in all fields');
      return;
    }

    const whatsappText = `
Hello! I'm interested in your NEET program.

Name: ${name}
Email: ${email}
Phone: ${phone}
Course: ${course}
Message: ${message}
    `.trim();

    const encodedText = encodeURIComponent(whatsappText);
    const whatsappURL = `https://wa.me/917353049113?text=${encodedText}`;
    const newTab = window.open(whatsappURL, '_blank');
    if (!newTab) alert('Please allow pop-ups for this site.');
  };

  return (
    <section className="pt-24 pb-16 bg-white text-center min-h-screen">
      <h2 className="text-3xl font-bold mb-10">Contact Us</h2>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-start gap-4 bg-gray-50 p-4 rounded shadow">
            <FaMapMarkerAlt className="text-red-600 text-2xl mt-1" />
            <div>
              <h4 className="font-bold text-sm text-gray-700">Head Office</h4>
              <p className="text-gray-600 text-sm">
                141, 3rd Main, 1st Block, Kuvempu Nagar, Tumkur - 572103
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-gray-50 p-4 rounded shadow">
            <FaClock className="text-red-600 text-2xl mt-1" />
            <div>
              <h4 className="font-bold text-sm text-gray-700">Working Hours</h4>
              <p className="text-gray-600 text-sm">
                Weekdays: 10:00 AM – 06:00 PM<br />
                Saturday: 10:00 AM – 03:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-gray-50 p-4 rounded shadow">
            <FaPhoneAlt className="text-red-600 text-2xl mt-1" />
            <div>
              <h4 className="font-bold text-sm text-gray-700">Phone</h4>
              <p className="text-red-500 text-sm">9740800250</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-gray-50 p-4 rounded shadow">
            <FaEnvelope className="text-red-600 text-2xl mt-1" />
            <div>
              <h4 className="font-bold text-sm text-gray-700">Email</h4>
              <p className="text-sm">info@vagusneetacademy.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-6 rounded shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Select a Course</option>
              {courses.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              rows="4"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition"
            >
              Send on WhatsApp
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-6xl mx-auto mt-12 px-4">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62273.4102483662!2d76.9705707!3d13.3320577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb1bd98a624b95d%3A0xd7aaf97e981bf230!2sKuvempu%20Nagar%2C%20Tumkur%2C%20Karnataka%20572103!5e0!3m2!1sen!2sin!4v1717579485687!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="rounded shadow"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
};

export default Contact;
