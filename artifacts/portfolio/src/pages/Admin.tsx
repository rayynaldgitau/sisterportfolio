import { useState, useRef, useEffect } from "react";
import { useUpload } from "@workspace/object-storage-web";
import { Upload, CheckCircle, AlertCircle, ArrowLeft, Image } from "lucide-react";
import { Link } from "wouter";

const PROFILE_PIC_KEY = "portfolio_profile_pic_path";

export default function Admin() {
  const [profilePicPath, setProfilePicPath] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_PIC_KEY);
    if (saved) {
      setProfilePicPath(saved);
    }
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

  const profileImageSrc = profilePicPath
    ? `/api/storage${profilePicPath}`
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10" data-testid="back-to-portfolio">
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>

        <h1 className="text-3xl md:text-4xl font-serif text-primary mb-2">Admin Panel</h1>
        <p className="text-muted-foreground mb-10 text-sm">Manage your portfolio settings here.</p>

        <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-lg space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-1">Profile Picture</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Upload a profile photo that will appear in the About section of your portfolio.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div
                  className="w-36 h-36 rounded-2xl border-2 border-dashed border-border/60 bg-secondary/30 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="profile-pic-preview"
                >
                  {previewUrl || profileImageSrc ? (
                    <img
                      src={previewUrl ?? profileImageSrc!}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Image className="w-8 h-8 opacity-40" />
                      <span className="text-xs opacity-60">No photo yet</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  data-testid="profile-pic-input"
                />

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
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{progress}% uploaded</p>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="inline-flex items-center gap-2 text-sm text-emerald-400" data-testid="upload-success">
                    <CheckCircle className="w-4 h-4" />
                    Profile picture updated successfully.
                  </div>
                )}

                {error && (
                  <div className="inline-flex items-center gap-2 text-sm text-red-400" data-testid="upload-error">
                    <AlertCircle className="w-4 h-4" />
                    {error.message}
                  </div>
                )}

                {profilePicPath && !uploadSuccess && !error && (
                  <p className="text-xs text-muted-foreground">
                    A profile picture is currently set. Upload a new one to replace it.
                  </p>
                )}

                <p className="text-xs text-muted-foreground opacity-60">
                  Supported formats: JPG, PNG, WebP. Max recommended size: 5MB.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
