import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import UploadForm from "./components/UploadForm";
import Profile from "./components/Profile";
import api, { setToken } from "./api";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      api.get("/auth/me")
        .then(r => setUser(r.data))
        .catch(() => {
          setToken(null);
          localStorage.removeItem("token");
        });
    }
  }, []);

  function logout() {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  }

  return (
    <div className="container">

      {/* Show nav everywhere EXCEPT home, login, signup */}
      {location.pathname !== "/" &&
       location.pathname !== "/login" &&
       location.pathname !== "/signup" && (
        <nav className="nav">
          <div className="nav-left">
            <Link to="/">Home</Link>
          </div>

          <div className="nav-right">
            {user ? (
              <>
                <Link to="/upload">Add Project</Link>
                <Link to="/profile">My Portfolio</Link>
                <button className="btn" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            )}
          </div>
        </nav>
      )}

      {/* Back button ONLY on login & signup */}
      {(location.pathname === "/login" || location.pathname === "/signup") && (
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/view/:username" element={<PublicView />} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <>
      <div className="top-right-auth">
        <Link to="/login" className="auth-btn">Login</Link>
        <Link to="/signup" className="auth-btn">Signup</Link>
      </div>

      <div className="home-container">
        <h1 
  className="home-title" 
  style={{ 
    fontSize: "48px",       // make text bigger
    marginTop: "0px",      // reduce space on top
    fontWeight: "800",      // bold
    color: "#2c6e49"        // optional color
  }}
>
  UpNShow
</h1>
        <h1 className="home-title">Showcase Your Work Beautifully</h1>
        <p className="home-sub">Create your portfolio, share your story, and inspire others.</p>

        <img
          src="https://videos.openai.com/az/vg-assets/task_01kaew30mwe4qvz6g1e4z4sxed%2F1763583421_img_0.webp?se=2025-11-25T20%3A18%3A52Z&sp=r&sv=2024-08-04&sr=b&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-19T01%3A09%3A01Z&ske=2025-11-26T01%3A14%3A01Z&sks=b&skv=2024-08-04&sig=j%2BzqpeQxJOgBvFOrigHgil5D/1EWOeFqYT/TAXjmybY%3D&ac=oaivgprodscus2"
          alt="Showcase"
          className="home-image"
          style={{ maxWidth: "100%", marginTop: 16, borderRadius: 8 }}
        />
      </div>
    </>
  );
}

function PublicView() {
  const { username } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!username) return;

    api.get(`/portfolio/user/${username}`)
      .then(r => setItems(r.data))
      .catch(err => console.error(err));
  }, [username]);

  return (
    <div>
      <h2>Public Portfolio of {username}</h2>
      {items.length === 0 ? (
        <p>No public items</p>
      ) : (
        items.map(i => (
          <div key={i._id} className="card">
            <h3>{i.title}</h3>
            <p>{i.description}</p>

            {i.fileUrl && (
              <a
                href={`${
                  process.env.REACT_APP_API_URL
                    ? process.env.REACT_APP_API_URL.replace("/api", "")
                    : "http://localhost:5000"
                }${i.fileUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                File
              </a>
            )}

            {i.videoUrl && (
              <div>
                <a href={i.videoUrl} target="_blank" rel="noreferrer">
                  Video
                </a>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
