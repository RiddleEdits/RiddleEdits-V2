import { CASE_STUDIES, PROJECTS } from './content';

/** Every URL the site serves. The build writes an index.html for each one. */
export function staticRoutes(): string[] {
  return [
    '/',
    '/work/',
    ...PROJECTS.map((p) => `/work/${p.slug}/`),
    '/case-studies/',
    ...CASE_STUDIES.map((c) => `/case-studies/${c.slug}/`),
    '/contact/',
  ];
}
