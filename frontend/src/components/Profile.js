import React, { useEffect, useState } from "react";
import api from "../api";

export default function Profile() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    link: "",
    videoUrl: "",
    visible: true,
    current: false,
  });
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Hardcoded demo data for a photography portfolio
  const demoAchievements = [
    { _id: "a1", title: "Best Landscape Photo", type: "Achievement", imageUrl: "https://picsum.photos/id/1015/100/60" },
    { _id: "a2", title: "Wildlife Photography Award", type: "Award", imageUrl: "https://picsum.photos/id/1025/100/60" },
    { _id: "a3", title: "Portrait Excellence", type: "Achievement", imageUrl: "https://picsum.photos/id/1035/100/60" },
  ];

  const demoCurrentProjects = [
    { _id: "c1", title: "Urban Exploration", type: "Ongoing Project", imageUrl: "https://picsum.photos/id/1045/100/60" },
    { _id: "c2", title: "Night Sky Photography", type: "Current Work", imageUrl: "https://picsum.photos/id/1055/100/60" },
    { _id: "c3", title: "Macro Nature Shots", type: "WIP", imageUrl: "https://picsum.photos/id/1065/100/60" },
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const r = await api.get("/portfolio");
      setItems(r.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  function startEdit(item) {
    setEditing(item._id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      type: item.type || "",
      link: item.link || "",
      videoUrl: item.videoUrl || "",
      visible: !!item.visible,
      current: !!item.current,
    });
    setImagePreview(item.imageUrl || (item.fileUrl && isImageUrl(item.fileUrl) ? fullFileUrl(item.fileUrl) : null));
    setImage(null);
    setFile(null);
  }

  function change(e) {
    const name = e.target.name;
    const value = (name === "visible" || name === "current") ? e.target.checked : e.target.value;
    setForm({ ...form, [name]: value });
  }

  function onFileChange(e) { setFile(e.target.files[0]); }
  function onImageChange(e) {
    const f = e.target.files[0];
    setImage(f);
    if (!f) { setImagePreview(null); return; }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(f);
  }

  async function save(e) {
    e.preventDefault();
    const data = new FormData();
    for (let k in form) data.append(k, form[k]);
    if (file) data.append("file", file);
    if (image) data.append("image", image);
    try {
      await api.put(`/portfolio/${editing}`, data);
      await fetchItems();
      setEditing(null);
      setImage(null);
      setFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      alert("Error saving");
    }
  }

  async function del(id) {
    if (!window.confirm("Delete?")) return;
    await api.delete(`/portfolio/${id}`);
    setItems(items.filter((i) => i._id !== id));
  }

  /* helpers */
  function placeholderFor(item) {
    const seed = encodeURIComponent(item._id || item.title || Math.random());
    return `https://picsum.photos/seed/${seed}/400/250`;
  }
  function fullFileUrl(path) {
    const base = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace("/api", "") : "http://localhost:5000";
    return base + path;
  }
  function isImageUrl(url) { return /\.(jpg|jpeg|png|webp|gif|bmp|svg)(\?.*)?$/i.test(url); }

  // categorize items
  const achievements = demoAchievements.length ? demoAchievements : items.filter(i => (i.type || "").toLowerCase().includes("achiev") || (i.type || "").toLowerCase().includes("award"));
  const currentWorking = demoCurrentProjects.length ? demoCurrentProjects : items.filter(i => (i.current) || (i.type || "").toLowerCase().includes("ongo") || (i.type || "").toLowerCase().includes("current") || (i.title || "").toLowerCase().includes("wip"));
  const recentProjects = [...items].reverse();

  return (
    <>
      <style>{`
/* page layout */
.profile-page {
  min-height: 100vh;
  padding: 36px 20px;
  background: linear-gradient(135deg,#fefee3,#ffc9b9);
  box-sizing: border-box;
}

/* top area */
.profile-top {
  max-width: 1200px;
  margin: 0 auto 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.profile-title {
  font-size: 28px;
  color: #2c6e49;
  font-weight: 800;
  margin-bottom: 10px;
}

/* Navbar styling */
.navbar {
  display: flex;
  gap: 20px;
  background: #4c956c;
  padding: 10px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  flex-wrap: wrap;
}
.navbar a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: 0.2s;
}
.navbar a:hover {
  text-decoration: underline;
}

/* main grid: left is 2fr, right is 1fr */
.profile-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

/* projects column */
.projects-column {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(260px,1fr));
  gap: 18px;
}

/* project card */
.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0,0,0,0.10);
  display: flex;
  flex-direction: column;
  transition: transform 0.18s ease;
}
.project-card:hover { transform: translateY(-6px); }

.project-media {
  width: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
  display: block;
  background: #eee;
}

.project-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-title {
  font-size: 18px;
  color: #2c6e49;
  font-weight: 700;
  margin: 0;
}
.project-desc {
  font-size: 13px;
  color: #333;
  margin: 0;
  min-height: 36px;
}

.project-meta {
  display:flex;
  justify-content: space-between;
  align-items:center;
  margin-top: 8px;
}

.project-links a {
  margin-right: 8px;
  text-decoration: none;
  color: #2c6e49;
  font-weight: 600;
}

.card-actions {
  display:flex;
  gap:8px;
  margin-top: 12px;
}

.btn-edit {
  background: #4c956c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}
.btn-delete {
  background: #d9534f;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

/* sidebar */
.sidebar {
  display:flex;
  flex-direction: column;
  gap: 16px;
}
.side-card {
  background: white;
  padding: 14px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}
.side-card h4 { margin: 0 0 10px 0; color:#2c6e49; }

/* item inside sidebar */
.side-item {
  display:flex;
  gap:10px;
  align-items:center;
  padding:8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.side-item:last-child { border-bottom: none; }
.side-thumb {
  width: 64px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  background: #eee;
}
.side-meta { font-size: 13px; }

/* edit form (bottom) */
.edit-area {
  margin-top: 24px;
}

/* responsive */
@media (max-width: 900px) {
  .profile-grid { grid-template-columns: 1fr; }
  .projects-column { grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); }
  .profile-top { padding: 0 12px; }
}
`}</style>

      <div className="profile-page">
        <div className="profile-top">
          <h2 className="profile-title">My Portfolio Projects</h2>
          <nav className="navbar">
            <a href="#home">Home</a>
            <a href="#projects">Projects</a>
            <a href="#achievements">Achievements</a>
            <a href="#current">Current Work</a>
          </nav>
        </div>

        <div className="profile-grid">
          {/* Left: projects */}
          <div>
            <div className="projects-column">
              {recentProjects.map(i => {
                const imageUrl = i.imageUrl
                  ? (i.imageUrl.startsWith("http") ? i.imageUrl : fullFileUrl(i.imageUrl))
                  : (i.fileUrl && isImageUrl(i.fileUrl) ? fullFileUrl(i.fileUrl) : placeholderFor(i));

                return (
                  <div key={i._id} className="project-card">
                    <img className="project-media" src={imageUrl} alt={i.title} />
                    <div className="project-body">
                      <h3 className="project-title">{i.title}</h3>
                      <p className="project-desc">{i.description}</p>

                      <div className="project-meta">
                        <div className="project-links">
                          {i.link && <a href={i.link} target="_blank" rel="noreferrer">Link</a>}
                          {i.videoUrl && <a href={i.videoUrl} target="_blank" rel="noreferrer">Video</a>}
                          {i.fileUrl && <a href={fullFileUrl(i.fileUrl)} target="_blank" rel="noreferrer">File</a>}
                        </div>

                        <div style={{ fontSize: 12, color: "#666" }}>
                          {i.type}
                        </div>
                      </div>

                      <div className="card-actions">
                        <button className="btn-edit" onClick={() => startEdit(i)}>Edit</button>
                        <button className="btn-delete" onClick={() => del(i._id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Edit area */}
            {editing && (
              <div className="edit-area">
                <form onSubmit={save} encType="multipart/form-data" style={{ maxWidth: 720, marginTop: 20 }}>
                  <div className="side-card">
                    <h4>Edit Item</h4>

                    <input name="title" value={form.title} onChange={change} placeholder="Title" style={editInput} />
                    <textarea name="description" value={form.description} onChange={change} placeholder="Description" style={{ ...editInput, minHeight: 90 }} />

                    <input name="type" value={form.type} onChange={change} placeholder="Type" style={editInput} />
                    <input name="link" value={form.link} onChange={change} placeholder="Link" style={editInput} />
                    <input name="videoUrl" value={form.videoUrl} onChange={change} placeholder="Video URL" style={editInput} />

                    <div style={{ marginTop: 8 }}>
                      <label style={{ display: "block", marginBottom: 6 }}>Replace File</label>
                      <input type="file" onChange={onFileChange} />
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <label style={{ display: "block", marginBottom: 6 }}>Replace Image (optional)</label>
                      <input type="file" accept="image/*" onChange={onImageChange} />
                    </div>

                    {imagePreview && <img src={imagePreview} alt="preview" style={{ width: 220, marginTop: 10, borderRadius: 8 }} />}

                    <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
                      <input type="checkbox" name="visible" checked={form.visible} onChange={change} /> Visible
                    </label>

                    <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                      <input type="checkbox" name="current" checked={form.current} onChange={change} /> Mark as currently working on
                    </label>

                    <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                      <button type="submit" className="btn-edit">Save</button>
                      <button type="button" className="btn-delete" onClick={() => { setEditing(null); setImagePreview(null); }}>Cancel</button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right: sidebar */}
          <aside className="sidebar">
            <div className="side-card" id="achievements">
              <h4>Latest Achievements</h4>
              {achievements.length === 0 ? <p style={{ color: "#666" }}>No achievements yet</p> : achievements.slice(0,6).map(a => {
                const thumb = a.imageUrl ? (a.imageUrl.startsWith("http") ? a.imageUrl : fullFileUrl(a.imageUrl)) : (a.fileUrl && isImageUrl(a.fileUrl) ? fullFileUrl(a.fileUrl) : placeholderFor(a));
                return (
                  <div key={a._id} className="side-item">
                    <img src={thumb} className="side-thumb" alt={a.title} />
                    <div className="side-meta">
                      <div style={{ fontWeight: 700 }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>{(a.type || "").slice(0, 30)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="side-card" id="current">
              <h4>Currently Working On</h4>
              {currentWorking.length === 0 ? <p style={{ color: "#666" }}>No current projects</p> : currentWorking.slice(0,6).map(c => {
                const thumb = c.imageUrl ? (c.imageUrl.startsWith("http") ? c.imageUrl : fullFileUrl(c.imageUrl)) : (c.fileUrl && isImageUrl(c.fileUrl) ? fullFileUrl(c.fileUrl) : placeholderFor(c));
                return (
                  <div key={c._id} className="side-item">
                    <img src={thumb} className="side-thumb" alt={c.title} />
                    <div className="side-meta">
                      <div style={{ fontWeight: 700 }}>{c.title}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>{(c.type || "").slice(0, 30)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

/* small inline styles used in edit area */
const editInput = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "2px solid #eaeaea",
  marginTop: 8
};
