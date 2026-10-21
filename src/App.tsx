import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { RouterProvider, useRouter } from './router';
import { Navbar, Footer } from './components/Chrome';
import { HomePage } from './pages/HomePage';
import { WorkPage, ProjectPage } from './pages/WorkPages';
import { CaseStudiesPage, CaseStudyPage } from './pages/CaseStudyPages';
import { ContactPage } from './pages/ContactPage';
import { NotFound } from './pages/NotFound';
import { caseStudyBySlug, projectBySlug } from './data/content';

function resolve(path: string): { page: ReactNode; title: string } {
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return { page: <HomePage />, title: 'Kyro Media · Editor behind tech and Minecraft channels' };
  if (parts[0] === 'work') {
    if (parts.length === 1) return { page: <WorkPage />, title: 'Selected Work · Kyro Media' };
    const p = projectBySlug(parts[1]);
    if (p) return { page: <ProjectPage slug={p.slug} />, title: `${p.title} · Kyro Media` };
  }
  if (parts[0] === 'case-studies') {
    if (parts.length === 1) return { page: <CaseStudiesPage />, title: 'Case Studies · Kyro Media' };
    const c = caseStudyBySlug(parts[1]);
    if (c) return { page: <CaseStudyPage slug={c.slug} />, title: `${c.creator} case study · Kyro Media` };
  }
  if (parts[0] === 'contact' && parts.length === 1) return { page: <ContactPage />, title: 'Contact · Kyro Media' };
  return { page: <NotFound />, title: 'Not found · Kyro Media' };
}

function Page() {
  const { path } = useRouter();
  const { page, title } = resolve(path);
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <div key={path} className="page-in">
      {page}
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Page />
      </main>
      <Footer />
    </RouterProvider>
  );
}
