import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer id="site-footer">
      <div className="site-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mb-6">
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <img
              alt="RiddleEdits"
              className="w-8 h-8 rounded-full object-cover"
              src={`${import.meta.env.BASE_URL}riddle-avatar.png`}
              referrerPolicy="no-referrer"
            />
            <span className="font-bold text-secondary tracking-tight">
              Riddle<span className="text-accent">Edits</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-[0.8rem] uppercase tracking-[0.14em] font-medium text-[#9AA8AD]">
            <Link to="/work" className="hover:text-secondary transition-colors no-underline">Work</Link>
            <Link to="/case-studies" className="hover:text-secondary transition-colors no-underline">Case Studies</Link>
            <Link to="/contact" className="hover:text-secondary transition-colors no-underline">Contact</Link>
            <a href="https://x.com/RiddlePlayZz" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">X / Twitter</a>
          </nav>
        </div>
        <div className="h-px w-full bg-white/[0.07] mb-5" />
        <p id="footer-copyright" className="text-xs">
          © 2026 RiddleEdits — Video editing, built around retention.
        </p>
      </div>
    </footer>
  );
};
