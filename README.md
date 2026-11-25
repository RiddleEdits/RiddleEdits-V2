# RiddleEdits

Portfolio site for RiddleEdits, a video editor for GTA and Roblox YouTube creators.
React 19, Vite and Tailwind CSS 4. There's no backend.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run lint     # type check
```

## Editing content

Everything the site says lives in **`src/data/content.ts`**:

- `SITE`: email, Calendly link, socials
- `CREATORS`: channels, subscriber counts, avatars (files in `public/creators/`)
- `VIDEOS`: every video on the site with its views, length and likes. The homepage stats are calculated from these numbers.
- `NICHES`: copy and FAQs for the GTA and Roblox pages
- `TESTIMONIALS`, `CASE_STUDIES`

The month-by-month numbers in the Doodle Arkey Plays case study are in `src/components/GtaCaseStudy.tsx`.

## Pages

| Path | Component |
| --- | --- |
| `/` | `App.tsx` → `Home` |
| `/work/gta`, `/work/roblox` | `NichePage` |
| `/case-studies` (with `#doodle-arkey-plays`, `#miloblox`, `#kwil`) | `CaseStudiesPage` |
| `/contact` | `ContactPage` |

Routing is client-side, so the host must serve `index.html` for every path. Vercel and Netlify do this for Vite apps. On other hosts, add a rewrite to `/index.html`.

The contact form opens the visitor's email app with the message filled in. Bookings go through Calendly.
