import { useEffect, useRef, useState } from "react";
import "./App.css";
import { supabase, isSupabaseConfigured } from "./supabaseClient.js";

const languages = ["HTML","CSS","JS","React","PHP","Node","SQL","Python","Next","Docker","Git","Java"];

function WavySpinner() {
  return (
    <svg
      className="wavy-spin"
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="
          M45 8
          C49 5, 54 6, 57 9
          C60 12, 62 10, 65 11
          C70 13, 72 18, 71 23
          C70 27, 73 30, 73 34
          C73 39, 70 43, 67 45
          C64 47, 65 51, 63 54
          C60 59, 55 61, 50 60
          C46 59, 44 62, 40 62
          C35 62, 31 59, 29 55
          C27 51, 23 51, 21 47
          C18 42, 19 37, 22 33
          C24 29, 21 25, 23 21
          C25 16, 30 13, 35 13
          C38 13, 40 10, 45 8
          Z
        "
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="200 40"
        strokeDashoffset="0"
      />
    </svg>
  );
}

function FloatingLanguages() {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const balls = Array.from(container.children);
    let width = window.innerWidth; let height = window.innerHeight;
    itemsRef.current = balls.map((element, index) => {
      const rect = element.getBoundingClientRect();
      const size = rect.width || 75 + Math.random() * 25;
      return { element, x: Math.random() * Math.max(0, width - size), y: Math.random() * Math.max(0, height - size), vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.7, size, phase: index * 0.8 };
    });
    const handleMouseMove = (e) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    const handleMouseLeave = () => { mouseRef.current.x = -1000; mouseRef.current.y = -1000; };
    const handleResize = () => { width = window.innerWidth; height = window.innerHeight; };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);
    let animationFrame;
    const animate = () => {
      const mouse = mouseRef.current;
      itemsRef.current.forEach((ball) => {
        const centerX = ball.x + ball.size / 2; const centerY = ball.y + ball.size / 2;
        const dx = centerX - mouse.x; const dy = centerY - mouse.y;
        const distance = Math.sqrt(dx*dx+dy*dy);
        const repelDistance = 180;
        if (distance < repelDistance && distance > 0) {
          const force = (repelDistance - distance)/repelDistance;
          ball.vx += (dx/distance)*force*0.08;
          ball.vy += (dy/distance)*force*0.08;
        }
        const maxSpeed = 1.4; const speed = Math.sqrt(ball.vx*ball.vx+ball.vy*ball.vy);
        if (speed > maxSpeed) { ball.vx = (ball.vx/speed)*maxSpeed; ball.vy = (ball.vy/speed)*maxSpeed; }
        ball.x += ball.vx; ball.y += ball.vy;
        if (ball.x <= 0) { ball.x = 0; ball.vx *= -1; }
        if (ball.x + ball.size >= width) { ball.x = width - ball.size; ball.vx *= -1; }
        if (ball.y <= 0) { ball.y = 0; ball.vy *= -1; }
        if (ball.y + ball.size >= height) { ball.y = height - ball.size; ball.vy *= -1; }
        const rotation = Math.sin(Date.now()*0.001+ball.phase)*8;
        ball.element.style.transform = `translate3d(${ball.x}px, ${ball.y}px, 0) rotate(${rotation}deg)`;
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animationFrame); window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseleave", handleMouseLeave); window.removeEventListener("resize", handleResize); };
  }, []);
  return (
    <div className="floating-languages" ref={containerRef} aria-hidden="true">
      {languages.map((language, index) => (
        <div className="language-ball" key={language} style={{ "--delay": `${index * 0.3}s` }}><span>{language}</span></div>
      ))}
    </div>
  );
}

function VideoSticker() {
  return (
    <div className="about-video">
      <div className="video-sticker">
        <div className="video-frame">
          <img src="/sticker.jpg" alt="Lealene graduation sticker" className="sticker-image" />
          <div className="video-glow"></div>
        </div>
        <div className="video-label"><span>GRADUATION</span><span>2026</span></div>
        <div className="resume-actions">
          <a href="/resume.pdf" target="_blank" rel="noreferrer" className="resume-btn view">
            <span className="resume-icon">◯</span> View Resume
          </a>
          <a href="/resume.pdf" download="Lealene_Fajardo_Resume.pdf" className="resume-btn download">
            <span className="resume-icon">↓</span> Download
          </a>
        </div>
        <p className="resume-hint">PDF • 64 KB — opens in new tab or saves to device</p>
      </div>
    </div>
  );
}

/* =========================================
   PROJECT DATA — Supabase backed
   DEFAULT_PROJECTS = fallback when Supabase empty/unreachable
   (do NOT auto-seed to avoid duplicates; see supabase/schema.sql)
========================================= */
const PLACEHOLDER_BY_TITLE = {
  "POS & Inventory": "/pos-inventory.svg",
  "Real Estate Platform": "/real-estate.svg",
  "Minimalist Login & Sign-Up Web Page": "/login-system.svg",
};
const FALLBACK_IMAGE = "/pos-inventory.svg";
function getProjectPlaceholder(title) {
  return PLACEHOLDER_BY_TITLE[title] || FALLBACK_IMAGE;
}
const DEFAULT_PROJECTS = [
  {
    id: "1",
    number: "01 / WEB APPLICATION",
    title: "POS & Inventory",
    description: "A point-of-sale and inventory management system designed to manage products, transactions, and stock.",
    image: "/pos-inventory.svg",
    media: [
      { type: "image", src: "/pos-inventory.svg" },
      { type: "image", src: "/pos-inventory.svg" },
      { type: "image", src: "/pos-inventory.svg" },
    ],
    link: "https://example.com",
  },
  {
    id: "2",
    number: "02 / FULL STACK",
    title: "Real Estate Platform",
    description: "A modern property platform built with a frontend application and CMS architecture.",
    image: "/real-estate.svg",
    media: [
      { type: "image", src: "/real-estate.svg" },
      { type: "image", src: "/real-estate.svg" },
      { type: "image", src: "/real-estate.svg" },
    ],
    link: "https://example.com",
  },
  {
    id: "3",
    number: "03 / WEB DEVELOPMENT",
    title: "Minimalist Login & Sign-Up Web Page",
    description: "A clean and modern authentication interface designed with a minimalist black-and-white aesthetic. The original UI concept was designed by me in Canva, and I developed the design into a functional web page using AI-assisted coding tools.",
    image: "/login-system.svg",
    media: [
      { type: "image", src: "/login-system.svg" },
      { type: "image", src: "/login-system.svg" },
      { type: "image", src: "/login-system.svg" },
    ],
    link: "#",
  },
];

function normalizeProject(p) {
  const placeholder = getProjectPlaceholder(p.title);
  let image = p.image && p.image.trim() ? p.image : placeholder;
  if (image === "/pos-inventory.jpg") image = "/pos-inventory.svg";
  if (image === "/real-estate.jpg") image = "/real-estate.svg";
  if (image === "/login-system.jpg") image = "/login-system.svg";
  let media = Array.isArray(p.media) && p.media.length ? p.media : [{ type: "image", src: image }];
  media = media
    .filter((m) => m && m.src)
    .map((m) => {
      let src = m.src;
      if (src === "/pos-inventory.jpg" || src === "/pos-inventory-2.jpg" || src === "/pos-inventory-3.jpg") src = "/pos-inventory.svg";
      if (src === "/real-estate.jpg" || src === "/real-estate-2.jpg" || src === "/real-estate-3.jpg") src = "/real-estate.svg";
      if (src === "/login-system.jpg" || src === "/login-system-2.jpg" || src === "/login-system-3.jpg") src = "/login-system.svg";
      if (m.type === "video" && src.includes("demo.mp4")) return { type: "image", src: placeholder };
      return { ...m, src };
    });
  if (!media.length) media = [{ type: "image", src: placeholder }];
  return { ...p, image, media };
}

/* =========================================
   Supabase helpers
========================================= */
function mapRowToProject(row) {
  return {
    id: row.id,
    number: row.number || "",
    title: row.title,
    description: row.description || "",
    category: row.category || "",
    image: row.image || getProjectPlaceholder(row.title),
    media: Array.isArray(row.media) && row.media.length ? row.media : [{ type: "image", src: row.image || getProjectPlaceholder(row.title) }],
    link: row.link || "#",
    created_at: row.created_at,
  };
}

function toRowPayload(project) {
  return {
    number: project.number || "",
    title: project.title,
    description: project.description || "",
    category: project.category || "",
    image: project.image || "",
    media: project.media || [{ type: "image", src: project.image || "" }],
    link: project.link || "#",
  };
}

async function uploadImageFile(file) {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase not configured");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const ext = safeName.includes(".") ? safeName.split(".").pop() : "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("project-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || `image/${ext}`,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("project-images").getPublicUrl(path);
  return data.publicUrl;
}

function extractStoragePath(url) {
  if (!url || typeof url !== "string") return null;
  // Expected: https://<ref>.supabase.co/storage/v1/object/public/project-images/<path>
  const marker = "/project-images/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length).split("?")[0];
}

async function deleteStorageByUrl(url) {
  const path = extractStoragePath(url);
  if (!path) return;
  try {
    await supabase.storage.from("project-images").remove([path]);
  } catch (e) {
    console.warn("[Supabase] failed to delete storage object", path, e);
  }
}

function useSupabaseProjects() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: true });
        if (fetchError) throw fetchError;
        if (cancelled) return;
        if (data && data.length > 0) {
          setProjects(data.map(mapRowToProject).map(normalizeProject));
        } else {
          // No rows yet — keep DEFAULT_PROJECTS as fallback display.
          // Seed via supabase/schema.sql if you want them persisted.
          setProjects(DEFAULT_PROJECTS);
        }
        setError(null);
      } catch (e) {
        console.error("[Supabase] load projects failed, showing fallback", e);
        if (!cancelled) setError(e.message || "Failed to load projects");
        // keep DEFAULT_PROJECTS visible so page is not blank
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const addProject = async (payload) => {
    if (!isSupabaseConfigured || !supabase) {
      console.warn("[Supabase] not configured — adding project locally only");
      const local = { ...payload, id: Date.now().toString() };
      setProjects((prev) => [...prev, normalizeProject(local)]);
      return local;
    }
    const row = toRowPayload(payload);
    const { data, error: err } = await supabase.from("projects").insert(row).select().single();
    if (err) throw err;
    const created = normalizeProject(mapRowToProject(data));
    setProjects((prev) => (prev.some((p) => p.id === created.id) ? prev : [...prev, created]));
    return created;
  };

  const updateProject = async (id, payload) => {
    if (!isSupabaseConfigured || !supabase) {
      setProjects((prev) => prev.map((p) => (p.id === id ? normalizeProject({ ...p, ...payload, id }) : p)));
      return;
    }
    // Don't send id in update payload
    const row = toRowPayload(payload);
    const { data, error: err } = await supabase.from("projects").update(row).eq("id", id).select().single();
    if (err) throw err;
    const updated = normalizeProject(mapRowToProject(data));
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const deleteProject = async (id) => {
    const target = projects.find((p) => p.id === id);
    if (!isSupabaseConfigured || !supabase) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    const { error: err } = await supabase.from("projects").delete().eq("id", id);
    if (err) throw err;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    // Best-effort delete images from storage
    if (target) {
      const urls = [target.image, ...(target.media || []).map((m) => m.src)].filter(Boolean);
      for (const u of [...new Set(urls)]) {
        // Only delete Supabase storage URLs, never local placeholders
        if (u.includes("supabase.co")) await deleteStorageByUrl(u);
      }
    }
  };

  // Local fallback setter (kept for reset-to-defaults button when not configured)
  const setProjectsLocal = (updater) => {
    setProjects((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      return Array.isArray(next) ? next.map(normalizeProject) : next;
    });
  };

  return { projects, setProjects: setProjectsLocal, loading, error, addProject, updateProject, deleteProject };
}

/* Shared placeholder component for every project image */
function ProjectImageFallback({ title, small }) {
  const initials = (title || "Project").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={small ? "project-image-fallback small" : "project-image-fallback"}>
      <span className="fallback-icon">◧</span>
      <span className="fallback-initials">{initials}</span>
      <span className="fallback-title">{title || "PROJECT"}</span>
    </div>
  );
}

function SafeImage({ src, alt, className, title, onClick, small }) {
  const [err, setErr] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [placeholderErr, setPlaceholderErr] = useState(false);
  useEffect(() => { setErr(false); setPlaceholderErr(false); setLoaded(false); }, [src]);
  const placeholder = title ? getProjectPlaceholder(title) : FALLBACK_IMAGE;
  const displaySrc = err || !src ? placeholder : src;
  if (placeholderErr) return <ProjectImageFallback title={title} small={small} />;
  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      style={loaded ? undefined : { background: "#0f1225" }}
      onError={() => {
        if (displaySrc === placeholder) setPlaceholderErr(true);
        else setErr(true);
      }}
      onLoad={() => setLoaded(true)}
      onClick={onClick}
    />
  );
}

/* =========================================
   PROJECT GALLERY / LIGHTBOX
========================================= */
function ProjectGallery({ project, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const media = project.media && project.media.length ? project.media : [{ type: "image", src: project.image || getProjectPlaceholder(project.title) }];
  const currentMedia = media[currentIndex] || { type: "image", src: getProjectPlaceholder(project.title) };
  const nextMedia = () => setCurrentIndex((prev) => (prev + 1) % media.length);
  const previousMedia = () => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  const [mediaError, setMediaError] = useState(false);
  useEffect(() => setMediaError(false), [currentIndex, currentMedia.src]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextMedia();
      if (e.key === "ArrowLeft") previousMedia();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div className="project-gallery-overlay" onClick={onClose}>
      <div className="project-gallery" onClick={(e) => e.stopPropagation()}>
        <button className="gallery-close" onClick={onClose} aria-label="Close gallery">×</button>
        <div className="gallery-content">
          {mediaError ? (
            <ProjectImageFallback title={project.title} />
          ) : currentMedia.type === "video" ? (
            <video src={currentMedia.src} controls autoPlay className="gallery-video" onError={() => setMediaError(true)} />
          ) : (
            <img src={currentMedia.src} alt={`${project.title} ${currentIndex + 1}`} className="gallery-image" onError={() => setMediaError(true)} />
          )}
        </div>
        {media.length > 1 && (
          <>
            <button className="gallery-arrow gallery-prev" onClick={previousMedia} aria-label="Previous media">←</button>
            <button className="gallery-arrow gallery-next" onClick={nextMedia} aria-label="Next media">→</button>
          </>
        )}
        <div className="gallery-info">
          <div>
            <span className="gallery-number">{String(currentIndex + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}</span>
            <h3>{project.title}</h3>
          </div>
          <span className="gallery-type">{currentMedia.type === "video" ? "VIDEO" : "IMAGE"}</span>
        </div>
        {media.length > 1 && (
          <div className="gallery-dots">
            {media.map((item, index) => (
              <button key={index} className={index === currentIndex ? "gallery-dot active" : "gallery-dot"} onClick={() => setCurrentIndex(index)} aria-label={`View media ${index + 1}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================
   PROJECTS - PUBLIC (no admin link)
========================================= */
function Projects({ projects, loading, error }) {
  const [selectedProject, setSelectedProject] = useState(null);
  return (
    <section className="projects" id="projects">
      <div className="section-label">03 — Selected Work</div>
      <h2 className="section-title">PROJECTS</h2>
      {loading && <p style={{ marginTop: 20, opacity: 0.7, fontSize: 14 }}>Loading projects…</p>}
      {error && (
        <p style={{ marginTop: 12, color: "#ffb4a8", fontSize: 13, background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)", padding: "10px 14px", borderRadius: 8 }}>
          Could not load from Supabase ({error}) — showing fallback projects.
        </p>
      )}
      {!isSupabaseConfigured && (
        <p style={{ marginTop: 12, color: "#ffcc66", fontSize: 13, background: "rgba(255,200,80,0.08)", border: "1px solid rgba(255,200,80,0.3)", padding: "10px 14px", borderRadius: 8 }}>
          ⚠️ Supabase NOT connected — projects are in <b>local-only fallback</b> and will <b>NOT appear on other devices</b>. To fix: create a Supabase project, run <code>supabase/schema.sql</code>, then set <code>VITE_SUPABASE_URL</code> + <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env.local</code> (local) and Vercel → Settings → Environment Variables (deployed). See <code>.env.example</code>.
        </p>
      )}
      <div className="projects-grid">
        {projects.map((project) => (
          <article className="project" key={project.id || project.title}>
            <div
              className="project-image-wrapper"
              onClick={() => setSelectedProject(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") setSelectedProject(project); }}
            >
              <SafeImage src={project.image} alt={`${project.title} project`} className="project-image" title={project.title} />
              <div className="project-image-overlay"><span>VIEW PROJECT</span></div>
            </div>
            <span className="project-number">{project.number}</span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <a href={project.link} target="_blank" rel="noreferrer" className="project-link" onClick={(e) => e.stopPropagation()}>View Project →</a>
          </article>
        ))}
      </div>
      {selectedProject && <ProjectGallery project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </section>
  );
}

/* =========================================
   ADMIN - SECURED (separate route, login required)
========================================= */
const ADMIN_ROUTE = "#secret-admin";
const ADMIN_PASSWORD = "lealene2026";

function AdminLogin({ onSuccess }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("lealene_admin", "1");
      onSuccess();
    } else setErr("Wrong password.");
  };
  return (
    <section className="admin" id="admin">
      <div className="admin-header">
        <div><div className="section-label">ADMIN — LOGIN</div><h2 className="section-title">SECURE ACCESS</h2><p className="admin-subtitle">This area is private. Enter your admin password to manage projects. Public visitors never see this page.</p></div>
        <a href="#" className="admin-back">← Back to Portfolio</a>
      </div>
      <form className="admin-form" onSubmit={submit} style={{maxWidth:400}}>
        <label>Password<input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} placeholder="••••••••" autoFocus /></label>
        {err && <span style={{color:"#ff8a8a", fontSize:12}}>{err}</span>}
        <button type="submit" className="btn-primary">Unlock Admin</button>
        <span className="field-hint">Tip: change ADMIN_PASSWORD in App.jsx, then replace with Supabase Auth for real online security. Current route is <code>{ADMIN_ROUTE}</code> (not linked publicly).</span>
      </form>
    </section>
  );
}

// Kept for local fallback when Supabase env vars are missing — not used in Supabase mode
function compressImageFileFallback(file, maxW = 1600, maxH = 1600, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("image load failed"));
      img.onload = () => {
        let w = img.width, h = img.height;
        const ratio = Math.min(maxW / w, maxH / h, 1);
        w = Math.round(w * ratio); h = Math.round(h * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        const outType = file.type === "image/png" && quality >= 0.9 ? "image/png" : "image/jpeg";
        try { resolve(canvas.toDataURL(outType, quality)); } catch (e) { reject(e); }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function AdminPanel({ projects, setProjects, addProject, updateProject, deleteProject, onLogout }) {
  const [title, setTitle] = useState(""); const [number, setNumber] = useState(""); const [description, setDescription] = useState(""); const [link, setLink] = useState("");
  const [previews, setPreviews] = useState([]); // string[] — blob: URLs for new files, https URLs for existing
  const pendingFilesRef = useRef(new Map()); // previewUrl -> File
  const [editingId, setEditingId] = useState(null); const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false); const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef(null);

  const resetForm = () => {
    // Revoke blob URLs to avoid memory leak
    previews.forEach((p) => { if (p.startsWith("blob:")) try { URL.revokeObjectURL(p); } catch {} });
    pendingFilesRef.current.clear();
    setTitle(""); setNumber(""); setDescription(""); setLink(""); setPreviews([]); setEditingId(null); setUploadProgress(""); setSubmitting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Cleanup blob URLs on unmount
  useEffect(() => () => {
    previews.forEach((p) => { if (p.startsWith("blob:")) try { URL.revokeObjectURL(p); } catch {} });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageFiles = (fileList) => {
    const files = Array.from(fileList || []).filter(Boolean);
    if (!files.length) return;
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length !== files.length) alert("Some files were not images and were skipped.");
    if (!imageFiles.length) return;
    const newPreviews = [];
    for (const file of imageFiles) {
      const preview = URL.createObjectURL(file);
      pendingFilesRef.current.set(preview, file);
      newPreviews.push(preview);
    }
    setPreviews((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImageAt = (idx) => {
    const url = previews[idx];
    if (url && url.startsWith("blob:")) {
      try { URL.revokeObjectURL(url); } catch {}
      pendingFilesRef.current.delete(url);
    }
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) { alert("Title and description required."); return; }
    if (!isSupabaseConfigured || !supabase) {
      alert("Supabase is NOT configured — this project will only save on THIS browser and will NOT show on other devices/phone after deploy.\n\nTo enable cross-device sync:\n1. Create Supabase project at supabase.com\n2. Run supabase/schema.sql in SQL Editor\n3. Create .env.local with VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY\n4. Add same vars to Vercel → Settings → Environment Variables\n5. Redeploy\n\nSave anyway locally?");
    }
    if (submitting) return;
    setSubmitting(true);
    setUploadProgress(isSupabaseConfigured ? "Uploading images…" : "Saving locally (NOT synced)…");
    try {
      const fallbackImg = getProjectPlaceholder(title.trim());
      const existing = editingId ? projects.find((p) => p.id === editingId) : null;

      // Resolve final image URLs
      let finalUrls = [];

      if (isSupabaseConfigured && supabase) {
        // Upload any new blob: files to Supabase Storage
        const resolved = [];
        for (const preview of previews) {
          const file = pendingFilesRef.current.get(preview);
          if (file) {
            setUploadProgress(`Uploading ${file.name}…`);
            const publicUrl = await uploadImageFile(file);
            resolved.push(publicUrl);
          } else if (preview && !preview.startsWith("blob:") && !preview.startsWith("data:")) {
            // Existing Supabase URL or placeholder path — keep as-is
            resolved.push(preview);
          } else if (preview && preview.startsWith("data:")) {
            // Legacy data URL (should not happen in Supabase mode) — keep but warn
            console.warn("[Admin] data URL in Supabase mode, keeping as-is (will not be uploaded)");
            resolved.push(preview);
          }
        }
        if (resolved.length) finalUrls = resolved;
        else if (existing?.media?.length) finalUrls = existing.media.map((m) => m.src).filter(Boolean);
        else if (existing?.image) finalUrls = [existing.image];
        else finalUrls = [fallbackImg];
      } else {
        // Local fallback mode (no Supabase env) — keep old base64 behavior so dev still works
        // Convert pending File previews to base64
        const resolved = [];
        for (const preview of previews) {
          const file = pendingFilesRef.current.get(preview);
          if (file) {
            let dataUrl;
            if (file.size > 1024 * 1024 || file.type === "image/png" || file.type === "image/webp") {
              try { dataUrl = await compressImageFileFallback(file, 1600, 1600, 0.78); } catch { dataUrl = await new Promise((res, rej) => { const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); }); }
            } else {
              dataUrl = await new Promise((res, rej) => { const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); });
            }
            resolved.push(dataUrl);
          } else {
            resolved.push(preview);
          }
        }
        if (resolved.length) finalUrls = resolved;
        else if (existing?.media?.length) finalUrls = existing.media.map((m) => m.src).filter(Boolean);
        else if (existing?.image) finalUrls = [existing.image];
        else finalUrls = [fallbackImg];
      }

      const finalImage = finalUrls[0];
      const payload = {
        number: number.trim() || `${String(projects.length+1).padStart(2,"0")} / PROJECT`,
        title: title.trim(),
        description: description.trim(),
        image: finalImage,
        media: finalUrls.map((src) => ({ type: "image", src })),
        link: link.trim() || "#",
      };

      if (editingId) {
        // If editing, delete old storage objects that are no longer used (best-effort)
        const oldUrls = existing ? [existing.image, ...(existing.media||[]).map((m)=>m.src)].filter(Boolean) : [];
        const removed = oldUrls.filter((u) => !finalUrls.includes(u) && u.includes("supabase.co"));
        if (isSupabaseConfigured) {
          await updateProject(editingId, payload);
          for (const u of removed) await deleteStorageByUrl(u);
        } else {
          await updateProject(editingId, payload);
        }
      } else {
        await addProject(payload);
      }
      resetForm();
      setTimeout(() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      console.error(err);
      alert(`Failed to save project: ${err.message || err}`);
    } finally {
      setSubmitting(false);
      setUploadProgress("");
    }
  };

  const handleEdit = (project) => {
    // Clear previous pending blobs
    previews.forEach((p) => { if (p.startsWith("blob:")) try { URL.revokeObjectURL(p); } catch {} });
    pendingFilesRef.current.clear();
    setEditingId(project.id); setTitle(project.title); setNumber(project.number); setDescription(project.description); setLink(project.link);
    const existingMedia = project.media?.map((m) => m.src).filter(Boolean) || (project.image ? [project.image] : []);
    setPreviews(existingMedia);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const handleDelete = async (id) => {
    if(!confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      if(editingId===id) resetForm();
    } catch (err) {
      alert(`Delete failed: ${err.message || err}`);
    }
  };

  const handleResetDefaults = () => {
    if(!confirm("Reset to default 3 projects? (Local only — Supabase data is not affected. To reset Supabase, delete rows in the dashboard.)")) return;
    setProjects(DEFAULT_PROJECTS);
    resetForm();
  };

  return (
    <section className="admin" id="admin">
      <div className="admin-header">
        <div><div className="section-label">ADMIN — PROJECT MANAGER</div><h2 className="section-title">MANAGE PROJECTS</h2>
          <p className="admin-subtitle">
            {isSupabaseConfigured
              ? "✅ Supabase connected — images go to Storage (project-images) and URLs to the projects table — visible on every device."
              : "❌ Supabase NOT connected — projects are saved locally only and will DISAPPEAR on other devices. Fix: add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY to .env.local and Vercel env vars, then redeploy."}
          </p>
          {!isSupabaseConfigured && (
            <p style={{ marginTop: 8, fontSize: 12, color: "#ffcc66", background: "rgba(255,200,80,0.08)", border: "1px solid rgba(255,200,80,0.3)", padding: "8px 10px", borderRadius: 6 }}>
              After you add the keys, restart <code>npm run dev</code> and hard-refresh. Deployed site needs Vercel redeploy.
            </p>
          )}
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onLogout} className="admin-back" style={{background:"transparent", cursor:"pointer"}}>Logout</button>
          <a href="#" className="admin-back">← Portfolio</a>
        </div>
      </div>
      <div className="admin-layout">
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Project" : "Add New Project"}</h3>
          <label>Project Title *<input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="POS & Inventory" required /></label>
          <label>Category / Number<input value={number} onChange={(e)=>setNumber(e.target.value)} placeholder="01 / WEB APPLICATION" /></label>
          <label>Description *<textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="A point-of-sale..." rows={4} required /></label>
          <label>Project Link<input value={link} onChange={(e)=>setLink(e.target.value)} placeholder="https://github.com/lealene/pos-inventory" type="text" inputMode="url" /></label>
          <label>Project Images — multiple, any size/type (auto-fitted)
            <div className={`image-drop ${dragOver?"drag-over":""} ${previews.length?"has-image":""}`} onClick={() => fileInputRef.current?.click()} onDragOver={(e)=>{e.preventDefault(); setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={(e)=>{e.preventDefault(); setDragOver(false); handleImageFiles(e.dataTransfer.files);}}>
              {submitting && uploadProgress ? <span>{uploadProgress}</span> : previews.length ? (
                <div className="image-preview-grid">
                  {previews.map((src, idx) => (
                    <div key={idx} className="image-preview-cell">
                      <img src={src} alt={`preview ${idx+1}`} className="image-preview" onError={(e)=>{ e.currentTarget.src = getProjectPlaceholder(title || "Project"); }} />
                      <button type="button" className="image-remove" onClick={(ev)=>{ ev.stopPropagation(); removeImageAt(idx); }} aria-label="Remove image">×</button>
                      {idx===0 && <span className="image-cover-badge">COVER</span>}
                    </div>
                  ))}
                </div>
              ) : <span>Drag & drop images here or click to choose — multiple allowed, any size/type will be uploaded to Supabase Storage</span>}
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e)=>handleImageFiles(e.target.files)} style={{display:"none"}} />
            </div>
            <div style={{display:"flex", gap:8, marginTop:8}}>
              {previews.length>0 && <button type="button" className="btn-text" onClick={()=>setPreviews([])}>Clear all</button>}
              <span className="field-hint" style={{marginLeft:"auto"}}>{previews.length} image(s) • first is cover • auto-fitted with object-fit:cover{submitting ? " • uploading…" : ""}</span>
            </div>
            <span className="field-hint">Images are uploaded as files to Supabase Storage (bucket: project-images) — no base64 stored in DB. Public URL is saved in the projects table.</span>
          </label>
            <div className="admin-actions">
             <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? (uploadProgress || "Saving…") : editingId?"Update Project":"Add Project"}</button>
             {editingId && <button type="button" className="btn-secondary" onClick={resetForm} disabled={submitting}>Cancel</button>}
           </div>
          <div className="admin-utils">
            <button type="button" className="btn-text" onClick={handleResetDefaults}>Reset to defaults (local)</button>
            <span className="project-count">{projects.length} project(s) {isSupabaseConfigured ? "from Supabase" : "(local fallback)"}</span>
          </div>
        </form>
        <div className="admin-list">
          <h3>Current Projects ({projects.length})</h3>
          {projects.length===0 && <p className="empty">No projects yet.</p>}
          {projects.map((project)=>(
            <div className="admin-card" key={project.id}>
              <div className="admin-card-image">
                <SafeImage src={project.image} alt={project.title} className="admin-card-img" title={project.title} small />
              </div>
              <div className="admin-card-info">
                <span className="admin-card-number">{project.number}</span><h4>{project.title}</h4><p>{project.description}</p>
                <a href={project.link} target="_blank" rel="noreferrer" className="admin-card-link">{project.link}</a>
                <div className="admin-card-actions"><button onClick={()=>handleEdit(project)}>Edit</button><button onClick={()=>handleDelete(project.id)} className="danger">Delete</button></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    if (window.location.hash === ADMIN_ROUTE) return false;
    if (sessionStorage.getItem("hasSeenLoading") === "1") return false;
    return true;
  });
  const { projects, setProjects, loading: projectsLoading, error: projectsError, addProject, updateProject, deleteProject } = useSupabaseProjects();
  const [adminRoute, setAdminRoute] = useState(()=>typeof window!=="undefined" && window.location.hash===ADMIN_ROUTE);
  const [authed, setAuthed] = useState(()=>typeof window!=="undefined" && sessionStorage.getItem("lealene_admin")==="1");

  useEffect(() => {
    if (!loading) return;
    if (typeof window !== "undefined" && window.location.hash === ADMIN_ROUTE) {
      setLoading(false);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(false);
      try { sessionStorage.setItem("hasSeenLoading", "1"); } catch {}
    }, 3000);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(()=>{
    const onHash = ()=> {
      const isAdmin = window.location.hash===ADMIN_ROUTE;
      setAdminRoute(isAdmin);
      if (isAdmin) setLoading(false);
    };
    window.addEventListener("hashchange", onHash);
    return ()=>window.removeEventListener("hashchange", onHash);
  }, []);
  const handleLogout = ()=>{ sessionStorage.removeItem("lealene_admin"); setAuthed(false); window.location.hash=""; };

  if (adminRoute) {
    if (!authed) return <div className="app"><nav><div className="logo">LF.</div><ul className="nav-links"><li><a href="#">Portfolio</a></li></ul></nav><AdminLogin onSuccess={()=>setAuthed(true)} /><footer><span>© 2026 LEALENE FAJARDO</span><span>WEB DEVELOPER</span></footer></div>;
    return <div className="app"><nav><div className="logo">LF.</div><ul className="nav-links"><li><a href="#">Portfolio</a></li><li><a href={ADMIN_ROUTE}>Admin</a></li></ul></nav><AdminPanel projects={projects} setProjects={setProjects} addProject={addProject} updateProject={updateProject} deleteProject={deleteProject} onLogout={handleLogout} /><footer><span>© 2026 LEALENE FAJARDO</span><span>WEB DEVELOPER</span></footer></div>;
  }

  if (loading) {
    return (
      <div
        className="loading-screen"
        style={{
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#252d4a",
        }}
      >
        <WavySpinner />
        <p
          className="loading-text"
          style={{ marginTop: 20, fontSize: 14, letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)", fontFamily: "sans-serif" }}
        >
          Loading.....
        </p>
        <style>{`
          @keyframes wavy-rotate {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          .wavy-spin {
            animation: wavy-rotate 1.2s linear infinite;
            transform-origin: center;
          }
          .loading-screen {
            position: fixed;
            inset: 0;
            z-index: 9999;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app">
      <nav>
        <div className="logo">LF.</div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Work</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <header className="hero">
        <FloatingLanguages />
        <div className="hero-content">
          <div className="hero-left"><h1>LEALENE</h1><p>Web Developer</p></div>
          <div className="profile-wrapper"><img src="/profile.jpg" alt="Lealene Fajardo" className="profile-image" /></div>
          <div className="hero-right"><h2>WEB<br/>DEVELOPER</h2><p>Building digital experiences</p></div>
          <div className="scroll">↓ SCROLL TO EXPLORE</div>
        </div>
      </header>
      <section className="about" id="about">
        <div className="section-label">01 — About</div>
        <div className="about-layout">
          <div className="about-text"><h2 className="section-title">WHO I AM</h2><div className="about-content"><p>I'm <span className="highlight">Lealene S Fajardo</span>, a Bachelor of Science in Information Systems graduate from <span className="highlight">Richwell Colleges Incorporated</span>, Class of 2025–2026.</p><p>I’m a web developer who enjoys transforming creative ideas into modern, responsive, and functional digital experiences. I especially enjoy designing the look and feel of a website first, then bringing that vision to life through code.</p><p>I also enjoy exploring <span className="highlight">AI-powered tools</span> to make websites more interactive, engaging, and enjoyable to use. I believe in being honest about my skills — I may not always be able to write an entire application from scratch entirely on my own, but I can read, understand, analyze, modify, and troubleshoot code, and I continuously learn by working with it. I use AI and other development tools as learning partners to help me understand concepts, solve problems, and improve my projects rather than simply relying on them to do the work for me.</p><p>For me, development is not only about writing code — it is about understanding how things work, learning continuously, combining creativity with technology, and creating digital experiences that feel alive.</p></div></div>
          <VideoSticker />
        </div>
      </section>
      <section className="skills" id="skills">
        <div className="section-label">02 — Skills</div><h2 className="section-title">WHAT I USE</h2>
        <div className="skills-grid"><div className="skill">HTML / CSS</div><div className="skill">JavaScript</div><div className="skill">React</div><div className="skill">Next.js</div><div className="skill">Node.js</div><div className="skill">PHP</div><div className="skill">Python</div><div className="skill">Android Studio</div><div className="skill">XAMPP</div><div className="skill">PostgreSQL</div><div className="skill">MySQL</div><div className="skill">Tailwind CSS</div><div className="skill">Git / GitHub</div><div className="skill">Docker</div><div className="skill">Strapi</div><div className="skill">OpenCode</div></div>
      </section>
      <Projects projects={projects} loading={projectsLoading} error={projectsError} />
      <section className="experience">
        <div className="section-label">04 — Experience</div><h2 className="section-title">MY JOURNEY</h2>
        <div className="experience-list">
          <div className="experience-item"><div className="experience-year">2025 — 2026</div><div className="experience-info"><h3>Web Development</h3><p>Building frontend and full-stack applications while working with modern JavaScript frameworks, databases, APIs, and CMS platforms.</p></div></div>
          <div className="experience-item"><div className="experience-year">2025 — 2026</div><div className="experience-info"><h3>BS Information Systems</h3><p> Graduated from Richwell Colleges Incorporated</p></div></div>
          <div className="experience-item"><div className="experience-year">2024 — 2025</div><div className="experience-info"><h3>Research &amp; Capstone Web Development Training</h3><p>Gained hands-on experience in web development through research and capstone training, designing and developing websites based on real client requirements. Developed knowledge of business processes, point-of-sale (POS) systems, and application development, while working directly with clients to understand their needs, communicate ideas, gather feedback, and create solutions that matched their expectations. Also gained experience in conducting research, documenting findings, and developing research papers as part of academic and capstone projects.</p></div></div>
        </div>
      </section>
      <section className="contact" id="contact">
        <div className="section-label">05 — Contact</div><h2 className="contact-title">LET'S<br/>WORK<br/>TOGETHER.</h2>
        <a href="mailto:lealenefajardo20@gmail.com" className="contact-email">lealenefajardo20@gmail.com</a>
        <a href="https://github.com/lealene" target="_blank" rel="noreferrer" className="contact-github">github.com/lealene →</a>
      </section>
      <footer><span>© 2026 LEALENE FAJARDO</span><span>WEB DEVELOPER</span></footer>
    </div>
  );
}
export default App;
