import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { PenTool, Mail, Phone, Facebook, Instagram, Layers, Brush, Wand2, Camera, Play, CheckCircle, Clock, Send, Menu, X, Settings, User, ChevronDown, Sparkles } from "lucide-react";
import { Link } from "wouter";
import coverImg from "@assets/WhatsApp_Image_2026-05-02_at_11.15.25_PM_1777752987759.jpeg";
import resumeImg from "@assets/WhatsApp_Image_2026-05-02_at_11.15.25_PM_(1)_1777752987758.jpeg";
import {
  KEYS, DEFAULTS, load,
  type HeroData, type AboutData, type ContactData,
  type CommissionTier, type WorkItem, type ExperienceEntry, type Skill,
} from "../lib/storage";

/* ─── Ambient floating particles ───────────────────────────────────── */
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: 1.5 + Math.random() * 3,
  delay: Math.random() * 8,
  duration: 8 + Math.random() * 14,
  opacity: 0.15 + Math.random() * 0.35,
}));

function FloatingParticles({ count = 22 }: { count?: number }) {
  const particles = PARTICLES.slice(0, count);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div key={p.id}
          className="absolute rounded-full bg-primary"
          style={{ left: `${p.x}%`, bottom: "-8px", width: p.size, height: p.size, opacity: 0 }}
          animate={{ y: [0, -(typeof window !== "undefined" ? window.innerHeight * 1.1 : 900)], opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

/* ─── Scroll-progress top bar ───────────────────────────────────────── */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-cyan-300 to-primary z-[60]"
    />
  );
}

/* ─── Cursor glow (hero only) ───────────────────────────────────────── */
function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  return (
    <motion.div
      className="fixed w-64 h-64 rounded-full pointer-events-none z-10"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%",
               background: "radial-gradient(circle, rgba(0,200,200,0.07) 0%, transparent 70%)" }}
    />
  );
}

/* ─── Section heading with shimmer ─────────────────────────────────── */
function ShimmerHeading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.75 }}
      className={`font-serif text-primary relative inline-block ${className}`}>
      {children}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: "-120%" }} whileInView={{ x: "120%" }}
        viewport={{ once: true }} transition={{ duration: 1, delay: 0.6, ease: "easeInOut" }}
      />
    </motion.h2>
  );
}

const CATEGORY_ICONS: Record<string, typeof Brush> = {
  Design: Camera,
  Illustration: PenTool,
  Animation: Layers,
  "3D": Wand2,
  Video: Layers,
  Other: Brush,
};

function useStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => load(key, fallback));
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try { setValue(JSON.parse(e.newValue) as T); } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);
  return value;
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  const hero = useStorage<HeroData>(KEYS.HERO, DEFAULTS.HERO);
  const about = useStorage<AboutData>(KEYS.ABOUT, DEFAULTS.ABOUT);
  const reelUrl = useStorage<string>(KEYS.REEL_URL, DEFAULTS.REEL_URL);
  const contact = useStorage<ContactData>(KEYS.CONTACT, DEFAULTS.CONTACT);
  const commissions = useStorage<CommissionTier[]>(KEYS.COMMISSIONS, DEFAULTS.COMMISSIONS);
  const works = useStorage<WorkItem[]>(KEYS.WORKS, DEFAULTS.WORKS);
  const experience = useStorage<ExperienceEntry[]>(KEYS.EXPERIENCE, DEFAULTS.EXPERIENCE);
  const skills = useStorage<Skill[]>(KEYS.SKILLS, DEFAULTS.SKILLS);
  const profilePicPath = useStorage<string | null>(KEYS.PROFILE_PIC, null);
  const heroBgPath = useStorage<string | null>(KEYS.HERO_BG, null);

  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const navItems = ["Hero", "Reel", "About", "Skills", "Portfolio", "Commissions", "Experience", "Contact"];

  const educationEntries = experience.slice(0, 1);
  const experienceEntries = experience.slice(1);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgressBar />
      <CursorGlow />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="hidden md:flex container mx-auto px-6 py-3 justify-center flex-wrap gap-x-8 gap-y-1 lg:gap-x-10">
          {navItems.map((item) => (
            <button key={item} onClick={() => scrollTo(item.toLowerCase())}
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors focus:outline-none"
              data-testid={`nav-${item.toLowerCase()}`}>
              {item}
            </button>
          ))}
        </div>
        <div className="md:hidden flex items-center justify-between px-5 py-3">
          <span className="text-sm font-serif text-primary tracking-wide">{hero.name}</span>
          <button onClick={() => setMenuOpen((o) => !o)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors focus:outline-none"
            data-testid="mobile-menu-toggle">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border/30 bg-background/95">
              <div className="px-5 py-4 grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <button key={item} onClick={() => scrollTo(item.toLowerCase())}
                    className="text-left text-sm py-2.5 px-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors uppercase tracking-widest">
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
          <img
            src={heroBgPath ? `/api/storage${heroBgPath}` : coverImg}
            alt="Hero Cover"
            className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
          />
        </motion.div>

        {/* Ambient particles */}
        <FloatingParticles count={16} />

        {/* Radial corner glows */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/6 rounded-full blur-3xl pointer-events-none z-10" />

        <div className="relative z-20 text-center px-5 max-w-4xl w-full">
          <motion.p initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1 }}
            className="text-xs uppercase tracking-[0.4em] text-primary mb-5 flex items-center justify-center gap-2">
            <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 2 }}>
              <Sparkles className="w-3 h-3" />
            </motion.span>
            2D Art & Animation
            <motion.span animate={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 2.3 }}>
              <Sparkles className="w-3 h-3" />
            </motion.span>
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-serif text-gradient mb-5 leading-tight">
            {hero.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}
            className="text-base sm:text-xl md:text-2xl font-light tracking-wide text-foreground/70 mb-4">
            {hero.subtitle}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}
            className="text-xs uppercase tracking-[0.3em] text-primary/60">
            {hero.tagline}
          </motion.p>
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.4 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo("reel")}
            className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/40 text-sm text-primary/80 hover:bg-primary/10 transition-all"
            data-testid="hero-watch-reel">
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <Play className="w-3.5 h-3.5 fill-current" />
            </motion.span>
            Watch Show Reel
          </motion.button>
        </div>

        {/* Scroll down indicator */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
          onClick={() => scrollTo("reel")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-muted-foreground/40 hover:text-primary/60 transition-colors"
          aria-label="Scroll down">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </section>

      {/* Show Reel */}
      <section id="reel" className="py-14 md:py-24 relative bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,180,180,0.08)_0%,transparent_65%)] pointer-events-none" />
        <FloatingParticles count={10} />
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-8 md:mb-12">
            <motion.p initial={{ opacity: 0, letterSpacing: "0.2em" }} whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="text-xs uppercase text-primary mb-3 tracking-[0.4em]">Animation Demo</motion.p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground">
              Show Reel <span className="text-primary">2025</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-white/5 aspect-video bg-gradient-to-br from-slate-950 via-teal-950 to-indigo-950">
            {reelUrl ? (
              <iframe className="w-full h-full" src={reelUrl} title="Show Reel"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-4">
                <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]" />
                <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center backdrop-blur-sm cursor-pointer"
                  data-testid="reel-play-button">
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-primary fill-primary ml-1" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-foreground/70 text-sm font-medium tracking-wide">2D Character & Animation Demo</p>
                  <a href={contact.instagram} target="_blank" rel="noreferrer"
                    className="text-primary/60 text-xs hover:text-primary transition-colors underline underline-offset-4"
                    data-testid="reel-instagram-link">
                    View work on Instagram
                  </a>
                </div>
              </div>
            )}
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="text-center text-xs sm:text-sm text-muted-foreground mt-5 px-4 leading-relaxed">
            Character design · Background art · 2D frame-by-frame animation · Concept illustration
          </motion.p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 md:py-28 relative z-20 overflow-hidden">
        <FloatingParticles count={8} />
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}
              className="space-y-6 order-2 lg:order-1">
              <ShimmerHeading className="text-3xl sm:text-4xl md:text-5xl overflow-hidden">About Me</ShimmerHeading>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                {[about.bio1, about.bio2].filter(Boolean).map((para, i) => (
                  <motion.p key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}>
                    {para}
                  </motion.p>
                ))}
              </div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.5 }} className="pt-5 border-t border-border/50">
                <ul className="space-y-2 text-sm">
                  {[about.gender, about.dob && `Born ${about.dob}`, about.location].filter(Boolean).map((line, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.55 + i * 0.1 }}>
                      <span className="text-primary mr-2">✦</span>{line}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9 }}
              className="relative order-1 lg:order-2 flex items-center justify-center">
              {/* Ambient glow */}
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-110 z-0" />
              {/* Slow-spinning decorative ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                className="absolute w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] lg:w-[420px] lg:h-[420px] rounded-full border border-primary/20 border-dashed z-10"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
                className="absolute w-[280px] h-[280px] sm:w-[336px] sm:h-[336px] lg:w-[372px] lg:h-[372px] rounded-full border border-primary/10 z-10"
              />
              {/* Bokeh dots */}
              {[
                { top: "8%",  left: "18%",  size: 6,  delay: 0 },
                { top: "20%", right: "12%", size: 4,  delay: 0.6 },
                { bottom: "14%", left: "10%", size: 5, delay: 1.2 },
                { bottom: "8%", right: "20%", size: 3, delay: 0.3 },
              ].map((dot, i) => (
                <motion.div key={i}
                  style={{ position: "absolute", top: dot.top, left: dot.left, right: dot.right, bottom: dot.bottom,
                           width: dot.size, height: dot.size }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
                  className="rounded-full bg-primary z-10"
                />
              ))}
              {/* Profile circle */}
              <div className="relative z-20 w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden
                              ring-2 ring-primary/40 ring-offset-4 ring-offset-background shadow-2xl"
                   data-testid="about-profile-image">
                {profilePicPath ? (
                  <img src={`/api/storage${profilePicPath}`} alt={hero.name}
                       className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background to-primary/5
                                  flex flex-col items-center justify-center gap-3">
                    <User className="w-16 h-16 text-primary/40" strokeWidth={1.2} />
                    <span className="text-xs text-muted-foreground/50 tracking-widest uppercase">Add photo</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-16 md:py-28 bg-secondary/30 relative overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(0,200,200,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,200,1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          <div className="text-center mb-10 md:mb-16">
            <ShimmerHeading className="text-3xl sm:text-4xl md:text-5xl">Toolkit</ShimmerHeading>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.3 }} className="mt-3 text-xs sm:text-sm text-muted-foreground/60 uppercase tracking-widest">
              Tools & Software
            </motion.p>
          </div>
          {skills.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">No skills added yet.</p>
          ) : (
            <div className={`grid gap-4 sm:gap-5 ${
              skills.length <= 3 ? "grid-cols-1 sm:grid-cols-3 max-w-xl mx-auto"
                : skills.length === 4 ? "grid-cols-2 md:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"}`}>
              {skills.map((skill, index) => {
                const Icon = CATEGORY_ICONS[skill.category] ?? Brush;
                return (
                  <motion.div key={skill.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: index * 0.07 }} whileHover={{ y: -6 }}
                    className="group flex flex-col items-center justify-center gap-3 p-5 sm:p-7 bg-card rounded-2xl border border-border/40 shadow-md hover:border-primary/50 transition-all duration-300"
                    data-testid={`skill-card-${index}`}>
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-primary/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary/60 border border-border/30 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                        <span className="font-mono font-bold text-base sm:text-lg text-primary/70 group-hover:text-primary transition-colors">
                          {skill.label || skill.name.slice(0, 2)}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs sm:text-sm font-medium block leading-snug">{skill.name}</span>
                      <span className="text-xs text-muted-foreground/50 mt-0.5 block">{skill.category}</span>
                    </div>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary/30 group-hover:text-primary/60 transition-colors" />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-16 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="text-center mb-10 md:mb-16">
            <ShimmerHeading className="text-3xl sm:text-4xl md:text-5xl">Selected Works</ShimmerHeading>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {works.map((item, index) => {
              const hasImage = Boolean(item.imageObjectPath);
              const imageUrl = hasImage ? `/api/storage${item.imageObjectPath}` : null;
              return (
                <Link key={item.id} href={`/work/${item.id}`} className="block">
                  <motion.div initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.5 }}
                    className={`relative overflow-hidden rounded-xl group h-52 sm:h-64 border border-white/5 cursor-pointer ${
                      hasImage ? "bg-black" : `bg-gradient-to-br ${item.gradient}`
                    }`}
                    data-testid={`portfolio-item-${index}`}>

                    {/* Actual artwork image */}
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    {/* Gradient shimmer overlay (no-image mode only) */}
                    {!hasImage && (
                      <>
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_30%_40%,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-5 group-hover:opacity-0 transition-opacity duration-500">
                          <Brush className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 ${item.accent} opacity-60`} />
                          <span className={`font-serif text-xl sm:text-2xl ${item.accent} opacity-80 text-center`}>{item.title}</span>
                        </div>
                      </>
                    )}

                    {/* Hover overlay — title, type, description + "View Project" cue */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 sm:p-6">
                      <span className={`font-serif text-xl sm:text-2xl ${item.accent} drop-shadow`}>{item.title}</span>
                      <span className="text-sm text-white/70 mt-0.5">{item.type}</span>
                      {item.description && (
                        <p className="text-xs text-white/50 mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
                      )}
                      <span className="text-xs text-primary/80 mt-2 tracking-widest uppercase">View Project →</span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commissions */}
      <section id="commissions" className="py-16 md:py-28 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(0,150,150,0.06)_0%,transparent_60%)] pointer-events-none" />
        <FloatingParticles count={8} />
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-4">
            <motion.p initial={{ opacity: 0, y: -8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6 }} className="text-xs uppercase tracking-[0.4em] text-primary mb-3">Open for Work</motion.p>
            <ShimmerHeading className="text-3xl sm:text-4xl md:text-5xl text-foreground mb-5">Commissions</ShimmerHeading>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Looking for custom artwork? I create characters, environments, and animations tailored to your vision.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }} className="flex justify-center mb-10 md:mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Currently accepting commissions
            </span>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {commissions.map((tier, index) => (
              <motion.div key={tier.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl border bg-card/60 backdrop-blur-sm p-5 sm:p-7 flex flex-col gap-4 transition-all duration-300 ${tier.accent}`}
                data-testid={`commission-tier-${index}`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg sm:text-xl font-semibold leading-tight">{tier.title}</h3>
                  <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 ${tier.open ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                    {tier.open ? <><CheckCircle className="w-3 h-3" />Open</> : <><Clock className="w-3 h-3" />Waitlist</>}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{tier.description}</p>
                <ul className="space-y-2">
                  {tier.features.map((feature, fi) => (
                    <motion.li key={fi} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: index * 0.1 + fi * 0.06 }}
                      className="flex items-center gap-2.5 text-sm text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />{feature}
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between gap-3">
                  <span className="text-primary font-medium text-sm">{tier.price}</span>
                  <a href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all whitespace-nowrap"
                    data-testid={`commission-contact-${index}`}>
                    <Send className="w-3 h-3" />Inquire
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
            className="mt-10 md:mt-14 p-5 sm:p-6 rounded-xl border border-border/30 bg-card/30 text-sm text-muted-foreground space-y-2 max-w-3xl mx-auto">
            <p className="font-medium text-foreground/70 mb-3 uppercase tracking-widest text-xs">Terms & Notes</p>
            <p>Payment is split: 50% upfront, 50% on completion. Accepted via bank transfer or MoMo.</p>
            <p>Commercial use rights available for an additional fee — please mention this in your inquiry.</p>
            <p>Estimated turnaround is 7–21 days depending on complexity. Rush orders may be possible — ask first.</p>
            <p>All artwork remains in my portfolio unless you request otherwise.</p>
          </motion.div>
        </div>
      </section>

      {/* Experience & Education */}
      <section id="experience" className="py-16 md:py-28 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(rgba(0,200,200,1) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">
          <div className="space-y-16 md:space-y-24">
            {educationEntries.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <ShimmerHeading className="text-2xl sm:text-3xl md:text-4xl mb-8 md:mb-12 block">Education</ShimmerHeading>
                <div className="relative pl-6 sm:pl-8 space-y-10">
                  {/* Animated timeline line */}
                  <motion.div
                    className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-primary/60 to-primary/10 origin-top"
                    initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}
                    style={{ height: "100%" }}
                  />
                  {educationEntries.map((entry, i) => (
                    <motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
                      className="relative">
                      <div className={`absolute -left-[33px] sm:-left-[41px] top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-background border-2 ${entry.highlight ? "border-primary" : "border-primary/40"}`}>
                        {entry.highlight && (
                          <motion.div animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-primary/30" />
                        )}
                      </div>
                      <span className={`text-sm font-mono mb-2 block ${entry.highlight ? "text-primary" : "text-muted-foreground"}`}>{entry.period}</span>
                      <h3 className="text-lg sm:text-xl font-medium mb-1">{entry.role}</h3>
                      <p className="text-base sm:text-lg text-foreground/80 mb-2">{entry.organization}</p>
                      {entry.detail && <p className="text-muted-foreground text-sm">{entry.detail}</p>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {experienceEntries.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <ShimmerHeading className="text-2xl sm:text-3xl md:text-4xl mb-8 md:mb-12 block">Experience</ShimmerHeading>
                <div className="relative pl-6 sm:pl-8 space-y-10">
                  <motion.div
                    className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-primary/60 to-primary/10 origin-top"
                    initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}
                    style={{ height: "100%" }}
                  />
                  {experienceEntries.map((entry, i) => (
                    <motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
                      className="relative">
                      <div className={`absolute -left-[33px] sm:-left-[41px] top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-background border-2 ${entry.highlight ? "border-primary" : "border-primary/40"}`}>
                        {entry.highlight && (
                          <motion.div animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-primary/30" />
                        )}
                      </div>
                      <span className={`text-sm font-mono mb-2 block ${entry.highlight ? "text-primary" : "text-muted-foreground"}`}>{entry.period}</span>
                      <h3 className="text-lg sm:text-xl font-medium mb-1">{entry.role}</h3>
                      <p className="text-base sm:text-lg text-foreground/80 mb-2">{entry.organization}</p>
                      {entry.detail && <p className="text-muted-foreground text-sm">{entry.detail}</p>}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,150,150,0.1)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
        <FloatingParticles count={14} />
        {/* Pulsing concentric rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3].map((ring) => (
            <motion.div key={ring}
              className="absolute rounded-full border border-primary/10"
              animate={{ scale: [0.8, 1.6, 0.8], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 5, delay: ring * 1.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: ring * 220, height: ring * 220 }}
            />
          ))}
        </div>
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="space-y-10 md:space-y-12">
            <ShimmerHeading className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gradient">Let's Create Together</ShimmerHeading>
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.2 }} className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Open to new opportunities, collaborations, and exploring whimsical worlds.
            </motion.p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-5 sm:gap-8">
              {contact.phone && (
                <motion.a href={`tel:${contact.phone}`}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05, color: "hsl(var(--primary))" }}
                  className="flex items-center justify-center gap-3 text-base hover:text-primary transition-colors" data-testid="contact-phone">
                  <Phone className="w-5 h-5 shrink-0" /><span>{contact.phone}</span>
                </motion.a>
              )}
              {contact.email && (
                <motion.a href={`mailto:${contact.email}`}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center gap-3 text-base hover:text-primary transition-colors min-w-0" data-testid="contact-email">
                  <Mail className="w-5 h-5 shrink-0" />
                  <span className="break-all text-sm sm:text-base">{contact.email}</span>
                </motion.a>
              )}
            </div>
            <div className="flex justify-center gap-5 sm:gap-8">
              {contact.facebook && (
                <motion.a href={contact.facebook} target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.92 }}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
                  className="p-3 sm:p-4 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300" data-testid="social-facebook">
                  <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.a>
              )}
              {contact.instagram && (
                <motion.a href={contact.instagram} target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.15, rotate: -5 }} whileTap={{ scale: 0.92 }}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
                  className="p-3 sm:p-4 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300" data-testid="social-instagram">
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 text-center text-sm text-muted-foreground bg-background px-4 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none gap-[12%] opacity-20">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div key={i}
              animate={{ opacity: [0, 1, 0], y: [4, -4, 4] }}
              transition={{ duration: 3 + i * 0.4, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}>
              <Sparkles className="w-3 h-3 text-primary" />
            </motion.div>
          ))}
        </div>
        <p className="relative z-10">&copy; 2025 {hero.name}. All rights reserved.</p>
      </footer>

      {/* Admin floating button */}
      <Link href="/admin"
        className="fixed bottom-5 right-5 z-50 w-9 h-9 rounded-full bg-card/80 border border-border/40 backdrop-blur-sm flex items-center justify-center text-muted-foreground/40 hover:text-primary hover:border-primary/40 transition-all shadow-lg"
        title="Admin" data-testid="admin-floating-btn">
        <Settings className="w-4 h-4" />
      </Link>
    </div>
  );
}
