# Kyro Media — portfolio (V3)

A multi-page video editing portfolio: Vite, React, TypeScript, Tailwind CSS v4 and three.js.

## Pages
| URL | What it is |
| --- | --- |
| `/` | Home: film-ribbon hero, selected work, results, process, contact call to action |
| `/work/` | All projects with category filters, plus shorts |
| `/work/<slug>/` | One page per project with the video embedded |
| `/case-studies/` | Case study index |
| `/case-studies/<slug>/` | Overview, challenge, approach, frames, outcome, next |
| `/contact/` | Contact details and a brief form |

Every URL above is written as its own `index.html` at build time, so direct links and refreshes work on GitHub Pages.

## Edit content
Everything is in `src/data/content.ts`:
- **Add a project:** add an entry to `PROJECTS` (YouTube ID, title, creator, category, format). Set `featured` to show it on the home page.
- **Add a case study:** add an entry to `CASE_STUDIES`. Its page and URL are created automatically.
- **Contact details:** `SITE` (email, Calendly, socials). The form posts to FormSubmit; the first submission sends a one-time confirmation email to that address.

Only use figures you can verify. Leave a field out and the page simply doesn't show it.

## Develop
```
npm ci
npm run dev        # http://localhost:3000
npm run build      # production build in dist/
npm run build:preview  # one self-contained HTML file in preview-dist/
```

## Deploy
Pushing to `main` runs `.github/workflows/deploy.yml`. In the repository settings, set **Pages → Source** to **GitHub Actions**.
The site is built for `https://<user>.github.io/RiddleEdits-V2/`. If you point a custom domain at this repo, change `BASE_PATH` in the workflow to `/`.
