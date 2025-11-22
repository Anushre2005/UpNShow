import React, { useState } from "react";
import api, { setToken } from "../api";
import { useNavigate, Link } from "react-router-dom";
import "../styles.css";

export default function Signup({ setUser }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const nav = useNavigate();

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();

    if (form.name.length < 2) {
      setErr("Name must be at least 2 characters");
      return;
    }
    if (!form.email.includes("@")) {
      setErr("Invalid email");
      return;
    }
    if (form.password.length < 6) {
      setErr("Password must be minimum 6 characters");
      return;
    }

    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      nav("/profile");
    } catch (e) {
      setErr(e.response?.data?.msg || "Error");
    }
  }

  return (
    <>
      <style>{`
.page-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #fefee3, #ffc9b9);
  padding: 0;
  margin: 0;
  padding-top: 20px;
}

/* Back button */
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #2c6e49;
  color: white;
  padding: 10px 18px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: 0.2s;
}
.back-btn:hover {
  background: #4c956c;
}

/* Card */
.card-form {
  background: white;
  padding: 40px 45px;
  width: 90%;
  max-width: 480px;
  border-radius: 18px;
  box-shadow: 0px 8px 25px rgba(0, 0, 0, 0.12);
  animation: fadeIn 0.4s ease-in-out;
  margin-top: 60px;
}

.form-title {
  text-align: center;
  color: #2c6e49;
  font-size: 28px;
  margin-bottom: 25px;
  font-weight: 700;
}

.card-form input {
  width: 100%;
  margin-top: 12px;
  padding: 12px 15px;
  font-size: 15px;
  border: 2px solid #e3e3e3;
  border-radius: 10px;
  outline: none;
  transition: 0.2s;
}

.card-form input:focus {
  border-color: #4c956c;
  box-shadow: 0px 0px 6px rgba(76, 149, 108, 0.4);
}

.btn-primary {
  width: 100%;
  margin-top: 18px;
  padding: 12px;
  background: #2c6e49;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
}
.btn-primary:hover {
  background: #4c956c;
}

.error-text {
  color: red;
  margin-top: 10px;
  text-align: center;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0px); }
}
      `}</style>

      <div className="page-container">

        {/* Back Button */}
        <Link to="/" className="back-btn">← Back</Link>

        <div className="card-form">
          <h2 className="form-title">Signup</h2>

          <form onSubmit={submit}>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={change}
              required
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={change}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={change}
              required
            />

            <button className="btn-primary" type="submit">
              Signup
            </button>

            {err && <p className="error-text">{err}</p>}
          </form>
        </div>
      </div>
    </>
  );
}