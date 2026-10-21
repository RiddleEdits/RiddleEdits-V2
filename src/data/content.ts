/**
 * All site content lives here. Pages read from these lists, so adding a project or a case study
 * is a matter of adding an entry — no layout changes needed.
 *
 * Every number below came with the original Kyro Media content. Keep them true: if you
 * can't verify a figure, delete it and the page simply leaves that field out.
 */

export const SITE = {
  name: 'Kyro Media',
  tagline: 'Video editing for tech and Minecraft creators.',
  email: 'rgsfirdaus@gmail.com',
  /** Every "Book a call" button opens this. */
  calendly: 'https://calendly.com/rgsfirdaus/30min',
  socials: [
    { label: 'X', handle: '@RiddlePlayZz', url: 'https://x.com/RiddlePlayZz' },
  ],
  discord: 'riddle_.exe',
  /**
   * Contact form messages are delivered to `email` through FormSubmit (formsubmit.co).
   * The first message triggers a one-time confirmation email; click it and every message after
   * that lands in your inbox.
   */
  formEndpoint: 'https://formsubmit.co/ajax/rgsfirdaus@gmail.com',
};

export type Category = 'Tech' | 'Minecraft';
export type Format = 'Long form' | 'Shorts' | 'Recut';

export interface Project {
  /** Used in the URL: /work/<slug>/ */
  slug: string;
  youtubeId: string;
  title: string;
  creator: string;
  category: Category;
  format: Format;
  /** One or two sentences about what the edit does. Optional. */
  summary?: string;
  views?: string;
  length?: string;
  likes?: string;
  comments?: string;
  /** Shown on the home page, in this order. */
  featured?: number;
}

export const PROJECTS: Project[] = [
  // ---------------------------------------------------------------- Tech · long form
  {
    slug: 'best-gaming-pc-every-budget',
    youtubeId: 'U_awTGaTQV0',
    title: 'I Built The BEST Gaming PC For Every Budget!',
    creator: 'Vermax',
    category: 'Tech',
    format: 'Long form',
    summary: 'A build guide across every budget, with motion graphics only where they explain something.',
    views: '263K',
    length: '37:14',
    likes: '4.3K',
    comments: '541',
    featured: 1,
  },
  {
    slug: 'amd-vs-intel-gaming-pc',
    youtubeId: 'WUPC1O9-qcs',
    title: 'AMD vs Intel Gaming PC!',
    creator: 'Vermax',
    category: 'Tech',
    format: 'Long form',
    summary: 'A head-to-head comparison paced so the verdict lands at the end.',
    views: '184K',
    length: '39:56',
    featured: 4,
  },
  {
    slug: '1-star-vs-5-star-gaming-pc',
    youtubeId: 'jsFzUnWvmKI',
    title: '1 Star vs 5 Star Gaming PC',
    creator: 'Vermax',
    category: 'Tech',
    format: 'Long form',
    views: '248K',
    length: '44:19',
  },
  {
    slug: 'highest-rated-setup',
    youtubeId: 'yStaUinYysw',
    title: 'I Bought the HIGHEST RATED Setup on the Internet!',
    creator: 'Vermax',
    category: 'Tech',
    format: 'Long form',
    views: '142K',
    length: '38:56',
  },
  {
    slug: 'temu-vs-tiktok-shop-laptop',
    youtubeId: 'FNqrzw_uekE',
    title: 'Temu vs Tiktok Shop Gaming Laptop',
    creator: 'Vermax',
    category: 'Tech',
    format: 'Long form',
    views: '141K',
    length: '48:34',
  },
  {
    slug: 'worlds-fastest-gaming-setup',
    youtubeId: 'Q61iF_LNtRs',
    title: 'I Built the Worlds FASTEST Gaming Setup!',
    creator: 'Vermax',
    category: 'Tech',
    format: 'Long form',
    views: '135K',
    length: '29:02',
  },
  {
    slug: 'pro-streaming-setup-ps5',
    youtubeId: 'uZxUbZ621uY',
    title: 'Building a Pro Streaming Setup For PS5!',
    creator: 'Vermax',
    category: 'Tech',
    format: 'Long form',
    summary: 'Includes a sponsor read placed where the video already pauses, styled like the rest of the edit.',
    views: '120K',
    length: '55:49',
  },
  {
    slug: 'ps5-pro-vs-xbox-series-x',
    youtubeId: 'P7cB8g6PCbw',
    title: 'PS5 Pro vs Xbox Series X!',
    creator: 'Vermax',
    category: 'Tech',
    format: 'Long form',
    views: '116K',
    length: '24:10',
  },
  // ---------------------------------------------------------------- Tech · shorts
  {
    slug: 'ps5-vs-mini-gaming-pc',
    youtubeId: 'sKG_HOWQnzA',
    title: 'PS5 vs Mini Gaming PC!',
    creator: 'Vermax',
    category: 'Tech',
    format: 'Shorts',
    views: '1M',
    length: '0:33',
    likes: '29K',
    comments: '641',
  },
  {
    slug: 'budget-vs-fastest-mini-pc',
    youtubeId: 'TM6O6A-tcdo',
    title: 'Budget Mini PC vs FASTEST Mini PC!',
    creator: 'Vermax',
    category: 'Tech',
    format: 'Shorts',
    views: '470K',
    likes: '13K',
    comments: '160',
  },
  {
    slug: 'ps5-pro-vs-900-gaming-pc',
    youtubeId: 'jmBZfi1qFVg',
    title: 'PS5 Pro vs $900 Gaming PC!',
    creator: 'Vermax',
    category: 'Tech',
    format: 'Shorts',
    views: '429K',
    likes: '11K',
    comments: '329',
  },
  {
    slug: 'fastest-mini-pc',
    youtubeId: 'mXn24R8J9mI',
    title: 'I Bought the Fastest Mini PC!',
    creator: 'Vermax',
    category: 'Tech',
    format: 'Shorts',
    views: '394K',
    likes: '8.4K',
    comments: '417',
  },
  // ---------------------------------------------------------------- Minecraft
  {
    slug: 'crazy-craft-remake-100-days',
    youtubeId: 'w0di3CNI8-w',
    title: 'I Spent 100 Days in the NEW CRAZY CRAFT Remake',
    creator: 'DefinitelyDead',
    category: 'Minecraft',
    format: 'Long form',
    summary: 'A four-hour 100 Days episode built around story arcs, deaths, big builds and boss fights.',
    views: '322K',
    length: '3:58:49',
    featured: 2,
  },
  {
    slug: 'eren-yeager-100-days',
    youtubeId: 'AdGpjx3ZajA',
    title: 'I Survived 100 Days as Eren Yeager in Attack on Titan Minecraft',
    creator: 'ClouzzaMC',
    category: 'Minecraft',
    format: 'Long form',
    summary: 'An anime-themed 100 Days with a custom day counter and overlays to match the modpack.',
    views: '444K',
    length: '2:45:10',
    featured: 3,
  },
  {
    slug: 'solo-leveling-100-days',
    youtubeId: 'creXqy_Dsho',
    title: 'I Survived 100 Days as Sung Jinwoo in Solo Leveling Minecraft',
    creator: 'ClouzzaMC',
    category: 'Minecraft',
    format: 'Long form',
    views: '386K',
    featured: 5,
  },
  {
    slug: 'black-clover-100-days',
    youtubeId: 'TG_IhbkqjEY',
    title: 'I Survived 100 Days as Asta in Black Clover Minecraft',
    creator: 'ClouzzaMC',
    category: 'Minecraft',
    format: 'Long form',
    views: '357K',
  },
  {
    slug: 'meliodas-100-days',
    youtubeId: 'X-iKm6g_u4o',
    title: '100 Days as Meliodas',
    creator: 'ClouzzaMC',
    category: 'Minecraft',
    format: 'Long form',
    views: '310K',
    length: '2:12:05',
  },
  {
    slug: 'dinosaur-tamer-100-days',
    youtubeId: 'dEd79Uip05A',
    title: 'I Survived 100 Days as a DINOSAUR TAMER in Minecraft Bedrock',
    creator: 'AxohMC',
    category: 'Minecraft',
    format: 'Long form',
    views: '280K',
    length: '1:54:20',
  },
  {
    slug: 'antarchy-orespawn-100-days',
    youtubeId: 'pBophDum33o',
    title: 'I Spent 100 Days in ANTARCHY (Orespawn 2)',
    creator: 'DefinitelyDead',
    category: 'Minecraft',
    format: 'Long form',
    views: '179K',
    length: '3:20:15',
  },
  {
    slug: 'crazy-craft-remake-tv-cut',
    youtubeId: 'CnGCUBHslzE',
    title: 'I Spent 100 Days in the Crazy Craft Remake (TV cut)',
    creator: 'DefinitelyDead TV',
    category: 'Minecraft',
    format: 'Recut',
    summary: 'A tighter recut of the main episode for the second channel.',
    views: '86K',
  },
  {
    slug: 'pov-friend-plays-without-shaders',
    youtubeId: 'wqJztICh1ns',
    title: 'POV: Your Friend Plays without Shaders',
    creator: 'DefinitelyDead Shorts',
    category: 'Minecraft',
    format: 'Shorts',
    views: '27K',
  },
];

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);
export const projectById = (id: string) => PROJECTS.find((p) => p.youtubeId === id);
export const CATEGORIES: Category[] = ['Tech', 'Minecraft'];
export const featuredProjects = () =>
  PROJECTS.filter((p) => p.featured).sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));

export const thumb = (id: string, q: 'maxresdefault' | 'hqdefault' | 'mqdefault' | 'hq1' | 'hq2' | 'hq3' = 'maxresdefault') =>
  `https://img.youtube.com/vi/${id}/${q}.jpg`;

/* --------------------------------------------------------------- credibility */

export const RESULTS = [
  { value: '250M+', label: 'views on the videos edited by Kyro Media' },
  { value: '50+', label: 'creators worked with in tech and Minecraft' },
  { value: '8×', label: 'average views for Vermax after switching to Kyro' },
];

export const CREATORS = ['Vermax', 'DefinitelyDead', 'ClouzzaMC', 'PSD1', 'AxohMC', 'Xamy', 'Kamahley', 'GivemChills', 'tech.starrr'];

/* --------------------------------------------------------------- case studies */

export interface CaseStudy {
  /** Used in the URL: /case-studies/<slug>/ */
  slug: string;
  creator: string;
  niche: Category;
  headline: string;
  /** Short line for the index page. */
  teaser: string;
  overview: { label: string; value: string }[];
  challenge: string;
  approach: { title: string; points: string[] }[];
  /** First is embedded; the rest show as related clips. */
  videos: string[];
  /** Verified numbers only. Leave empty if you don't have them. */
  outcome: { label: string; value: string }[];
  outcomeNote?: string;
  quote?: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'vermax',
    creator: 'Vermax',
    niche: 'Tech',
    headline: 'One team instead of two editors, and 8× the average views.',
    teaser: 'Long form, shorts and sponsor segments for a tech channel, handled by one team.',
    overview: [
      { label: 'Creator', value: 'Vermax' },
      { label: 'Niche', value: 'Tech: builds, reviews, comparisons' },
      { label: 'Formats', value: 'Long form, Shorts, Sponsor segments, Ads' },
      { label: 'Role', value: 'Editing for every format' },
    ],
    challenge:
      'Vermax had one editor for long form and another for shorts, with every note going through him. Keeping two editors aligned was costing him hours every week.',
    approach: [
      {
        title: 'Long form',
        points: [
          'Builds, reviews and comparisons',
          'Motion graphics and animations only where they explain something',
          'One editor stays on the channel, so the style stays consistent',
        ],
      },
      {
        title: 'Shorts',
        points: ['Vertical 9:16, hook first', 'Cut to stand on their own', 'High-retention pacing and subtitles'],
      },
      {
        title: 'Sponsor segments',
        points: [
          'Placed where the video already naturally pauses',
          'Paced and styled like the rest of the video',
          'Full b-roll and motion tracking',
        ],
      },
    ],
    videos: ['WUPC1O9-qcs', 'U_awTGaTQV0', 'jsFzUnWvmKI'],
    outcome: [
      { label: 'Subscribers', value: '734K → 973K' },
      { label: 'Average views', value: '~25K → 200K+' },
      { label: 'Shorts delivered', value: '100+' },
    ],
    quote:
      'Kyro Media streamlined our entire workflow. Having one unified team handle long form, shorts, and brand deals freed up 20+ hours of my week while our views surged 8x.',
  },
  {
    slug: 'definitelydead',
    creator: 'DefinitelyDead',
    niche: 'Minecraft',
    headline: 'One recording a week, three channels, no extra hours.',
    teaser: 'A weekly 100 Days episode turned into a main video, a recut and shorts.',
    overview: [
      { label: 'Creator', value: 'DefinitelyDead' },
      { label: 'Niche', value: 'Minecraft 100 Days' },
      { label: 'Formats', value: '4 hour episode, TV recut, Shorts' },
      { label: 'Role', value: 'Story editing, recuts, shorts' },
    ],
    challenge:
      'He records one 100 Days episode a week. Each recording holds far more than one video, but cutting a second and third format would have cost him time he didn’t have.',
    approach: [
      {
        title: 'Story first',
        points: [
          'Raw footage indexed by story arcs, deaths, big builds and boss fights',
          'Shaped into a 100-day cinematic narrative',
        ],
      },
      {
        title: 'Series identity',
        points: ['Custom DAY counters and health bar trackers', 'Sound effects and overlays matched to the modpack'],
      },
      {
        title: 'One recording, three outputs',
        points: [
          'The flagship four-hour episode',
          'A tighter recut for DefinitelyDead TV',
          'Short clips for YouTube Shorts',
        ],
      },
    ],
    videos: ['w0di3CNI8-w', 'pBophDum33o', 'CnGCUBHslzE'],
    outcome: [
      { label: 'Subscribers', value: '~15K → 24K+' },
      { label: 'Views a month', value: '1M+' },
      { label: 'Channels', value: '1 → 3' },
    ],
    quote:
      'Kyro Media has amazing editors that truly care about making great videos for your audience. They are always on time, handle any revisions thoroughly, and are a great asset in ensuring your channel runs smoothly.',
  },
];

export const caseStudyBySlug = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug);

export const PROCESS = [
  {
    title: 'Understand the content',
    body: 'I watch your last uploads, your best performers and your raw footage, and learn how your channel sounds before I cut anything.',
  },
  {
    title: 'Edit the story',
    body: 'I find the spine of the video, cut everything that doesn’t serve it, and pace each section so it earns the next one.',
  },
  {
    title: 'Polish and deliver',
    body: 'Sound design, music, motion graphics and captions, then a clean export ready to upload, with revisions until it feels like yours.',
  },
];

export const VIDEO_TYPES = ['Long form', 'Shorts', 'Sponsor segment', '100 Days / series', 'Something else'];
