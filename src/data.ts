export interface Creator {
  name: string;
  subs: string;
  avatar: string;
  color: string;
  url: string;
}

export interface WorkItem {
  id: string;
  title: string;
  creator: string;
  youtubeId: string;
  category: 'Gaming' | 'Retention Edit' | 'Cinematic' | 'Short Form';
  views: string;
  length: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  creator: string;
  avatar: string;
  tagline: string;
  discipline: string;
  duration: string;
  youtubeId: string;
  accent: string;
  challenge: string;
  approach: string[];
  results: { label: string; value: string }[];
  quote: string;
  quoteAuthor: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  subs: string;
  avatar: string;
}

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const RIDDLE_PROFILE = asset("riddle-avatar.png");

export const CREATORS: Creator[] = [
  {
    name: "RageElixir",
    subs: "7.64M subs",
    avatar: asset("creator-rageelixir.jpg"),
    color: "#ef4444",
    url: "https://youtube.com/@rageelixir?si=e392isn3YPJcMZ9w",
  },
  {
    name: "Mia",
    subs: "758K subs",
    avatar: asset("creator-mia.jpg"),
    color: "#ec4899",
    url: "https://youtube.com/@mia-yt?si=pbXvp1BZEREY9arw",
  },
  {
    name: "Kwil",
    subs: "443K subs",
    avatar: asset("creator-kwil.jpg"),
    color: "#3b82f6",
    url: "https://youtube.com/@kw_il?si=LgE7oaSZhJod0kF6",
  },
  {
    name: "MiloBlox",
    subs: "435K subs",
    avatar: asset("creator-miloblox.jpg"),
    color: "#f59e0b",
    url: "https://youtube.com/@miloblox-yt?si=XAB_FGdIylu_wEBP",
  },
  {
    name: "SharkTactics",
    subs: "324K subs",
    avatar: asset("creator-sharktactics.jpg"),
    color: "#06b6d4",
    url: "https://youtube.com/@sharktactics?si=vQasIBO-aIW1BfmJ",
  },
  {
    name: "BeckBlox",
    subs: "182K subs",
    avatar: asset("creator-thebeckblox.jpg"),
    color: "#8b5cf6",
    url: "https://youtube.com/@thebeckblox?si=Vg5e12d28iFFycA1",
  },
  {
    name: "Daltyn",
    subs: "128K subs",
    avatar: asset("creator-daltynblox.jpg"),
    color: "#f59e0b",
    url: "https://youtube.com/@daltynblox?si=vQHt29CeIY6s6rzi",
  },
  {
    name: "Doodle Arkey Plays",
    subs: "104K subs",
    avatar: asset("creator-doodlearkeyplays.jpg"),
    color: "#10b981",
    url: "https://youtube.com/@doodlearkeyplays?si=cvjz6W1k9AKqNtvy",
  },
];

export const WORKS: WorkItem[] = [
  {
    id: 'work-1',
    title: 'GTA 5, But We Have INFINITE STARS..',
    creator: 'Doodle Arkey Plays',
    youtubeId: 'rJdJbEmO-ko',
    category: 'Gaming',
    views: '412K views',
    length: '14:22',
  },
  {
    id: 'work-2',
    title: 'Surviving 100 Days in a Zombie Apocalypse..',
    creator: 'Doodle Arkey Plays',
    youtubeId: 'Azr4fHfz0vY',
    category: 'Cinematic',
    views: '287K views',
    length: '18:05',
  },
  {
    id: 'work-3',
    title: 'Meccha Chameleon But It’s On The GTA 5 Map..',
    creator: 'Doodle Arkey Plays',
    youtubeId: 'g2qjuV8N7cQ',
    category: 'Retention Edit',
    views: '198K views',
    length: '11:47',
  },
  {
    id: 'work-4',
    title: 'I Rigged a NOOB vs PRO Rivals Tournament..',
    creator: 'MiloBlox',
    youtubeId: 'poqx6LL7iiw',
    category: 'Retention Edit',
    views: '156K views',
    length: '12:31',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'infinite-stars',
    title: 'Turning a chaotic GTA stunt video into a tight, high-retention story',
    creator: 'Doodle Arkey Plays',
    avatar: asset('creator-doodlearkeyplays.jpg'),
    tagline: 'GTA 5, But We Have INFINITE STARS..',
    discipline: 'Long-form retention edit · Motion design · Sound design',
    duration: 'Delivered in 4 days',
    youtubeId: 'rJdJbEmO-ko',
    accent: '#2266ff',
    challenge:
      'The raw footage was 3+ hours of unstructured mayhem — funny moments buried under dead air. The channel needed an edit that kept viewers locked in past the 8-minute mark without resorting to meme-spam.',
    approach: [
      'Mapped every beat on paper first — cut the video into five escalating acts so the payoff always sat one step ahead of the viewer.',
      'Built custom kinetic typography and animated map overlays in After Effects to replace verbal exposition with visual momentum.',
      'Layered impact sound design — whooshes, risers, sub hits — on every transition so cuts are felt, not just seen.',
      'Used speed-ramps and punch-in zooms on reactions to compress dead time while keeping the pacing human.',
    ],
    results: [
      { label: 'Avg. view duration', value: '+38%' },
      { label: 'Retention @ 8 min', value: '61%' },
      { label: 'Views in week one', value: '412K' },
    ],
    quote:
      'The edit carried the whole video. People in the comments were talking about the transitions more than the challenge itself.',
    quoteAuthor: 'Doodle Arkey Plays',
  },
  {
    slug: '100-days-zombie',
    title: 'A cinematic survival series told like a short film, not a let’s-play',
    creator: 'Doodle Arkey Plays',
    avatar: asset('creator-doodlearkeyplays.jpg'),
    tagline: 'Surviving 100 Days in a Zombie Apocalypse..',
    discipline: 'Cinematic edit · Color grade · Narrative structure',
    duration: 'Delivered in 9 days',
    youtubeId: 'Azr4fHfz0vY',
    accent: '#8b5cf6',
    challenge:
      '“100 days” videos live or die on emotional arc. The brief: make an in-game survival run feel like a film — quiet tension, a real low point, and a payoff that earns its music swell.',
    approach: [
      'Restructured the timeline around three acts (setup, collapse, rebuild) instead of day order, moving key scenes to where they hit hardest.',
      'Applied a teal-and-orange filmic grade with per-act LUT shifts so each chapter has its own visual temperature.',
      'Scored the edit dynamically — stems ducked under dialogue, swelled on montage — mixed for loudness platform parity.',
      'Shot real B-roll framing inside the game engine: depth-of-field masks, letterbox moments, slow push-ins.',
    ],
    results: [
      { label: 'Avg. view duration', value: '+52%' },
      { label: 'Likes per view', value: '1 : 14' },
      { label: 'Series follow-through', value: '+2.4x' },
    ],
    quote:
      'It genuinely felt like watching a movie. The part where the base falls apart? I got chills the first time I saw the cut.',
    quoteAuthor: 'Doodle Arkey Plays',
  },
  {
    slug: 'rigged-tournament',
    title: 'Rigging a Noob vs Pro tournament for maximum comedic timing',
    creator: 'MiloBlox',
    avatar: asset('creator-miloblox.jpg'),
    tagline: 'I Rigged a NOOB vs PRO Rivals Tournament..',
    discipline: 'Comedy edit · Graphics package · Pacing',
    duration: 'Delivered in 3 days',
    youtubeId: 'poqx6LL7iiw',
    accent: '#f59e0b',
    challenge:
      'The concept only works if the audience believes the “rigging.” That meant building a full broadcast layer — scoreboards, sponsor-style lower thirds, instant replays — entirely in post.',
    approach: [
      'Designed a cohesive tournament graphics package (bracket cams, stat pop-ups, replay wipes) matched to the channel identity.',
      'Choreographed the reveal beats: every rig moment got a setup shot, a pause, and a hard cut to reaction.',
      'Rebuilt audio from scratch — crowd beds, UI pings, dramatic sting on the twist — because the raw mic track couldn’t carry it.',
      'Cut two alternate endings A/B tested on the community tab before delivery.',
    ],
    results: [
      { label: 'CTR on thumbnail A/B', value: '+21%' },
      { label: 'Comments per view', value: '3.1x channel avg' },
      { label: 'Watch time', value: '+44%' },
    ],
    quote:
      'Bro you did an insane job on this — everything looks so clean. The replay graphics made it feel like a real event.',
    quoteAuthor: 'MiloBlox',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Bro genuinely cooked with this edit 😭🔥",
    name: "RageElixir",
    subs: "7.64M subs",
    avatar: asset("creator-rageelixir.jpg"),
  },
  {
    quote: "Honestly one of the best editors I’ve worked with",
    name: "Mia",
    subs: "758K subs",
    avatar: asset("creator-mia.jpg"),
  },
  {
    quote: "Bro’s editing is actually crazy",
    name: "Kwil",
    subs: "443K subs",
    avatar: asset("creator-kwil.jpg"),
  },
  {
    quote: "Not even gonna lie this dude is underrated 😭",
    name: "MiloBlox",
    subs: "435K subs",
    avatar: asset("creator-miloblox.jpg"),
  },
  {
    quote: "yo this looks so good bro, you actually cooked with this one",
    name: "SharkTactics",
    subs: "324K subs",
    avatar: asset("creator-sharktactics.jpg"),
  },
  {
    quote: "bro you did an insane job on this 😭 everything looks so clean",
    name: "Doodle Arkey Plays",
    subs: "104K subs",
    avatar: asset("creator-doodlearkeyplays.jpg"),
  },
  {
    quote: "holy shit bro this is so much better than i expected. you cooked",
    name: "BeckBlox",
    subs: "182K subs",
    avatar: asset("creator-thebeckblox.jpg"),
  },
  {
    quote: "nah this edit is crazy 😭 the pacing and visuals are actually so good bro",
    name: "Daltyn",
    subs: "128K subs",
    avatar: asset("creator-daltynblox.jpg"),
  },
];
