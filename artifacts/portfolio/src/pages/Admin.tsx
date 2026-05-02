import { useState, useRef, useEffect, useCallback } from "react";
import { useUpload } from "@workspace/object-storage-web";
import {
  Upload, CheckCircle, AlertCircle, ArrowLeft, Image, Plus, X,
  GripVertical, Save, Eye, EyeOff, Lock, ChevronDown, ChevronUp, LogOut
} from "lucide-react";
import { Link } from "wouter";
import AdminLogin from "../components/AdminLogin";
import {
  KEYS, DEFAULTS, load, save, isAdminAuthed, setAdminAuthed,
  type HeroData, type AboutData, type ContactData,
  type CommissionTier, type WorkItem, type ExperienceEntry, type Skill,
} from "../lib/storage";

const CATEGORIES = ["Design", "Illustration", "Animation", "3D", "Video", "Other"];
const GRADIENTS = [
  { label: "Teal/Cyan",    value: "from-indigo-900 via-teal-900 to-cyan-950",     accent: "text-cyan-300" },
  { label: "Emerald",      value: "from-emerald-950 via-teal-900 to-indigo-950",  accent: "text-emerald-300" },
  { label: "Purple/Slate", value: "from-slate-900 via-purple-950 to-indigo-900",  accent: "text-purple-300" },
  { label: "Teal/Slate",   value: "from-teal-950 via-cyan-900 to-slate-900",      accent: "text-teal-300" },
  { label: "Violet",       value: "from-indigo-950 via-violet-900 to-purple-950", accent: "text-violet-300" },
  { label: "Cyan/Emerald", value: "from-cyan-950 via-teal-900 to-emerald-950",    accent: "text-cyan-200" },
];

function SectionCard({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-border/50 bg-card shadow-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 text-left hover:bg-secondary/20 transition-colors"
      >
        <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 sm:px-7 pb-6 sm:pb-7 space-y-5">{children}</div>}
    </div>
  );
}

function SaveRow({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="pt-2 flex justify-end">
      <button
        onClick={onSave}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all"
      >
        <Save className="w-3.5 h-3.5" />
        {saved ? "Saved!" : "Save Changes"}
      </button>
    </div>
  );
}

function useSaved() {
  const [saved, setSaved] = useState(false);
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  return { saved, flash };
}

export default function Admin() {
  const [authed, setAuthed] = useState(isAdminAuthed());

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return <AdminPanel onLogout={() => { setAdminAuthed(false); setAuthed(false); }} />;
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="back-to-portfolio">
            <ArrowLeft className="w-4 h-4" />Back to Portfolio
          </Link>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-red-400 transition-colors"
            data-testid="logout-button"
          >
            <LogOut className="w-3.5 h-3.5" />Log out
          </button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary mb-1">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">All changes are saved to this browser. Click Save on each section.</p>
        </div>

        <HeroSection />
        <ProfilePicSection />
        <AboutSection />
        <ReelSection />
        <WorksSection />
        <CommissionsSection />
        <ContactSection />
        <SkillsSection />
        <ExperienceSection />
        <PasswordSection />
      </div>
    </div>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────────── */
function HeroSection() {
  const [data, setData] = useState<HeroData>(() => load(KEYS.HERO, DEFAULTS.HERO));
  const { saved, flash } = useSaved();
  const handleSave = () => { save(KEYS.HERO, data); flash(); };
  return (
    <SectionCard title="Hero">
      <label className="block">
        <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Name</span>
        <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })}
          className="field" placeholder="Your name" data-testid="hero-name" />
      </label>
      <label className="block">
        <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Subtitle</span>
        <input value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })}
          className="field" placeholder="e.g. Concept Artist & 2D Animator" data-testid="hero-subtitle" />
      </label>
      <label className="block">
        <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Tagline</span>
        <input value={data.tagline} onChange={(e) => setData({ ...data, tagline: e.target.value })}
          className="field" placeholder="e.g. Portfolio · 2025" data-testid="hero-tagline" />
      </label>
      <SaveRow onSave={handleSave} saved={saved} />
    </SectionCard>
  );
}

/* ─── Profile Pic ───────────────────────────────────────────────────── */
function ProfilePicSection() {
  const [profilePicPath, setProfilePicPath] = useState<string | null>(() => load<string | null>(KEYS.PROFILE_PIC, null) ?? localStorage.getItem(KEYS.PROFILE_PIC));
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, error, progress } = useUpload({
    onSuccess: (response) => {
      save(KEYS.PROFILE_PIC, response.objectPath);
      setProfilePicPath(response.objectPath);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    },
  });
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
    setUploadSuccess(false);
    await uploadFile(file);
  };
  const profileImageSrc = profilePicPath ? `/api/storage${profilePicPath}` : null;
  return (
    <SectionCard title="Profile Picture">
      <p className="text-sm text-muted-foreground -mt-1">Appears in the About section of your portfolio.</p>
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-start">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl border-2 border-dashed border-border/60 bg-secondary/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-colors flex-shrink-0"
          onClick={() => fileInputRef.current?.click()} data-testid="profile-pic-preview">
          {previewUrl || profileImageSrc
            ? <img src={previewUrl ?? profileImageSrc!} alt="Preview" className="w-full h-full object-cover" />
            : <div className="flex flex-col items-center gap-1.5 text-muted-foreground"><Image className="w-6 h-6 opacity-40" /><span className="text-xs opacity-50">No photo</span></div>}
        </div>
        <div className="flex-1 space-y-3 w-full">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} data-testid="profile-pic-input" />
          <button onClick={() => fileInputRef.current?.click()} disabled={isUploading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
            data-testid="upload-button">
            <Upload className="w-4 h-4" />{isUploading ? "Uploading..." : "Choose Photo"}
          </button>
          {isUploading && <div className="space-y-1"><div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} /></div><p className="text-xs text-muted-foreground">{progress}% uploaded</p></div>}
          {uploadSuccess && <div className="flex items-center gap-2 text-sm text-emerald-400" data-testid="upload-success"><CheckCircle className="w-4 h-4" />Updated successfully.</div>}
          {error && <div className="flex items-center gap-2 text-sm text-red-400" data-testid="upload-error"><AlertCircle className="w-4 h-4" />{error.message}</div>}
          <p className="text-xs text-muted-foreground/40">JPG, PNG, WebP — max 5MB</p>
        </div>
      </div>
    </SectionCard>
  );
}

/* ─── About ─────────────────────────────────────────────────────────── */
function AboutSection() {
  const [data, setData] = useState<AboutData>(() => load(KEYS.ABOUT, DEFAULTS.ABOUT));
  const { saved, flash } = useSaved();
  const handleSave = () => { save(KEYS.ABOUT, data); flash(); };
  return (
    <SectionCard title="About Me">
      <label className="block">
        <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Bio — Paragraph 1</span>
        <textarea value={data.bio1} onChange={(e) => setData({ ...data, bio1: e.target.value })}
          rows={3} className="field resize-none" data-testid="about-bio1" />
      </label>
      <label className="block">
        <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Bio — Paragraph 2</span>
        <textarea value={data.bio2} onChange={(e) => setData({ ...data, bio2: e.target.value })}
          rows={3} className="field resize-none" data-testid="about-bio2" />
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Gender</span>
          <input value={data.gender} onChange={(e) => setData({ ...data, gender: e.target.value })} className="field" />
        </label>
        <label className="block">
          <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Date of Birth</span>
          <input value={data.dob} onChange={(e) => setData({ ...data, dob: e.target.value })} className="field" placeholder="DD.MM.YYYY" />
        </label>
        <label className="block">
          <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Location</span>
          <input value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} className="field" />
        </label>
      </div>
      <SaveRow onSave={handleSave} saved={saved} />
    </SectionCard>
  );
}

/* ─── Reel ──────────────────────────────────────────────────────────── */
function ReelSection() {
  const [url, setUrl] = useState(() => load<string>(KEYS.REEL_URL, DEFAULTS.REEL_URL));
  const { saved, flash } = useSaved();
  const handleSave = () => { save(KEYS.REEL_URL, url); flash(); };
  return (
    <SectionCard title="Show Reel">
      <p className="text-sm text-muted-foreground -mt-1">Paste a YouTube embed URL. Leave blank to show the placeholder.</p>
      <label className="block">
        <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">YouTube Embed URL</span>
        <input value={url} onChange={(e) => setUrl(e.target.value)}
          className="field" placeholder="https://www.youtube.com/embed/VIDEO_ID" data-testid="reel-url" />
      </label>
      {url && (
        <div className="aspect-video rounded-xl overflow-hidden border border-border/30">
          <iframe src={url} className="w-full h-full" title="Show Reel Preview" allowFullScreen />
        </div>
      )}
      <SaveRow onSave={handleSave} saved={saved} />
    </SectionCard>
  );
}

/* ─── Works ─────────────────────────────────────────────────────────── */
function WorksSection() {
  const [works, setWorks] = useState<WorkItem[]>(() => load(KEYS.WORKS, DEFAULTS.WORKS));
  const { saved, flash } = useSaved();
  const update = (id: string, field: keyof WorkItem, value: string) => {
    setWorks((prev) => prev.map((w) => {
      if (w.id !== id) return w;
      if (field === "gradient") {
        const g = GRADIENTS.find((g) => g.value === value);
        return { ...w, gradient: value, accent: g?.accent ?? w.accent };
      }
      return { ...w, [field]: value };
    }));
  };
  const addWork = () => setWorks((prev) => [...prev, { id: Date.now().toString(), title: "New Work", type: "Concept Art", gradient: GRADIENTS[0].value, accent: GRADIENTS[0].accent }]);
  const removeWork = (id: string) => setWorks((prev) => prev.filter((w) => w.id !== id));
  const handleSave = () => { save(KEYS.WORKS, works); flash(); };
  return (
    <SectionCard title="Selected Works" defaultOpen={false}>
      <div className="space-y-4">
        {works.map((work, i) => (
          <div key={work.id} className="p-4 rounded-xl border border-border/30 bg-secondary/10 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground font-mono">Work #{i + 1}</span>
              <button onClick={() => removeWork(work.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground/40 hover:text-red-400 hover:bg-red-400/10 transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-muted-foreground mb-1 block">Title</span>
                <input value={work.title} onChange={(e) => update(work.id, "title", e.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="text-xs text-muted-foreground mb-1 block">Type</span>
                <input value={work.type} onChange={(e) => update(work.id, "type", e.target.value)} className="field" placeholder="e.g. Character Design" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs text-muted-foreground mb-1 block">Colour Theme</span>
              <select value={work.gradient} onChange={(e) => update(work.id, "gradient", e.target.value)} className="field text-muted-foreground">
                {GRADIENTS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </label>
          </div>
        ))}
      </div>
      <button onClick={addWork} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm hover:bg-primary/20 transition-all">
        <Plus className="w-4 h-4" />Add Work
      </button>
      <SaveRow onSave={handleSave} saved={saved} />
    </SectionCard>
  );
}

/* ─── Commissions ───────────────────────────────────────────────────── */
function CommissionsSection() {
  const [tiers, setTiers] = useState<CommissionTier[]>(() => load(KEYS.COMMISSIONS, DEFAULTS.COMMISSIONS));
  const { saved, flash } = useSaved();
  const update = (id: string, field: keyof CommissionTier, value: unknown) =>
    setTiers((prev) => prev.map((t) => t.id === id ? { ...t, [field]: value } : t));
  const updateFeature = (id: string, fi: number, val: string) =>
    setTiers((prev) => prev.map((t) => t.id === id ? { ...t, features: t.features.map((f, i) => i === fi ? val : f) } : t));
  const addFeature = (id: string) =>
    setTiers((prev) => prev.map((t) => t.id === id ? { ...t, features: [...t.features, ""] } : t));
  const removeFeature = (id: string, fi: number) =>
    setTiers((prev) => prev.map((t) => t.id === id ? { ...t, features: t.features.filter((_, i) => i !== fi) } : t));
  const handleSave = () => { save(KEYS.COMMISSIONS, tiers); flash(); };
  return (
    <SectionCard title="Commissions" defaultOpen={false}>
      <div className="space-y-5">
        {tiers.map((tier) => (
          <div key={tier.id} className="p-4 sm:p-5 rounded-xl border border-border/30 bg-secondary/10 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <input value={tier.title} onChange={(e) => update(tier.id, "title", e.target.value)}
                className="flex-1 bg-transparent font-semibold text-sm focus:outline-none focus:text-primary transition-colors" />
              <label className="flex items-center gap-2 text-xs cursor-pointer shrink-0">
                <span className={tier.open ? "text-emerald-400" : "text-amber-400"}>{tier.open ? "Open" : "Waitlist"}</span>
                <div onClick={() => update(tier.id, "open", !tier.open)}
                  className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${tier.open ? "bg-emerald-500/60" : "bg-amber-500/30"}`}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${tier.open ? "translate-x-4" : ""}`} />
                </div>
              </label>
            </div>
            <textarea value={tier.description} onChange={(e) => update(tier.id, "description", e.target.value)}
              rows={2} className="field resize-none text-sm" placeholder="Description" />
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Features</span>
              {tier.features.map((f, fi) => (
                <div key={fi} className="flex items-center gap-2">
                  <input value={f} onChange={(e) => updateFeature(tier.id, fi, e.target.value)} className="field flex-1 text-sm" />
                  <button onClick={() => removeFeature(tier.id, fi)} className="w-7 h-7 flex items-center justify-center text-muted-foreground/40 hover:text-red-400 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button onClick={() => addFeature(tier.id)} className="text-xs text-primary/60 hover:text-primary transition-colors flex items-center gap-1">
                <Plus className="w-3 h-3" />Add feature
              </button>
            </div>
            <label className="block">
              <span className="text-xs text-muted-foreground mb-1 block">Price</span>
              <input value={tier.price} onChange={(e) => update(tier.id, "price", e.target.value)} className="field text-sm" placeholder="e.g. From 300,000 VND" />
            </label>
          </div>
        ))}
      </div>
      <SaveRow onSave={handleSave} saved={saved} />
    </SectionCard>
  );
}

/* ─── Contact ───────────────────────────────────────────────────────── */
function ContactSection() {
  const [data, setData] = useState<ContactData>(() => load(KEYS.CONTACT, DEFAULTS.CONTACT));
  const { saved, flash } = useSaved();
  const handleSave = () => { save(KEYS.CONTACT, data); flash(); };
  return (
    <SectionCard title="Contact Info">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Email</span>
          <input value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className="field" type="email" data-testid="contact-email" />
        </label>
        <label className="block">
          <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Phone</span>
          <input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} className="field" type="tel" data-testid="contact-phone" />
        </label>
        <label className="block">
          <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Facebook URL</span>
          <input value={data.facebook} onChange={(e) => setData({ ...data, facebook: e.target.value })} className="field" data-testid="contact-facebook" />
        </label>
        <label className="block">
          <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Instagram URL</span>
          <input value={data.instagram} onChange={(e) => setData({ ...data, instagram: e.target.value })} className="field" data-testid="contact-instagram" />
        </label>
      </div>
      <SaveRow onSave={handleSave} saved={saved} />
    </SectionCard>
  );
}

/* ─── Skills ────────────────────────────────────────────────────────── */
function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>(() => load(KEYS.SKILLS, DEFAULTS.SKILLS));
  const [newName, setNewName] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newCategory, setNewCategory] = useState("Design");
  const [addError, setAddError] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const { saved, flash } = useSaved();

  const handleEditSkill = useCallback((id: string, field: keyof Skill, value: string) => {
    setSkills((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
  }, []);

  const handleAddSkill = () => {
    const trimmed = newName.trim();
    if (!trimmed) { setAddError("Please enter a skill name."); return; }
    if (skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) { setAddError("Already exists."); return; }
    setSkills((prev) => [...prev, { id: Date.now().toString(), name: trimmed, label: newLabel.trim() || trimmed.slice(0, 2), category: newCategory }]);
    setNewName(""); setNewLabel(""); setNewCategory("Design"); setAddError("");
  };

  const handleDragEnd = () => {
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      const r = [...skills]; const [m] = r.splice(dragIndex, 1); r.splice(dragOverIndex, 0, m); setSkills(r);
    }
    setDragIndex(null); setDragOverIndex(null);
  };

  const handleSave = () => { save(KEYS.SKILLS, skills); flash(); };

  return (
    <SectionCard title="Skills & Tools" defaultOpen={false}>
      <div className="space-y-2">
        {skills.length === 0 && <p className="text-sm text-center text-muted-foreground py-4 border border-dashed border-border/40 rounded-xl">No skills yet.</p>}
        {skills.map((skill, index) => (
          <div key={skill.id} draggable onDragStart={() => setDragIndex(index)} onDragEnter={() => setDragOverIndex(index)}
            onDragEnd={handleDragEnd} onDragOver={(e) => e.preventDefault()}
            className={`flex items-center gap-2 sm:gap-3 p-2.5 rounded-xl border bg-secondary/20 transition-all ${dragOverIndex === index && dragIndex !== index ? "border-primary/50 bg-primary/5" : "border-border/30"}`}>
            <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab shrink-0" />
            <input value={skill.name} onChange={(e) => handleEditSkill(skill.id, "name", e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-sm font-medium focus:outline-none focus:text-primary transition-colors" />
            <input value={skill.label} onChange={(e) => handleEditSkill(skill.id, "label", e.target.value.slice(0, 3))}
              className="w-10 bg-secondary/50 rounded-md text-xs text-center font-mono px-1 py-1 border border-border/30 focus:outline-none focus:border-primary/50 transition-colors" maxLength={3} />
            <select value={skill.category} onChange={(e) => handleEditSkill(skill.id, "category", e.target.value)}
              className="hidden sm:block bg-secondary/50 rounded-md text-xs px-2 py-1 border border-border/30 focus:outline-none text-muted-foreground">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button onClick={() => setSkills((p) => p.filter((s) => s.id !== skill.id))}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground/40 hover:text-red-400 hover:bg-red-400/10 transition-all">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-border/30 space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground/60">Add a skill</p>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input value={newName} onChange={(e) => { setNewName(e.target.value); setAddError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddSkill(); }}
              placeholder="e.g. Blender, Toon Boom..." className="field flex-1 min-w-0" />
            <input value={newLabel} onChange={(e) => setNewLabel(e.target.value.slice(0, 3))}
              placeholder="Lbl" maxLength={3} className="w-16 field text-center font-mono" />
          </div>
          <div className="flex gap-2">
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="field flex-1 text-muted-foreground">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button onClick={handleAddSkill} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all">
              <Plus className="w-4 h-4" />Add
            </button>
          </div>
        </div>
        {addError && <p className="text-xs text-red-400">{addError}</p>}
      </div>
      <SaveRow onSave={handleSave} saved={saved} />
    </SectionCard>
  );
}

/* ─── Experience ────────────────────────────────────────────────────── */
function ExperienceSection() {
  const [entries, setEntries] = useState<ExperienceEntry[]>(() => load(KEYS.EXPERIENCE, DEFAULTS.EXPERIENCE));
  const { saved, flash } = useSaved();
  const update = (id: string, field: keyof ExperienceEntry, value: unknown) =>
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, [field]: value } : e));
  const addEntry = () => setEntries((prev) => [...prev, { id: Date.now().toString(), period: "", role: "New Role", organization: "", detail: "", highlight: true }]);
  const removeEntry = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const handleSave = () => { save(KEYS.EXPERIENCE, entries); flash(); };
  return (
    <SectionCard title="Education & Experience" defaultOpen={false}>
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div key={entry.id} className="p-4 rounded-xl border border-border/30 bg-secondary/10 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground font-mono">Entry #{i + 1}</span>
              <button onClick={() => removeEntry(entry.id)} className="w-7 h-7 flex items-center justify-center text-muted-foreground/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-muted-foreground mb-1 block">Period</span>
                <input value={entry.period} onChange={(e) => update(entry.id, "period", e.target.value)} className="field" placeholder="2021 — 2025" />
              </label>
              <label className="block">
                <span className="text-xs text-muted-foreground mb-1 block">Role / Degree</span>
                <input value={entry.role} onChange={(e) => update(entry.id, "role", e.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="text-xs text-muted-foreground mb-1 block">Organization</span>
                <input value={entry.organization} onChange={(e) => update(entry.id, "organization", e.target.value)} className="field" />
              </label>
              <label className="block">
                <span className="text-xs text-muted-foreground mb-1 block">Detail</span>
                <input value={entry.detail} onChange={(e) => update(entry.id, "detail", e.target.value)} className="field" />
              </label>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={entry.highlight} onChange={(e) => update(entry.id, "highlight", e.target.checked)} className="accent-primary" />
              <span className="text-xs text-muted-foreground">Highlight (uses primary color for timeline dot)</span>
            </label>
          </div>
        ))}
      </div>
      <button onClick={addEntry} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm hover:bg-primary/20 transition-all">
        <Plus className="w-4 h-4" />Add Entry
      </button>
      <SaveRow onSave={handleSave} saved={saved} />
    </SectionCard>
  );
}

/* ─── Password ──────────────────────────────────────────────────────── */
function PasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleChange = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem(KEYS.ADMIN_PASSWORD) ?? "thao2025";
    if (current !== stored) { setMsg({ text: "Current password is incorrect.", type: "error" }); return; }
    if (next.length < 6) { setMsg({ text: "New password must be at least 6 characters.", type: "error" }); return; }
    if (next !== confirm) { setMsg({ text: "Passwords do not match.", type: "error" }); return; }
    localStorage.setItem(KEYS.ADMIN_PASSWORD, next);
    setMsg({ text: "Password updated successfully.", type: "success" });
    setCurrent(""); setNext(""); setConfirm("");
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <SectionCard title="Change Password" defaultOpen={false}>
      <form onSubmit={handleChange} className="space-y-4">
        <label className="block">
          <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Current Password</span>
          <div className="relative">
            <input type={showCurrent ? "text" : "password"} value={current} onChange={(e) => setCurrent(e.target.value)} className="field pr-10" />
            <button type="button" onClick={() => setShowCurrent((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </label>
        <label className="block">
          <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">New Password</span>
          <div className="relative">
            <input type={showNext ? "text" : "password"} value={next} onChange={(e) => setNext(e.target.value)} className="field pr-10" />
            <button type="button" onClick={() => setShowNext((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
              {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </label>
        <label className="block">
          <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 block">Confirm New Password</span>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="field" />
        </label>
        {msg && <p className={`text-sm ${msg.type === "success" ? "text-emerald-400" : "text-red-400"}`}>{msg.text}</p>}
        <div className="flex justify-end">
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all">
            <Lock className="w-3.5 h-3.5" />Update Password
          </button>
        </div>
      </form>
    </SectionCard>
  );
}
