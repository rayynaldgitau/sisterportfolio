import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { PenTool, Mail, Phone, Facebook, Instagram, Layers, Brush, Wand2, Camera, Settings, Play, CheckCircle, Clock, Send, Menu, X } from "lucide-react";
import { Link } from "wouter";
import coverImg from "@assets/WhatsApp_Image_2026-05-02_at_11.15.25_PM_1777752987759.jpeg";
import resumeImg from "@assets/WhatsApp_Image_2026-05-02_at_11.15.25_PM_(1)_1777752987758.jpeg";

const PROFILE_PIC_KEY = "portfolio_profile_pic_path";
const SKILLS_KEY = "portfolio_skills";

interface Skill {
  id: string;
  name: string;
  label: string;
  category: string;
}

const DEFAULT_SKILLS: Skill[] = [
  { id: "1", name: "Photoshop", label: "Ps", category: "Design" },
  { id: "2", name: "Clip Studio Paint", label: "Cs", category: "Illustration" },
  { id: "3", name: "After Effects", label: "Ae", category: "Animation" },
  { id: "4", name: "Illustrator", label: "Ai", category: "Design" },
  { id: "5", name: "Procreate", label: "Pr", category: "Illustration" },
];

function loadSkills(): Skill[] {
  try {
    const raw = localStorage.getItem(SKILLS_KEY);
    if (raw) return JSON.parse(raw) as Skill[];
  } catch {}
  return DEFAULT_SKILLS;
}

const CATEGORY_ICONS: Record<string, typeof Brush> = {
  Design: Camera,
  Illustration: PenTool,
  Animation: Layers,
  "3D": Wand2,
  Video: Layers,
  Other: Brush,
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const [profilePicPath, setProfilePicPath] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_PIC_KEY);
    if (saved) setProfilePicPath(saved);
    setSkills(loadSkills());

    const onStorage = (e: StorageEvent) => {
      if (e.key === PROFILE_PIC_KEY) setProfilePicPath(e.newValue);
      if (e.key === SKILLS_KEY) {
        try {
          if (e.newValue) setSkills(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const navItems = ["Hero", "Reel", "About", "Skills", "Portfolio", "Commissions", "Experience", "Contact"];

  const portfolioItems = [
    { title: "Fantasy Character", type: "Character Design", gradient: "from-indigo-900 via-teal-900 to-cyan-950", accent: "text-cyan-300" },
    { title: "Forest Spirit", type: "Background Art", gradient: "from-emerald-950 via-teal-900 to-indigo-950", accent: "text-emerald-300" },
    { title: "Hero Concept", type: "Animation Design", gradient: "from-slate-900 via-purple-950 to-indigo-900", accent: "text-purple-300" },
    { title: "Mystic Temple", type: "Environment", gradient: "from-teal-950 via-cyan-900 to-slate-900", accent: "text-teal-300" },
    { title: "Whimsical Creature", type: "Character Design", gradient: "from-indigo-950 via-violet-900 to-purple-950", accent: "text-violet-300" },
    { title: "Enchanted World", type: "Concept Art", gradient: "from-cyan-950 via-teal-900 to-emerald-950", accent: "text-cyan-200" },
  ];

  const commissionTiers = [
    {
      title: "Character Illustration",
      description: "Full-body or bust character illustration with flat or full shading. Perfect for OCs, fan art, or portrait commissions.",
      features: ["Sketch + clean lineart", "Flat or full colour shading", "Simple background included", "1 revision round"],
      price: "From 300,000 VND",
      open: true,
      accent: "border-cyan-500/40 hover:border-cyan-400/60",
      badgeColor: "bg-emerald-500/20 text-emerald-300",
    },
    {
      title: "Character Design Sheet",
      description: "Full character reference sheet with front/back/side views, colour palette, and expression samples. Ideal for worldbuilding or game dev.",
      features: ["3-view turnaround", "Expression sheet (4–6 poses)", "Colour palette guide", "2 revision rounds"],
      price: "From 700,000 VND",
      open: true,
      accent: "border-violet-500/40 hover:border-violet-400/60",
      badgeColor: "bg-emerald-500/20 text-emerald-300",
    },
    {
      title: "Background / Environment",
      description: "Detailed 2D background or environment painting for comics, games, or visual novels. Atmospheric and hand-crafted.",
      features: ["Concept sketch phase", "Full digital painting", "High-res export", "2 revision rounds"],
      price: "From 500,000 VND",
      open: false,
      accent: "border-teal-500/40 hover:border-teal-400/60",
      badgeColor: "bg-amber-500/20 text-amber-300",
    },
    {
      title: "2D Animation Clip",
      description: "Short looping or non-looping 2D animation — character walk cycles, emotion clips, or animated stickers.",
      features: ["Up to 5 seconds / looping", "Frame-by-frame or tweened", "MP4 + GIF export", "1 revision round"],
      price: "From 1,200,000 VND",
      open: true,
      accent: "border-indigo-500/40 hover:border-indigo-400/60",
      badgeColor: "bg-emerald-500/20 text-emerald-300",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        {/* Desktop nav */}
        <div className="hidden md:flex container mx-auto px-6 py-3 justify-center flex-wrap gap-x-8 gap-y-1 lg:gap-x-10">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors focus:outline-none"
              data-testid={`nav-${item.toLowerCase()}`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Mobile nav bar */}
        <div className="md:hidden flex items-center justify-between px-5 py-3">
          <span className="text-sm font-serif text-primary tracking-wide">Tran Phuong Thao</span>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors focus:outline-none"
            data-testid="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border/30 bg-background/95"
            >
              <div className="px-5 py-4 grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollTo(item.toLowerCase())}
                    className="text-left text-sm py-2.5 px-3 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors uppercase tracking-widest focus:outline-none"
                    data-testid={`mobile-nav-${item.toLowerCase()}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
          <img src={coverImg} alt="Hero Cover" className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
        </motion.div>

        <div className="relative z-20 text-center px-5 max-w-4xl w-full">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.1 }}
            className="text-xs uppercase tracking-[0.4em] text-primary mb-5"
          >
            2D Art & Animation
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-serif text-gradient mb-5 leading-tight"
          >
            Tran Phuong Thao
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-base sm:text-xl md:text-2xl font-light tracking-wide text-foreground/70 mb-4"
          >
            Concept Artist & 2D Animator
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xs uppercase tracking-[0.3em] text-primary/60"
          >
            Portfolio · 2025
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            onClick={() => scrollTo("reel")}
            className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/40 text-sm text-primary/80 hover:bg-primary/10 transition-all"
            data-testid="hero-watch-reel"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Watch Show Reel
          </motion.button>
        </div>
      </section>

      {/* Show Reel Section */}
      <section id="reel" className="py-14 md:py-24 relative bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,180,180,0.08)_0%,transparent_65%)] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-primary mb-3">Animation Demo</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground">
              Show Reel <span className="text-primary">2025</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-white/5 aspect-video bg-gradient-to-br from-slate-950 via-teal-950 to-indigo-950"
          >
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/?listType=user_uploads&list=tealis_drawing&autoplay=0"
              title="Tran Phuong Thao — Show Reel 2025"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              data-testid="reel-iframe"
              style={{ display: "none" }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-4">
              <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]" />
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center backdrop-blur-sm cursor-pointer"
                data-testid="reel-play-button"
              >
                <Play className="w-6 h-6 md:w-8 md:h-8 text-primary fill-primary ml-1" />
              </motion.div>
              <div className="text-center space-y-2">
                <p className="text-foreground/70 text-sm font-medium tracking-wide">2D Character & Animation Demo</p>
                <a
                  href="https://instagram.com/tealis_drawing"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary/60 text-xs hover:text-primary transition-colors underline underline-offset-4"
                  data-testid="reel-instagram-link"
                >
                  View work on @tealis_drawing
                </a>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center text-xs sm:text-sm text-muted-foreground mt-5 px-4 leading-relaxed"
          >
            Character design · Background art · 2D frame-by-frame animation · Concept illustration
          </motion.p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-28 relative z-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="space-y-6 order-2 lg:order-1"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary">About Me</h2>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p>
                  My name is <strong className="text-foreground font-medium">Tran Phuong Thao</strong>, a 2D Concept & Animation artist, passionate about creating whimsical fantasy worlds and stories.
                </p>
                <p>
                  My strengths are Character and Background Concept Design, 2D Animation and Illustration. I aspire to create and develop new ideas and always ready to collaborate effectively with team, study, self-evaluate, and continuously improve my skills.
                </p>
              </div>
              <div className="pt-5 border-t border-border/50">
                <ul className="space-y-2 text-sm">
                  <li><span className="text-primary mr-2">✦</span>Female</li>
                  <li><span className="text-primary mr-2">✦</span>Born 03.03.2002</li>
                  <li><span className="text-primary mr-2">✦</span>Hanoi, Vietnam</li>
                </ul>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="relative order-1 lg:order-2"
            >
              <div className="absolute -inset-3 md:-inset-4 bg-primary/10 rounded-2xl blur-2xl z-0" />
              <img
                src={profilePicPath ? `/api/storage${profilePicPath}` : resumeImg}
                alt="Tran Phuong Thao"
                className="relative z-10 rounded-xl shadow-2xl border border-border/50 w-full object-cover max-h-[480px] lg:max-h-none"
                data-testid="about-profile-image"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 md:py-28 bg-secondary/30 relative">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary">Toolkit</h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground/60 uppercase tracking-widest">Tools & Software</p>
          </motion.div>

          {skills.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">No skills added yet.</p>
          ) : (
            <div className={`grid gap-4 sm:gap-5 ${
              skills.length <= 3
                ? "grid-cols-1 xs:grid-cols-3 max-w-xl mx-auto"
                : skills.length === 4
                  ? "grid-cols-2 md:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            }`}>
              {skills.map((skill, index) => {
                const Icon = CATEGORY_ICONS[skill.category] ?? Brush;
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    whileHover={{ y: -6 }}
                    className="group flex flex-col items-center justify-center gap-3 p-5 sm:p-7 bg-card rounded-2xl border border-border/40 shadow-md hover:border-primary/50 transition-all duration-300"
                    data-testid={`skill-card-${index}`}
                  >
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

      {/* Portfolio / Selected Works Section */}
      <section id="portfolio" className="py-16 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-center mb-10 md:mb-16 text-primary"
          >
            Selected Works
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className={`relative overflow-hidden rounded-xl group h-52 sm:h-64 bg-gradient-to-br ${item.gradient} border border-white/5`}
                data-testid={`portfolio-item-${index}`}
              >
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_30%_40%,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-5 group-hover:opacity-0 transition-opacity duration-500">
                  <Brush className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 ${item.accent} opacity-60`} />
                  <span className={`font-serif text-xl sm:text-2xl ${item.accent} opacity-80 text-center`}>{item.title}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 sm:p-6">
                  <span className={`font-serif text-xl sm:text-2xl ${item.accent}`}>{item.title}</span>
                  <span className="text-sm text-white/70 mt-1">{item.type}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commissions Section */}
      <section id="commissions" className="py-16 md:py-28 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(0,150,150,0.06)_0%,transparent_60%)] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-primary mb-3">Open for Work</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mb-5">Commissions</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Looking for custom artwork? I create characters, environments, and animations tailored to your vision. All work is delivered digitally with full communication throughout the process.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-10 md:mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Currently accepting commissions
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {commissionTiers.map((tier, index) => (
              <motion.div
                key={tier.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`relative rounded-2xl border bg-card/60 backdrop-blur-sm p-5 sm:p-7 flex flex-col gap-4 transition-all duration-300 ${tier.accent}`}
                data-testid={`commission-tier-${index}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg sm:text-xl font-semibold leading-tight">{tier.title}</h3>
                  <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${tier.badgeColor} flex items-center gap-1.5`}>
                    {tier.open ? (
                      <><CheckCircle className="w-3 h-3" />Open</>
                    ) : (
                      <><Clock className="w-3 h-3" />Waitlist</>
                    )}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">{tier.description}</p>

                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between gap-3">
                  <span className="text-primary font-medium text-sm">{tier.price}</span>
                  <a
                    href="mailto:tranphuongthao03032002@gmail.com"
                    className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all whitespace-nowrap"
                    data-testid={`commission-contact-${index}`}
                  >
                    <Send className="w-3 h-3" />
                    Inquire
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Terms Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-10 md:mt-14 p-5 sm:p-6 rounded-xl border border-border/30 bg-card/30 text-sm text-muted-foreground space-y-2 max-w-3xl mx-auto"
            data-testid="commission-terms"
          >
            <p className="font-medium text-foreground/70 mb-3 uppercase tracking-widest text-xs">Terms & Notes</p>
            <p>Payment is split: 50% upfront, 50% on completion. Accepted via bank transfer or MoMo.</p>
            <p>Commercial use rights available for an additional fee — please mention this in your inquiry.</p>
            <p>Estimated turnaround is 7–21 days depending on complexity. Rush orders may be possible — ask first.</p>
            <p>All artwork remains in my portfolio unless you request otherwise.</p>
          </motion.div>
        </div>
      </section>

      {/* Experience & Education Section */}
      <section id="experience" className="py-16 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="space-y-16 md:space-y-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary mb-8 md:mb-12">Education</h2>
              <div className="relative pl-6 sm:pl-8 border-l-2 border-primary/30 space-y-10 md:space-y-12">
                <div className="relative">
                  <div className="absolute -left-[33px] sm:-left-[41px] top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-background border-2 border-primary" />
                  <span className="text-sm text-primary font-mono mb-2 block">2021 — 2025</span>
                  <h3 className="text-lg sm:text-xl font-medium mb-1">Bachelor in Information Technology</h3>
                  <p className="text-base sm:text-lg text-foreground/80 mb-2">FPT University, Hanoi</p>
                  <p className="text-muted-foreground text-sm">Major in Digital Art & Design - Digital Animation.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary mb-8 md:mb-12">Experience</h2>
              <div className="relative pl-6 sm:pl-8 border-l-2 border-primary/30 space-y-10 md:space-y-12">
                <div className="relative">
                  <div className="absolute -left-[33px] sm:-left-[41px] top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-background border-2 border-primary" />
                  <span className="text-sm text-primary font-mono mb-2 block">1.2025 — 5.2025</span>
                  <h3 className="text-lg sm:text-xl font-medium mb-1">2D Graduation Short Film</h3>
                  <p className="text-base sm:text-lg text-foreground/80 mb-2">FPT University</p>
                  <p className="text-muted-foreground text-sm">Role: 2D Artist / Animator</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[33px] sm:-left-[41px] top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-background border-2 border-primary/50" />
                  <span className="text-sm text-muted-foreground font-mono mb-2 block">8.2023 — 12.2023</span>
                  <h3 className="text-lg sm:text-xl font-medium mb-1">2D Artist</h3>
                  <p className="text-base sm:text-lg text-foreground/80 mb-2">JOS Company</p>
                  <p className="text-muted-foreground text-sm">Concept and production art.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,150,150,0.1)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-10 md:space-y-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-gradient">Let's Create Together</h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Open to new opportunities, collaborations, and exploring whimsical worlds.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-5 sm:gap-8">
              <a href="tel:0968030257" className="flex items-center justify-center gap-3 text-base hover:text-primary transition-colors" data-testid="contact-phone">
                <Phone className="w-5 h-5 shrink-0" />
                <span>0968 030 257</span>
              </a>
              <a href="mailto:tranphuongthao03032002@gmail.com" className="flex items-center justify-center gap-3 text-base hover:text-primary transition-colors min-w-0" data-testid="contact-email">
                <Mail className="w-5 h-5 shrink-0" />
                <span className="break-all text-sm sm:text-base">tranphuongthao03032002@gmail.com</span>
              </a>
            </div>

            <div className="flex justify-center gap-5 sm:gap-8">
              <a href="https://www.facebook.com/rchtran" target="_blank" rel="noreferrer" className="p-3 sm:p-4 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300" data-testid="social-facebook">
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a href="https://instagram.com/tealis_drawing" target="_blank" rel="noreferrer" className="p-3 sm:p-4 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300" data-testid="social-instagram">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 text-center text-sm text-muted-foreground bg-background px-4">
        <p>&copy; 2025 Tran Phuong Thao. All rights reserved.</p>
        <Link href="/admin" className="inline-flex items-center gap-1.5 mt-3 text-xs text-muted-foreground/40 hover:text-primary/60 transition-colors" data-testid="admin-link">
          <Settings className="w-3 h-3" />
          Admin
        </Link>
      </footer>
    </div>
  );
}
