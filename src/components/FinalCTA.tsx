import React from 'react';
import { Link } from 'react-router-dom';
import { FireButton } from './FireButton';

export const FinalCTA: React.FC = () => {
  return (
    <section className="final-cta" id="contact">
      <div className="site-container reveal visible">
        <h2 id="final-cta-heading">
          Ready to <span className="cursor-highlight inline-block text-accent text-glow">level up?</span>
        </h2>
        <p className="text-[#9AA8AD] text-sm mt-4 mb-8 max-w-md mx-auto">
          Booking new long-form projects now. Tell me what you&apos;re uploading next.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <FireButton id="final-cta-btn" to="/contact" label="Start a project" />
          <Link
            to="/case-studies"
            className="text-sm font-semibold text-[#9AA8AD] hover:text-secondary no-underline transition-colors underline-offset-4 hover:underline"
          >
            Or read a case study first
          </Link>
        </div>
      </div>
    </section>
  );
};
