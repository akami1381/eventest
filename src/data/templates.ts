import eventChill from "@/assets/event-chill-code-workshop.jpg";
import eventHackathon from "@/assets/event-hackathon-ai.jpg";
import eventJam from "@/assets/event-late-night-jam.jpg";
import eventStartup from "@/assets/event-startup-weekend.jpg";
import eventSummit from "@/assets/event-vibe-coding-summit.jpg";

export const TEMPLATE_CATEGORIES = [
  "All",
  "Birthday",
  "Wedding",
  "Business",
  "Celebration",
  "Holiday",
  "Baptize",
  "Wedding + Baptize",
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

export type Template = {
  id: string;
  name: string;
  category: Exclude<TemplateCategory, "All">;
  layout: "minimal" | "split" | "landing";
  image: string;
  accent: string;
  tagline: string;
};

// Unsplash CDN imagery (free use). Used as cover art for template cards.
const u = (id: string, w = 800, h = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const TEMPLATES: Template[] = [
  // Wedding
  {
    id: "wedding-garden",
    name: "Garden Romance",
    category: "Wedding",
    layout: "split",
    image: u("photo-1519741497674-611481863552"),
    accent: "hsl(340 60% 65%)",
    tagline: "Florale, elegant, in tonuri pastelate.",
  },
  {
    id: "wedding-classic",
    name: "Classic Ivory",
    category: "Wedding",
    layout: "minimal",
    image: u("photo-1606800052052-a08af7148866"),
    accent: "hsl(35 35% 70%)",
    tagline: "Minimalist, tipografic, atemporal.",
  },
  {
    id: "wedding-modern",
    name: "Modern Noir",
    category: "Wedding",
    layout: "landing",
    image: u("photo-1511795409834-ef04bbd61622"),
    accent: "hsl(220 15% 25%)",
    tagline: "Dark mode, fotografie editoriala.",
  },

  // Birthday
  {
    id: "birthday-confetti",
    name: "Confetti Pop",
    category: "Birthday",
    layout: "landing",
    image: u("photo-1530103862676-de8c9debad1d"),
    accent: "hsl(340 80% 60%)",
    tagline: "Vesel, colorat, perfect pentru orice varsta.",
  },
  {
    id: "birthday-kids",
    name: "Little Star",
    category: "Birthday",
    layout: "split",
    image: u("photo-1464349095431-e9a21285b5f3"),
    accent: "hsl(45 90% 60%)",
    tagline: "Tematica pentru copii, ilustratii prietenoase.",
  },
  {
    id: "birthday-milestone",
    name: "Milestone 40",
    category: "Birthday",
    layout: "minimal",
    image: u("photo-1492684223066-81342ee5ff30"),
    accent: "hsl(280 50% 50%)",
    tagline: "Sobru, pentru aniversari rotunde.",
  },

  // Business
  {
    id: "business-summit",
    name: "Summit Pro",
    category: "Business",
    layout: "landing",
    image: eventSummit,
    accent: "hsl(220 80% 50%)",
    tagline: "Conferinte, summit-uri, evenimente corporate.",
  },
  {
    id: "business-workshop",
    name: "Workshop Clean",
    category: "Business",
    layout: "split",
    image: eventChill,
    accent: "hsl(170 60% 45%)",
    tagline: "Ateliere, training-uri, sesiuni educationale.",
  },
  {
    id: "business-launch",
    name: "Product Launch",
    category: "Business",
    layout: "minimal",
    image: eventHackathon,
    accent: "hsl(15 80% 55%)",
    tagline: "Lansari de produs, demo days.",
  },

  // Celebration
  {
    id: "celebration-anniversary",
    name: "Anniversary Glow",
    category: "Celebration",
    layout: "split",
    image: u("photo-1464366400600-7168b8af9bc3"),
    accent: "hsl(45 80% 55%)",
    tagline: "Aniversari de cuplu, jubilee.",
  },
  {
    id: "celebration-graduation",
    name: "Graduation Day",
    category: "Celebration",
    layout: "landing",
    image: u("photo-1523580494863-6f3031224c94"),
    accent: "hsl(220 60% 40%)",
    tagline: "Absolviri, ceremonii academice.",
  },

  // Holiday
  {
    id: "holiday-winter",
    name: "Winter Wonderland",
    category: "Holiday",
    layout: "landing",
    image: u("photo-1512389142860-9c449e58a543"),
    accent: "hsl(200 60% 50%)",
    tagline: "Sarbatori de iarna, Craciun, Revelion.",
  },
  {
    id: "holiday-easter",
    name: "Spring Pastels",
    category: "Holiday",
    layout: "minimal",
    image: u("photo-1490818387583-1baba5e638af"),
    accent: "hsl(85 50% 65%)",
    tagline: "Pasti, sarbatori de primavara.",
  },

  // Baptize
  {
    id: "baptize-cloud",
    name: "Little Cloud",
    category: "Baptize",
    layout: "split",
    image: u("photo-1519689680058-324335c77eba"),
    accent: "hsl(200 50% 75%)",
    tagline: "Botez, delicat, in tonuri de bleu.",
  },
  {
    id: "baptize-pink",
    name: "Pink Blossom",
    category: "Baptize",
    layout: "minimal",
    image: u("photo-1518621736915-f3b1c41bfd00"),
    accent: "hsl(340 60% 80%)",
    tagline: "Botez fetite, roz, gingas.",
  },

  // Wedding + Baptize
  {
    id: "wedding-baptize-duo",
    name: "Duo Celebration",
    category: "Wedding + Baptize",
    layout: "landing",
    image: u("photo-1525772764200-be829a350797"),
    accent: "hsl(340 50% 60%)",
    tagline: "Nunta + botez impreuna, un singur eveniment.",
  },
  {
    id: "wedding-baptize-classic",
    name: "Family Day",
    category: "Wedding + Baptize",
    layout: "split",
    image: u("photo-1519225421980-715cb0215aed"),
    accent: "hsl(35 40% 55%)",
    tagline: "Eleganta clasica pentru dubla sarbatoare.",
  },
];

export const POPULAR_TEMPLATES = [
  "wedding-garden",
  "birthday-confetti",
  "business-summit",
  "baptize-cloud",
]
  .map((id) => TEMPLATES.find((t) => t.id === id)!)
  .filter(Boolean);
