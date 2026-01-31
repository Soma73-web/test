import React, { useEffect, useState } from 'react';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show only when user reaches the end of the page
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.offsetHeight;
      setVisible(scrollPosition >= pageHeight - 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 focus:outline-none"
      aria-label="Back to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

export default BackToTop; 