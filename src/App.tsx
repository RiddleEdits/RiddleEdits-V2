import { useCallback, useEffect, useMemo, useState } from 'react';
import { ModalContext, usePath } from './router';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Niches } from './components/Niches';
import { Stats, Testimonials } from './components/Proof';
import { GtaCaseStudy } from './components/GtaCaseStudy';
import { Faqs } from './components/Faqs';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import { NichePage } from './components/NichePage';
import { CaseStudiesPage } from './components/CaseStudiesPage';
import { ContactPage } from './components/ContactPage';
import { BookCallModal, VideoModal } from './components/Modals';
import { SectionHeading } from './components/ui';

const TITLES: Record<string, string> = {
  '/': 'RiddleEdits · Video editor for GTA and Roblox creators',
  '/work/gta': 'GTA editing · RiddleEdits',
  '/work/roblox': 'Roblox editing · RiddleEdits',
  '/case-studies': 'Case studies · RiddleEdits',
  '/contact': 'Contact · RiddleEdits'
};

function Home() {
  return (
    <>
      <Hero />
      <Niches />
      <Stats />
      <GtaCaseStudy heading={<SectionHeading eyebrow="Case study" title="Three months with Doodle Arkey Plays." />} />
      <Testimonials />
      <Faqs />
    </>
  );
}

export default function App() {
  const path = usePath();
  const [video, setVideo] = useState<{ id: string; title: string } | null>(null);
  const [bookCall, setBookCall] = useState(false);

  const modals = useMemo(
    () => ({
      openVideo: (id: string, title: string) => setVideo({ id, title }),
      openBookCall: () => setBookCall(true)
    }),
    []
  );
  const closeVideo = useCallback(() => setVideo(null), []);
  const closeBookCall = useCallback(() => setBookCall(false), []);

  useEffect(() => {
    document.title = TITLES[path] ?? TITLES['/'];
  }, [path]);

  // Scroll to #section on first load (e.g. /case-studies#miloblox)
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView(), 150);
  }, []);

  let page;
  if (path === '/work/gta') page = <NichePage key="gta" niche="gta" />;
  else if (path === '/work/roblox') page = <NichePage key="roblox" niche="roblox" />;
  else if (path === '/case-studies') page = <CaseStudiesPage />;
  else if (path === '/contact') page = <ContactPage />;
  else page = <Home />;

  return (
    <ModalContext.Provider value={modals}>
      <Navbar path={path} />
      <main>
        {page}
        {path !== '/contact' && <CallToAction />}
      </main>
      <Footer />
      {video && <VideoModal video={video} onClose={closeVideo} />}
      {bookCall && <BookCallModal onClose={closeBookCall} />}
    </ModalContext.Provider>
  );
}
