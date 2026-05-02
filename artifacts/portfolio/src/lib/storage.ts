export const KEYS = {
  PROFILE_PIC: "portfolio_profile_pic_path",
  HERO_BG: "portfolio_hero_bg_path",
  SKILLS: "portfolio_skills",
  HERO: "portfolio_hero",
  ABOUT: "portfolio_about",
  REEL_URL: "portfolio_reel_url",
  CONTACT: "portfolio_contact",
  COMMISSIONS: "portfolio_commissions",
  WORKS: "portfolio_works",
  EXPERIENCE: "portfolio_experience",
  ADMIN_PASSWORD: "portfolio_admin_password",
  ADMIN_AUTH: "portfolio_admin_authed",
} as const;

export const DEFAULT_PASSWORD = "thao2025";

export interface HeroData {
  name: string;
  subtitle: string;
  tagline: string;
}

export interface AboutData {
  bio1: string;
  bio2: string;
  gender: string;
  dob: string;
  location: string;
}

export interface ContactData {
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
}

export interface CommissionTier {
  id: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  open: boolean;
  accent: string;
}

export type WorkSectionType = "storyboard" | "research" | "visuals" | "thumbnails" | "layout";

export interface WorkSection {
  type: WorkSectionType;
  description: string;
  images: string[];
}

export const SECTION_ORDER: WorkSectionType[] = ["storyboard", "research", "visuals", "thumbnails", "layout"];

export function getWorkSections(work: WorkItem): WorkSection[] {
  return SECTION_ORDER.map(
    (type) =>
      (work.sections ?? []).find((s) => s.type === type) ??
      { type, description: "", images: [] }
  );
}

export interface WorkItem {
  id: string;
  title: string;
  type: string;
  gradient: string;
  accent: string;
  imageObjectPath?: string;
  description?: string;
  sections?: WorkSection[];
}

export interface ExperienceEntry {
  id: string;
  period: string;
  role: string;
  organization: string;
  detail: string;
  highlight: boolean;
}

export interface Skill {
  id: string;
  name: string;
  label: string;
  category: string;
}

export const DEFAULTS = {
  HERO: {
    name: "Emmarantia",
    subtitle: "Concept Artist & 2D Animator",
    tagline: "Portfolio · 2025",
  } as HeroData,

  ABOUT: {
    bio1: "My name is Emmarantia, a 2D Concept & Animation artist, passionate about creating whimsical fantasy worlds and stories.",
    bio2: "My strengths are Character and Background Concept Design, 2D Animation and Illustration. I aspire to create and develop new ideas and always ready to collaborate effectively with team, study, self-evaluate, and continuously improve my skills.",
    gender: "Female",
    dob: "03.03.2002",
    location: "Hanoi, Vietnam",
  } as AboutData,

  REEL_URL: "",

  CONTACT: {
    email: "tranphuongthao03032002@gmail.com",
    phone: "0968 030 257",
    facebook: "https://www.facebook.com/rchtran",
    instagram: "https://instagram.com/tealis_drawing",
  } as ContactData,

  COMMISSIONS: [
    {
      id: "1",
      title: "Character Illustration",
      description: "Full-body or bust character illustration with flat or full shading. Perfect for OCs, fan art, or portrait commissions.",
      features: ["Sketch + clean lineart", "Flat or full colour shading", "Simple background included", "1 revision round"],
      price: "From 300,000 VND",
      open: true,
      accent: "border-cyan-500/40 hover:border-cyan-400/60",
    },
    {
      id: "2",
      title: "Character Design Sheet",
      description: "Full character reference sheet with front/back/side views, colour palette, and expression samples. Ideal for worldbuilding or game dev.",
      features: ["3-view turnaround", "Expression sheet (4–6 poses)", "Colour palette guide", "2 revision rounds"],
      price: "From 700,000 VND",
      open: true,
      accent: "border-violet-500/40 hover:border-violet-400/60",
    },
    {
      id: "3",
      title: "Background / Environment",
      description: "Detailed 2D background or environment painting for comics, games, or visual novels. Atmospheric and hand-crafted.",
      features: ["Concept sketch phase", "Full digital painting", "High-res export", "2 revision rounds"],
      price: "From 500,000 VND",
      open: false,
      accent: "border-teal-500/40 hover:border-teal-400/60",
    },
    {
      id: "4",
      title: "2D Animation Clip",
      description: "Short looping or non-looping 2D animation — character walk cycles, emotion clips, or animated stickers.",
      features: ["Up to 5 seconds / looping", "Frame-by-frame or tweened", "MP4 + GIF export", "1 revision round"],
      price: "From 1,200,000 VND",
      open: true,
      accent: "border-indigo-500/40 hover:border-indigo-400/60",
    },
  ] as CommissionTier[],

  WORKS: [
    { id: "1", title: "Fantasy Character", type: "Character Design", gradient: "from-indigo-900 via-teal-900 to-cyan-950", accent: "text-cyan-300" },
    { id: "2", title: "Forest Spirit", type: "Background Art", gradient: "from-emerald-950 via-teal-900 to-indigo-950", accent: "text-emerald-300" },
    { id: "3", title: "Hero Concept", type: "Animation Design", gradient: "from-slate-900 via-purple-950 to-indigo-900", accent: "text-purple-300" },
    { id: "4", title: "Mystic Temple", type: "Environment", gradient: "from-teal-950 via-cyan-900 to-slate-900", accent: "text-teal-300" },
    { id: "5", title: "Whimsical Creature", type: "Character Design", gradient: "from-indigo-950 via-violet-900 to-purple-950", accent: "text-violet-300" },
    { id: "6", title: "Enchanted World", type: "Concept Art", gradient: "from-cyan-950 via-teal-900 to-emerald-950", accent: "text-cyan-200" },
  ] as WorkItem[],

  EXPERIENCE: [
    {
      id: "edu1",
      period: "2021 — 2025",
      role: "Bachelor in Information Technology",
      organization: "FPT University, Hanoi",
      detail: "Major in Digital Art & Design - Digital Animation.",
      highlight: true,
    },
    {
      id: "exp1",
      period: "1.2025 — 5.2025",
      role: "2D Graduation Short Film",
      organization: "FPT University",
      detail: "Role: 2D Artist / Animator",
      highlight: true,
    },
    {
      id: "exp2",
      period: "8.2023 — 12.2023",
      role: "2D Artist",
      organization: "JOS Company",
      detail: "Concept and production art.",
      highlight: false,
    },
  ] as ExperienceEntry[],

  SKILLS: [
    { id: "1", name: "Photoshop", label: "Ps", category: "Design" },
    { id: "2", name: "Clip Studio Paint", label: "Cs", category: "Illustration" },
    { id: "3", name: "After Effects", label: "Ae", category: "Animation" },
    { id: "4", name: "Illustrator", label: "Ai", category: "Design" },
    { id: "5", name: "Procreate", label: "Pr", category: "Illustration" },
  ] as Skill[],
};

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

export function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new StorageEvent("storage", { key, newValue: JSON.stringify(value) }));
}

export function isAdminAuthed(): boolean {
  return sessionStorage.getItem(KEYS.ADMIN_AUTH) === "true";
}

export function setAdminAuthed(val: boolean) {
  if (val) sessionStorage.setItem(KEYS.ADMIN_AUTH, "true");
  else sessionStorage.removeItem(KEYS.ADMIN_AUTH);
}

export function checkPassword(input: string): boolean {
  const stored = localStorage.getItem(KEYS.ADMIN_PASSWORD) ?? DEFAULT_PASSWORD;
  return input === stored;
}
