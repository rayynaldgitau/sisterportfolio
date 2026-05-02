import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PenTool, Mail, Phone, Facebook, Instagram, Layers, Brush, Wand2, Camera, Settings } from "lucide-react";
import { Link } from "wouter";
import coverImg from "@assets/WhatsApp_Image_2026-05-02_at_11.15.25_PM_1777752987759.jpeg";
import resumeImg from "@assets/WhatsApp_Image_2026-05-02_at_11.15.25_PM_(1)_1777752987758.jpeg";

const PROFILE_PIC_KEY = "portfolio_profile_pic_path";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const [profilePicPath, setProfilePicPath] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_PIC_KEY);
    if (saved) setProfilePicPath(saved);
    const onStorage = (e: StorageEvent) => {
      if (e.key === PROFILE_PIC_KEY) setProfilePicPath(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = ["Hero", "About", "Skills", "Portfolio", "Experience", "Contact"];

  const portfolioItems = [
    { title: "Fantasy Character", type: "Character Design", gradient: "from-indigo-900 via-teal-900 to-cyan-950", accent: "text-cyan-300" },
    { title: "Forest Spirit", type: "Background Art", gradient: "from-emerald-950 via-teal-900 to-indigo-950", accent: "text-emerald-300" },
    { title: "Hero Concept", type: "Animation Design", gradient: "from-slate-900 via-purple-950 to-indigo-900", accent: "text-purple-300" },
    { title: "Mystic Temple", type: "Environment", gradient: "from-teal-950 via-cyan-900 to-slate-900", accent: "text-teal-300" },
    { title: "Whimsical Creature", type: "Character Design", gradient: "from-indigo-950 via-violet-900 to-purple-950", accent: "text-violet-300" },
    { title: "Enchanted World", type: "Concept Art", gradient: "from-cyan-950 via-teal-900 to-emerald-950", accent: "text-cyan-200" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-background/50 backdrop-blur-md border-b border-border/50 py-4">
        <div className="container mx-auto px-6 flex justify-center space-x-6 md:space-x-12">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className="text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors focus:outline-none"
              data-testid={`nav-${item.toLowerCase()}`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
          <img src={coverImg} alt="Hero Cover" className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
        </motion.div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl font-serif text-gradient mb-6"
          >
            2D Art & Animation
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-3xl font-light tracking-wide text-foreground/80 mb-4"
          >
            Tran Phuong Thao
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-sm uppercase tracking-[0.3em] text-primary"
          >
            2025
          </motion.p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative z-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-primary">About Me</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  My name is <strong className="text-foreground font-medium">Tran Phuong Thao</strong>, a 2D Concept & Animation artist, passionate about creating whimsical fantasy worlds and stories.
                </p>
                <p>
                  My strengths are Character and Background Concept Design, 2D Animation and Illustration. I aspire to create and develop new ideas and always ready to collaborate effectively with team, study, self-evaluate, and continuously improve my skills.
                </p>
              </div>
              <div className="pt-6 border-t border-border/50">
                <ul className="space-y-2 text-sm">
                  <li><span className="text-primary mr-2">✦</span>Female</li>
                  <li><span className="text-primary mr-2">✦</span>Born 03.03.2002</li>
                  <li><span className="text-primary mr-2">✦</span>Hanoi, Vietnam</li>
                </ul>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-2xl z-0" />
              <img
                src={profilePicPath ? `/api/storage${profilePicPath}` : resumeImg}
                alt="Tran Phuong Thao"
                className="relative z-10 rounded-xl shadow-2xl border border-border/50 w-full object-cover"
                data-testid="about-profile-image"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 bg-secondary/30 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-center mb-16 text-primary"
          >
            Toolkit
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: "Photoshop", icon: Camera, label: "Ps" },
              { name: "Clip Studio Paint", icon: PenTool, label: "Cs" },
              { name: "After Effects", icon: Layers, label: "Ae" },
              { name: "Illustrator", icon: Wand2, label: "Ai" },
              { name: "Procreate", icon: Brush, label: "Pr" },
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, borderColor: "hsl(var(--primary))" }}
                className="flex flex-col items-center justify-center p-8 bg-card rounded-xl border border-border/50 shadow-lg transition-all duration-300"
              >
                <skill.icon className="w-12 h-12 mb-4 text-primary/80 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-center">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-32">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-center mb-16 text-primary"
          >
            Selected Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative overflow-hidden rounded-xl group h-64 bg-gradient-to-br ${item.gradient} border border-white/5`}
                data-testid={`portfolio-item-${index}`}
              >
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_30%_40%,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 group-hover:opacity-0 transition-opacity duration-500">
                  <Brush className={`w-12 h-12 mb-3 ${item.accent} opacity-60`} />
                  <span className={`font-serif text-2xl ${item.accent} opacity-80`}>{item.title}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span className={`font-serif text-2xl ${item.accent}`}>{item.title}</span>
                  <span className="text-sm text-white/70 mt-1">{item.type}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Education Section */}
      <section id="experience" className="py-32 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-24">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-12">Education</h2>
              <div className="relative pl-8 border-l-2 border-primary/30 space-y-12">
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary" />
                  <span className="text-sm text-primary font-mono mb-2 block">2021 — 2025</span>
                  <h3 className="text-xl font-medium mb-1">Bachelor in Information Technology</h3>
                  <p className="text-lg text-foreground/80 mb-2">FPT University, Hanoi</p>
                  <p className="text-muted-foreground text-sm">Major in Digital Art & Design - Digital Animation.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-12">Experience</h2>
              <div className="relative pl-8 border-l-2 border-primary/30 space-y-12">
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary" />
                  <span className="text-sm text-primary font-mono mb-2 block">1.2025 — 5.2025</span>
                  <h3 className="text-xl font-medium mb-1">2D Graduation Short Film</h3>
                  <p className="text-lg text-foreground/80 mb-2">FPT University</p>
                  <p className="text-muted-foreground text-sm">Role: 2D Artist / Animator</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary/50" />
                  <span className="text-sm text-muted-foreground font-mono mb-2 block">8.2023 — 12.2023</span>
                  <h3 className="text-xl font-medium mb-1">2D Artist</h3>
                  <p className="text-lg text-foreground/80 mb-2">JOS Company</p>
                  <p className="text-muted-foreground text-sm">Concept and production art.</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,150,150,0.1)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-4xl md:text-6xl font-serif text-gradient mb-8">Let's Create Together</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Open to new opportunities, collaborations, and exploring whimsical worlds.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <a href="tel:0968030257" className="flex items-center gap-3 text-lg hover:text-primary transition-colors" data-testid="contact-phone">
                <Phone className="w-5 h-5" />
                <span>0968 030 257</span>
              </a>
              <a href="mailto:tranphuongthao03032002@gmail.com" className="flex items-center gap-3 text-lg hover:text-primary transition-colors" data-testid="contact-email">
                <Mail className="w-5 h-5" />
                <span>tranphuongthao03032002@gmail.com</span>
              </a>
            </div>

            <div className="flex justify-center gap-8 mt-12">
              <a href="https://www.facebook.com/rchtran" target="_blank" rel="noreferrer" className="p-4 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300" data-testid="social-facebook">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://instagram.com/tealis_drawing" target="_blank" rel="noreferrer" className="p-4 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300" data-testid="social-instagram">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 text-center text-sm text-muted-foreground bg-background">
        <p>&copy; 2025 Tran Phuong Thao. All rights reserved.</p>
        <Link href="/admin" className="inline-flex items-center gap-1.5 mt-3 text-xs text-muted-foreground/40 hover:text-primary/60 transition-colors" data-testid="admin-link">
          <Settings className="w-3 h-3" />
          Admin
        </Link>
      </footer>
    </div>
  );
}