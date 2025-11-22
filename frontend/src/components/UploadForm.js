import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function UploadForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    link: "",
    videoUrl: "",
    visible: true,
    current: false, // optional flag: mark project as currently working on
  });
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null); // image file
  const [imagePreview, setImagePreview] = useState(null);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  function change(e) {
    const name = e.target.name;
    const value =
      name === "visible" || name === "current" ? e.target.checked : e.target.value;
    setForm({ ...form, [name]: value });
  }

  function onFileChange(e) {
    setFile(e.target.files[0]);
  }

  function onImageChange(e) {
    const f = e.target.files[0];
    setImage(f);
    if (!f) {
      setImagePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(f);
  }

  async function submit(e) {
    e.preventDefault();
    if (form.title.trim().length < 2) {
      setErr("Title min 2 characters");
      return;
    }
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("type", form.type);
    data.append("link", form.link);
    data.append("videoUrl", form.videoUrl);
    data.append("visible", form.visible);
    data.append("current", form.current);
    if (file) data.append("file", file);
    if (image) data.append("image", image);

    try {
      await api.post("/portfolio", data);
      nav("/profile");
    } catch (e) {
      setErr(e.response?.data?.errors?.[0]?.msg || e.response?.data?.msg || "Error");
    }
  }

  return (
    <div style={{ padding: 20, display: "flex", justifyContent: "center" }}>
      <div style={{
        width: "100%",
        maxWidth: 720,
        background: "white",
        borderRadius: 14,
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        padding: 28
      }}>
        <h2 style={{ color: "#2c6e49", marginBottom: 12 }}>Add Portfolio Item</h2>

        <form onSubmit={submit} encType="multipart/form-data">
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={change}
            required
            style={inputStyle}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={change}
            style={{ ...inputStyle, minHeight: 100 }}
          />

          <input
            name="type"
            placeholder="Type (e.g. project, achievement, ongoing)"
            value={form.type}
            onChange={change}
            style={inputStyle}
          />

          <input
            name="link"
            placeholder="External link"
            value={form.link}
            onChange={change}
            style={inputStyle}
          />

          <input
            name="videoUrl"
            placeholder="Video URL"
            value={form.videoUrl}
            onChange={change}
            style={inputStyle}
          />

          <label style={{ display: "block", marginTop: 12, fontWeight: 600 }}>Upload project file</label>
          <input type="file" onChange={onFileChange} style={{ marginTop: 8 }} />

          <label style={{ display: "block", marginTop: 12, fontWeight: 600 }}>Upload project image (optional)</label>
          <input type="file" accept="image/*" onChange={onImageChange} style={{ marginTop: 8 }} />

          {/* image preview */}
          {imagePreview && (
            <div style={{ marginTop: 12 }}>
              <img src={imagePreview} alt="preview" style={{ width: 300, borderRadius: 8 }} />
            </div>
          )}

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
            <input type="checkbox" name="visible" checked={form.visible} onChange={change} />
            Visible publicly
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <input type="checkbox" name="current" checked={form.current} onChange={change} />
            Mark as "Currently Working On"
          </label>

          <button style={primaryBtnStyle} type="submit">Add</button>

          {err && <p style={{ color: "red", marginTop: 10 }}>{err}</p>}
        </form>
      </div>
    </div>
  );
}

/* small shared styles */
const inputStyle = {
  width: "100%",
  marginTop: 12,
  padding: "12px 14px",
  fontSize: 15,
  border: "2px solid #e3e3e3",
  borderRadius: 10,
  outline: "none",
};

const primaryBtnStyle = {
  width: "100%",
  marginTop: 18,
  padding: 12,
  background: "#2c6e49",
  color: "white",
  border: "none",
  borderRadius: 10,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer"
};
