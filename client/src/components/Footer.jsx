import React from 'react';
import { Link } from 'react-router-dom';
import { FaYoutube, FaFacebook, FaInstagram } from 'react-icons/fa';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-indigo-700 text-white pt-10 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Left - Logo + Mission */}
        <div>
          <img src={logo} alt="Classic NEET Academy" className="w-28 mb-4" />
          <p className="text-sm">
            Our mission is to provide the best NEET preparation experience. From expert guidance to
            comprehensive courses, we’re here to help you succeed.
          </p>
          <div className="flex space-x-4 mt-4 text-xl">
            <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
          </div>
        </div>

        {/* Main Menu */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Main Menu</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/directors-message">Director's Message</Link></li>
            <li><a href="#courses">Our Courses</a></li>
            <li><a href="#results">Results</a></li>
            <li>
              <a href="https://youtube.com/@YourDemoChannel" target="_blank" rel="noreferrer">
                Demo
              </a>
            </li>
            <li><a href="#testimonials">Testimonials</a></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Policies</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions">Terms and Conditions</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Get Latest NEET & JEE Updates</h3>
          <p className="text-sm mb-2">
            By clicking “Subscribe”, you agree to our{' '}
            <Link to="/privacy-policy" className="underline">Privacy Policy</Link>.
          </p>
          <form className="flex space-x-2 mt-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 rounded text-black"
            />
            <button className="bg-white text-indigo-700 font-semibold px-4 rounded">Send</button>
          </form>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-indigo-100 border-t border-indigo-400 pt-4">
        &copy; {new Date().getFullYear()} Copyright Vagus NEET Academy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
