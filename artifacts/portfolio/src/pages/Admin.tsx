import { useState, useRef, useEffect, useCallback } from "react";
import { useUpload } from "@workspace/object-storage-web";
import { Upload, CheckCircle, AlertCircle, ArrowLeft, Image, Plus, X, GripVertical, Save } from "lucide-react";
import { Link } from "wouter";

const PROFILE_PIC_KEY = "portfolio_profile_pic_path";
export const SKILLS_KEY = "portfolio_skills";

export interface Skill {
  id: string;
  name: string;
  label: string;
  category: string;
}

export const DEFAULT_SKILLS: Skill[] = [
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

function saveSkills(skills: Skill[]) {
  localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
  window.dispatchEvent(new StorageEvent("storage", { key: SKILLS_KEY, newValue: JSON.stringify(skills) }));
}

const CATEGORIES = ["Design", "Illustration", "Animation", "3D", "Video", "Other"];

export default function Admin() {
  const [profilePicPath, setProfilePicPath] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [skillsSaved, setSkillsSaved] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newCategory, setNewCategory] = useState("Design");
  const [addError, setAddError] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_PIC_KEY);
    if (saved) setProfilePicPath(saved);
    setSkills(loadSkills());
  }, []);

  const { uploadFile, isUploading, error, progress } = useUpload({
    onSuccess: (response) => {
      localStorage.setItem(PROFILE_PIC_KEY, response.objectPath);
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

  const handleAddSkill = () => {
    const trimmed = newName.trim();
    if (!trimmed) { setAddError("Please enter a skill name."); return; }
    if (skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setAddError("That skill already exists."); return;
    }
    const label = newLabel.trim() || trimmed.slice(0, 2);
    const updated = [...skills, { id: Date.now().toString(), name: trimmed, label, category: newCategory }];
    setSkills(updated);
    setNewName("");
    setNewLabel("");
    setNewCategory("Design");
    setAddError("");
  };

  const handleRemoveSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEditSkill = useCallback((id: string, field: keyof Skill, value: string) => {
    setSkills((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
  }, []);

  const handleSaveSkills = () => {
    saveSkills(skills);
    setSkillsSaved(true);
    setTimeout(() => setSkillsSaved(false), 2500);
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragEnter = (index: number) => setDragOverIndex(index);
  const handleDragEnd = () => {
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      const reordered = [...skills];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(dragOverIndex, 0, moved);
      setSkills(reordered);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const profileImageSrc = profilePicPath ? `/api/storage${profilePicPath}` : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6 md:space-y-8">

        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="back-to-portfolio">
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>

        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-primary mb-1">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">Manage your portfolio settings.</p>
        </div>

        {/* Profile Picture */}
        <div className="rounded-2xl border border-border/50 bg-card p-5 sm:p-7 shadow-lg space-y-5 sm:space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-0.5">Profile Picture</h2>
            <p className="text-sm text-muted-foreground">Appears in the About section.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-start">
            <div className="flex-shrink-0">
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl border-2 border-dashed border-border/60 bg-secondary/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                data-testid="profile-pic-preview"
              >
                {previewUrl || profileImageSrc ? (
                  <img src={previewUrl ?? profileImageSrc!} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                    <Image className="w-6 h-6 sm:w-7 sm:h-7 opacity-40" />
                    <span className="text-xs opacity-50">No photo yet</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} data-testid="profile-pic-input" />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                data-testid="upload-button"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? "Uploading..." : "Choose Photo"}
              </button>

              {isUploading && (
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">{progress}% uploaded</p>
                </div>
              )}
              {uploadSuccess && (
                <div className="inline-flex items-center gap-2 text-sm text-emerald-400" data-testid="upload-success">
                  <CheckCircle className="w-4 h-4" />Profile picture updated.
                </div>
              )}
              {error && (
                <div className="inline-flex items-center gap-2 text-sm text-red-400" data-testid="upload-error">
                  <AlertCircle className="w-4 h-4" />{error.message}
                </div>
              )}
              <p className="text-xs text-muted-foreground opacity-50">JPG, PNG, WebP — max 5MB</p>
            </div>
          </div>
        </div>

        {/* Skills & Tools Editor */}
        <div className="rounded-2xl border border-border/50 bg-card p-5 sm:p-7 shadow-lg space-y-5 sm:space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-0.5">Skills & Tools</h2>
              <p className="text-sm text-muted-foreground">Drag to reorder. Appears in the Toolkit section.</p>
            </div>
            <button
              onClick={handleSaveSkills}
              className="shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all"
              data-testid="save-skills-button"
            >
              <Save className="w-3.5 h-3.5" />
              {skillsSaved ? "Saved!" : "Save"}
            </button>
          </div>

          {/* Skill List */}
          <div className="space-y-2" data-testid="skills-list">
            {skills.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border/40 rounded-xl">
                No skills yet. Add one below.
              </p>
            )}
            {skills.map((skill, index) => (
              <div
                key={skill.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border bg-secondary/20 transition-all ${
                  dragOverIndex === index && dragIndex !== index ? "border-primary/50 bg-primary/5" : "border-border/30"
                }`}
                data-testid={`skill-row-${index}`}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab shrink-0" />

                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => handleEditSkill(skill.id, "name", e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-sm font-medium focus:outline-none focus:text-primary transition-colors"
                  placeholder="Skill name"
                  data-testid={`skill-name-${index}`}
                />

                <input
                  type="text"
                  value={skill.label}
                  onChange={(e) => handleEditSkill(skill.id, "label", e.target.value.slice(0, 3))}
                  className="w-9 sm:w-10 bg-secondary/50 rounded-md text-xs text-center font-mono px-1 py-1 border border-border/30 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Ab"
                  maxLength={3}
                  title="Short label shown on the card"
                  data-testid={`skill-label-${index}`}
                />

                <select
                  value={skill.category}
                  onChange={(e) => handleEditSkill(skill.id, "category", e.target.value)}
                  className="hidden sm:block bg-secondary/50 rounded-md text-xs px-2 py-1 border border-border/30 focus:outline-none focus:border-primary/50 transition-colors text-muted-foreground"
                  data-testid={`skill-category-${index}`}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                <button
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  data-testid={`skill-remove-${index}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Skill */}
          <div className="pt-4 border-t border-border/30 space-y-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground/60">Add a skill</p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => { setNewName(e.target.value); setAddError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddSkill(); }}
                  placeholder="e.g. Blender, Toon Boom..."
                  className="flex-1 min-w-0 bg-secondary/30 border border-border/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
                  data-testid="new-skill-name"
                />
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value.slice(0, 3))}
                  placeholder="Lbl"
                  maxLength={3}
                  title="Short abbreviation (auto-generated if empty)"
                  className="w-16 bg-secondary/30 border border-border/40 rounded-xl px-2 py-2.5 text-sm text-center font-mono focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/40"
                  data-testid="new-skill-label"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 bg-secondary/30 border border-border/40 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors text-muted-foreground"
                  data-testid="new-skill-category"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                  onClick={handleAddSkill}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-all"
                  data-testid="add-skill-button"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
            {addError && <p className="text-xs text-red-400" data-testid="add-skill-error">{addError}</p>}
            <p className="text-xs text-muted-foreground/40">Press Enter or click Add. Hit Save to apply changes to the portfolio.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
