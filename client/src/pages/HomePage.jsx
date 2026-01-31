import React, { useEffect, useRef } from 'react';
import HomeSlider from '../components/HomeSlider';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import Features from '../components/Features';
import Events from '../components/Events';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Results from '../components/Results';
// import DownloadSection from '../components/DownloadSection';
import Footer from '../components/Footer';

const HomePage = () => {
  const resultsRef = useRef(null);
  const galleryRef = useRef(null);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    const section = localStorage.getItem('scrollTo');
    if (section) {
      const scrollTargets = {
        results: resultsRef.current,
        gallery: galleryRef.current,
        testimonials: testimonialsRef.current,
      };
      if (scrollTargets[section]) {
        setTimeout(() => {
          scrollTargets[section].scrollIntoView({ behavior: 'smooth' });
          localStorage.removeItem('scrollTo');
        }, 100); // Delay to ensure layout is ready
      }
    }
  }, []);

  return (
    <>
      <main className="pt-[96px]">
        <div className="mb-10">
          <HomeSlider />
        </div>

        <div className="mb-16">
          <Hero />
        </div>

        <div className="mb-16">
          <Courses />
        </div>

        <div className="mb-12">
          <Features />
        </div>

        <div className="mb-12">
          <Events />
        </div>

        <div ref={resultsRef} className="mb-12">
          <Results />
        </div>

        <div ref={galleryRef} className="mb-12">
          <Gallery />
        </div>

        <div ref={testimonialsRef} className="mb-12">
          <Testimonials />
        </div>

        {/* <div className="mb-16">
          <DownloadSection />
        </div> */}
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
