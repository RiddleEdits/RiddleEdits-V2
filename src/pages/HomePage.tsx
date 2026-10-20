import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { Clients } from '../components/Clients';
import { WorkSection } from '../components/WorkGrid';
import { Testimonials } from '../components/Testimonials';
import { FinalCTA } from '../components/FinalCTA';

export default function HomePage() {
  const location = useLocation();

  // Handle cross-page scroll-to-section requests (e.g. "Reviews" in mobile nav)
  useEffect(() => {
    const target = sessionStorage.getItem('riddle-scroll-to');
    if (target) {
      sessionStorage.removeItem('riddle-scroll-to');
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      });
    }
  }, [location.pathname]);

  return (
    <>
      <Hero />
      <Clients />
      <WorkSection />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
