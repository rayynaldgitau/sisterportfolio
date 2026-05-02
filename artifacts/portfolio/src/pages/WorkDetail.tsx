import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, X, BookOpen, Search, Palette, LayoutGrid, PenLine,
} from "lucide-react";
import {
  load, KEYS, DEFAULTS, getWorkSections, SECTION_ORDER,
  type WorkItem, type WorkSectionType,
} from "../lib/storage";

const SECTION_META: Record<
  WorkSectionType,
  { label: string; icon: typeof BookOpen; empty: string }
> = {
  storyboard: {
    label: "Storyboard",
    icon: BookOpen,
    empty: "No storyboard panels have been added yet.",
  },
  research: {
    label: "Research",
    icon: Search,
    empty: "No research materials have been added yet.",
  },
  visuals: {
    label: "Visual Representations",
    icon: Palette,
    empty: "No visual artwork has been added yet.",
  },
  thumbnails: {
    label: "Thumbnails",
    icon: LayoutGrid,
    empty: "No thumbnail sketches have been added yet.",
  },
  layout: {
    label: "Layout & Design",
    icon: PenLine,
    empty: "No layout studies have been added yet.",
  },
};

export default function WorkDetail() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<WorkSectionType>("storyboard");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const works = load<WorkItem[]>(KEYS.WORKS, DEFAULTS.WORKS);
  const work = works.find((w) => w.id === params.id);

  if (!work) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Project not found.</p>
          <Link href="/" className="text-primary hover:underline text-sm">
            ← Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  const sections = getWorkSections(work);
  const activeSection = sections.find((s) => s.type === activeTab)!;
  const coverUrl = work.imageObjectPath ? `/api/storage${work.imageObjectPath}` : null;
  const Meta = SECTION_META[activeTab];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div
        className={`relative w-full h-72 sm:h-96 overflow-hidden ${
          !coverUrl ? `bg-gradient-to-br ${work.gradient}` : "bg-black"
        }`}
      >
        {coverUrl && (
          <img
            src={coverUrl}
            alt={work.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(0,180,180,0.08)_0%,transparent_60%)] pointer-events-none" />

        {/* Back button */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-xs text-white/80 hover:text-white hover:bg-black/60 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Works
          </Link>
        </div>

        {/* Title block */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-xs uppercase tracking-[0.35em] mb-2 ${work.accent} opacity-70`}
          >
            {work.type}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-5xl font-serif text-white leading-tight mb-3"
          >
            {work.title}
          </motion.h1>
          {work.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base text-white/55 max-w-2xl leading-relaxed"
            >
              {work.description}
            </motion.p>
          )}
        </div>
      </div>

      {/* ── Tab bar ───────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-2 sm:px-8 max-w-6xl">
          <div className="flex overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {SECTION_ORDER.map((type) => {
              const m = SECTION_META[type];
              const Icon = m.icon;
              const sec = sections.find((s) => s.type === type)!;
              const hasContent = Boolean(sec.description || sec.images.length);
              return (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`relative shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3.5 text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === type
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{m.label}</span>
                  <span className="sm:hidden">{m.label.split(" ")[0]}</span>
                  {hasContent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                  )}
                  {activeTab === type && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Section content ───────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-8 max-w-6xl py-10 sm:py-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
              <Meta.icon className={`w-5 h-5 ${work.accent}`} />
              <h2 className="text-xl sm:text-2xl font-serif text-foreground">
                {Meta.label}
              </h2>
            </div>

            {/* Description */}
            {activeSection.description && (
              <p className="text-muted-foreground mb-8 max-w-3xl leading-relaxed text-sm sm:text-base">
                {activeSection.description}
              </p>
            )}

            {/* Image grid */}
            {activeSection.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeSection.images.map((path, i) => (
                  <motion.button
                    key={path}
                    type="button"
                    onClick={() => setLightbox(`/api/storage${path}`)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative rounded-xl overflow-hidden border border-border/30 bg-card aspect-video group focus:outline-none"
                  >
                    <img
                      src={`/api/storage${path}`}
                      alt={`${work.title} ${Meta.label} ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <span className="text-white/0 group-hover:text-white/80 text-xs uppercase tracking-widest transition-all duration-300">
                        View full
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/25 py-24 text-center">
                <Meta.icon className="w-10 h-10 text-muted-foreground/15 mb-3" />
                <p className="text-muted-foreground/35 text-sm">{Meta.empty}</p>
                <p className="text-muted-foreground/20 text-xs mt-1.5">
                  Add images from the admin panel.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Lightbox ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox}
              alt="Full view"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-full max-h-full rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
