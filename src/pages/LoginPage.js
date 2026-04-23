import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthPage.module.css";

export default function LoginPage() {
  const { login }  = useAuth();
  const nav        = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [err,  setErr]  = useState("");
  const [busy, setBusy] = useState(false);

  const handle = async e => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      await login(form.username, form.password);
      nav("/dashboard");
    } catch (ex) {
      setErr(ex.response?.data?.detail || "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.brand} onClick={() => nav('/')}>
        <span style={{color:'var(--cyan)',fontSize:18}}>⬡</span>
        <span style={{fontFamily:'var(--display)',fontSize:22,letterSpacing:'0.05em',color:'var(--text-hi)'}}>
          PHISH<span style={{color:'var(--cyan)'}}>GUARD</span>
        </span>
      </div>

      <div className={styles.card + ' card fade-up'}>
        <div className={styles.header}>
          <div className={styles.termLine}>
            <span className="dot dot-green" />
            <span className="mono" style={{fontSize:11,color:'var(--text-dim)',letterSpacing:'0.1em'}}>
              AUTHENTICATION REQUIRED
            </span>
          </div>
          <h1 className={styles.title}>Sign In</h1>
          <p className={styles.sub}>Access the threat intelligence platform</p>
        </div>

        <form onSubmit={handle} className={styles.form}>
          <label className={styles.label}>USERNAME</label>
          <input
            className="input"
            placeholder="your_username"
            value={form.username}
            onChange={e => setForm(p => ({...p, username: e.target.value.trim().toLowerCase()}))}
            autoFocus required
          />

          <label className={styles.label}>PASSWORD</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••••"
            value={form.password}
            onChange={e => setForm(p => ({...p, password: e.target.value}))}
            required
          />

          {err && <div className={styles.error}>{err}</div>}

          <button className="btn" type="submit" disabled={busy} style={{width:'100%',marginTop:8}}>
            {busy ? 'AUTHENTICATING...' : 'AUTHENTICATE →'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>No account?</span>
          <Link to="/register" className={styles.link}>Create one →</Link>
        </div>
      </div>
    </div>
  );
}
