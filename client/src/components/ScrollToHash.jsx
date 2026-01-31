// src/components/ScrollToHash.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHash = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const scrollToTarget = () => {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Retry after short delay if element not yet mounted
        setTimeout(scrollToTarget, 200);
      }
    };

    scrollToTarget();
  }, [hash, pathname]);

  return null;
};

export default ScrollToHash;
