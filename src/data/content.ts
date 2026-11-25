/*
 * Everything the site says lives in this file.
 * Video numbers were taken from each video's YouTube page on 25 Nov 2026.
 * Update them here and every page picks up the change.
 */

export const SITE = {
  name: 'RiddleEdits',
  email: 'rgsfirdaus@gmail.com',
  calendly: 'https://calendly.com/rgsfirdaus/30min',
  x: 'https://x.com/RiddlePlayZz',
  instagram: 'https://www.instagram.com/riddle.editzzz/',
  showreelId: '5EAMyKkARdA'
};

export type Niche = 'gta' | 'roblox';

export interface Creator {
  id: string;
  name: string;
  subs: string;
  avatar: string;
  url: string;
}

export const CREATORS: Creator[] = [
  { id: 'rageelixir', name: 'RageElixir', subs: '7.64M', avatar: '/creators/rageelixir.jpg', url: 'https://youtube.com/@rageelixir' },
  { id: 'mia', name: 'Mia', subs: '758K', avatar: '/creators/mia.jpg', url: 'https://youtube.com/@mia-yt' },
  { id: 'kwil', name: 'Kwil', subs: '443K', avatar: '/creators/kwil.jpg', url: 'https://youtube.com/@kw_il' },
  { id: 'miloblox', name: 'MiloBlox', subs: '435K', avatar: '/creators/miloblox.jpg', url: 'https://youtube.com/@miloblox-yt' },
  { id: 'sharktactics', name: 'SharkTactics', subs: '324K', avatar: '/creators/sharktactics.jpg', url: 'https://youtube.com/@sharktactics' },
  { id: 'beckblox', name: 'BeckBlox', subs: '182K', avatar: '/creators/thebeckblox.jpg', url: 'https://youtube.com/@thebeckblox' },
  { id: 'daltyn', name: 'Daltyn', subs: '128K', avatar: '/creators/daltynblox.jpg', url: 'https://youtube.com/@daltynblox' },
  { id: 'doodle', name: 'Doodle Arkey Plays', subs: '104K', avatar: '/creators/doodlearkeyplays.jpg', url: 'https://youtube.com/@doodlearkeyplays' }
];

export const creator = (id: string) => CREATORS.find((c) => c.id === id)!;

export interface Video {
  id: string; // YouTube id
  title: string;
  creatorId: string;
  niche: Niche;
  views: number;
  length: string;
  likes: number;
  published: string;
}

export const VIDEOS: Video[] = [
  { id: 'rJdJbEmO-ko', title: 'GTA 5, But We Have INFINITE STARS..', creatorId: 'doodle', niche: 'gta', views: 468767, length: '14:52', likes: 5508, published: 'Apr 2026' },
  { id: 'Azr4fHfz0vY', title: 'Surviving 100 Days in a Zombie Apocalypse..', creatorId: 'doodle', niche: 'gta', views: 433381, length: '18:43', likes: 4564, published: 'Apr 2026' },
  { id: 'ul-omdsGBMI', title: 'I Became a FAKE COP To Arrest My Friend in GTA RP..', creatorId: 'doodle', niche: 'gta', views: 219552, length: '19:52', likes: 2929, published: 'Apr 2026' },
  { id: 'g2qjuV8N7cQ', title: 'Meccha Chameleon But It’s On The GTA 5 Map..', creatorId: 'doodle', niche: 'gta', views: 80963, length: '10:12', likes: 1104, published: 'Jul 2026' },
  { id: 'WBtalXv3Qgc', title: 'Logging into the OLDEST Rivals Account..', creatorId: 'miloblox', niche: 'roblox', views: 865850, length: '21:07', likes: 6279, published: 'Oct 2026' },
  { id: 'zHvWvIpMsZA', title: 'Steal A Brainrot, But The BRAINROT TRADER is OVERPOWERED..', creatorId: 'kwil', niche: 'roblox', views: 810728, length: '20:04', likes: 11144, published: 'Nov 2025' },
  { id: 'hbrOQRLRL_E', title: 'I Busted 21 Myths in Rivals SUMMER UPDATE!', creatorId: 'miloblox', niche: 'roblox', views: 513403, length: '9:50', likes: 5624, published: 'Jun 2026' },
  { id: 'poqx6LL7iiw', title: 'I Rigged a NOOB vs PRO Rivals Tournament..', creatorId: 'miloblox', niche: 'roblox', views: 51375, length: '22:05', likes: 1095, published: 'Sep 2026' }
];

export const videosFor = (niche: Niche) => VIDEOS.filter((v) => v.niche === niche);

/** 468767 → "469K", 1203000 → "1.2M" */
export function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

/** Like compact() but for likes, keeps one decimal under 10K: 5508 → "5.5K" */
export function compactLikes(n: number): string {
  if (n >= 10_000) return compact(n);
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

export const thumb = (id: string, size: 'hq' | 'max' = 'hq') =>
  `https://i.ytimg.com/vi/${id}/${size === 'max' ? 'maxresdefault' : 'hqdefault'}.jpg`;

const totalViews = VIDEOS.reduce((sum, v) => sum + v.views, 0);
const topVideo = [...VIDEOS].sort((a, b) => b.views - a.views)[0];

export const STATS = [
  { value: '10M+', label: 'Combined subscribers of the creators I’ve edited for' },
  { value: `${compact(totalViews)}+`, label: `Views on the ${VIDEOS.length} videos on this site` },
  { value: compact(topVideo.views), label: `Views on my top edit, for ${creator(topVideo.creatorId).name}` }
];

export const NICHES: Record<
  Niche,
  { name: string; path: string; headline: string; intro: string; formats: string[]; faqs: { q: string; a: string }[] }
> = {
  gta: {
    name: 'GTA',
    path: '/work/gta',
    headline: 'GTA videos people watch to the end.',
    intro: 'Challenges, 100 Days survival and roleplay stories. I find the story in hours of chaotic footage and cut it so every minute earns the next.',
    formats: ['Challenges', '100 Days', 'Roleplay'],
    faqs: [
      { q: 'What kind of GTA videos do you edit?', a: 'Long-form challenges, 100 Days survival runs and roleplay-style story videos, like the ones on this page for Doodle Arkey Plays.' },
      { q: 'How long does a video take?', a: 'Usually 48 to 72 hours for the first cut of a 15–20 minute video. Tell me your upload day and I’ll plan around it.' },
      { q: 'Can you match my existing style?', a: 'Yes. Send me two or three of your videos that you like and I’ll match the pacing, captions and sound.' },
      { q: 'How does pricing work?', a: 'It depends on video length and how much raw footage there is. We’ll go through it on a call and I’ll quote you per video.' }
    ]
  },
  roblox: {
    name: 'Roblox',
    path: '/work/roblox',
    headline: 'Roblox videos with no dead air.',
    intro: 'Rivals, Steal a Brainrot and tournament videos. Fast pacing, clear reveals and sound design that matches the energy of the game.',
    formats: ['Rivals', 'Challenges', 'Tournaments'],
    faqs: [
      { q: 'Which Roblox games have you edited?', a: 'Mostly Rivals and Steal a Brainrot so far, for MiloBlox and Kwil. Other games are fine — the pacing rules are the same.' },
      { q: 'How long does a video take?', a: 'Usually 48 to 72 hours for the first cut. If an update just dropped and you need it faster, tell me and we’ll sort it out.' },
      { q: 'Can you match my existing style?', a: 'Yes. Send me two or three of your videos that you like and I’ll match the pacing, captions and sound.' },
      { q: 'How does pricing work?', a: 'It depends on video length and how much raw footage there is. We’ll go through it on a call and I’ll quote you per video.' }
    ]
  }
};

export interface Testimonial {
  creatorId: string;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  { creatorId: 'rageelixir', quote: 'Bro genuinely cooked with this edit.' },
  { creatorId: 'mia', quote: 'Honestly one of the best editors I’ve worked with.' },
  { creatorId: 'kwil', quote: 'Bro’s editing is actually crazy.' },
  { creatorId: 'miloblox', quote: 'Not even gonna lie, this dude is underrated.' },
  { creatorId: 'sharktactics', quote: 'Yo this looks so good bro, you actually cooked with this one.' },
  { creatorId: 'daltyn', quote: 'Nah this edit is crazy. The pacing and visuals are actually so good.' },
  { creatorId: 'doodle', quote: 'You did an insane job on this. Everything looks so clean.' },
  { creatorId: 'beckblox', quote: 'This is so much better than I expected. You cooked.' }
];

export const quoteFor = (creatorId: string) => TESTIMONIALS.find((t) => t.creatorId === creatorId);

export interface CaseStudy {
  slug: string;
  creatorId: string;
  niche: Niche;
  headline: string;
  summary: string;
  videoIds: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'doodle-arkey-plays',
    creatorId: 'doodle',
    niche: 'gta',
    headline: 'Turning hours of GTA chaos into stories people finish',
    summary:
      'Raw GTA sessions with friends run for hours. I find the story inside the footage, build clear escalating stakes, add sound design and meme cuts, and keep only the chases, the fails and the payoff.',
    videoIds: ['rJdJbEmO-ko', 'Azr4fHfz0vY', 'ul-omdsGBMI', 'g2qjuV8N7cQ']
  },
  {
    slug: 'miloblox',
    creatorId: 'miloblox',
    niche: 'roblox',
    headline: 'Rivals videos that keep viewers in the match',
    summary:
      'Myth tests, rare accounts and rigged tournaments. Long rounds cut tight, every reveal landing on time, and on-screen graphics that keep viewers oriented.',
    videoIds: ['WBtalXv3Qgc', 'hbrOQRLRL_E', 'poqx6LL7iiw']
  },
  {
    slug: 'kwil',
    creatorId: 'kwil',
    niche: 'roblox',
    headline: 'An 800K-view Steal a Brainrot video',
    summary: 'A 20-minute trading challenge with an overpowered twist, paced so the trades keep escalating right up to the ending.',
    videoIds: ['zHvWvIpMsZA']
  }
];

export function caseStats(cs: CaseStudy) {
  const vids = cs.videoIds.map((id) => VIDEOS.find((v) => v.id === id)!);
  const views = vids.reduce((s, v) => s + v.views, 0);
  const likes = vids.reduce((s, v) => s + v.likes, 0);
  return { vids, views, likes };
}
