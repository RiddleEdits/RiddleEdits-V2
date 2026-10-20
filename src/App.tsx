import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { BackToTop } from './components/BackToTop';
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import CaseStudyDetailPage from './pages/CaseStudyDetailPage';
import ContactPage from './pages/ContactPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <ScrollToTop />
        <CustomCursor />
        <Navbar />
        <main>
          <AnimatedRoutes />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </HashRouter>
  );
}
