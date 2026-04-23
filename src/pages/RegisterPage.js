import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthPage.module.css";

export default function RegisterPage() {
  const { register } = useAuth();
  const nav          = useNavigate();
  const [form, setForm] = useState({ username:"", email:"", password:"", full_name:"" });
  const [err,  setErr]  = useState("");
  const [busy, setBusy] = useState(false);

  const handle = async e => {
    e.preventDefault();
    if (form.password.length < 6) { setErr("Password must be at least 6 characters"); return; }
    setBusy(true); setErr("");
    try {
      await register(form);
      nav("/dashboard");
    } catch (ex) {
      setErr(ex.response?.data?.detail || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  const f = (k) => e => setForm(p => ({...p, [k]: e.target.value.trim().toLowerCase()}));

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
            <span className="dot dot-cyan" />
            <span className="mono" style={{fontSize:11,color:'var(--text-dim)',letterSpacing:'0.1em'}}>
              NEW AGENT REGISTRATION
            </span>
          </div>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.sub}>Join the federated threat intelligence network</p>
        </div>

        <form onSubmit={handle} className={styles.form}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div>
              <label className={styles.label}>FULL NAME</label>
              <input className="input" placeholder="Jane Doe" value={form.full_name} onChange={f('full_name')} />
            </div>
            <div>
              <label className={styles.label}>USERNAME *</label>
              <input className="input" placeholder="agent_x" value={form.username} onChange={f('username')} required />
            </div>
          </div>

          <label className={styles.label}>EMAIL *</label>
          <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={f('email')} required />

          <label className={styles.label}>PASSWORD *</label>
          <input className="input" type="password" placeholder="Min 6 characters" value={form.password} onChange={f('password')} required />

          {err && <div className={styles.error}>{err}</div>}

          <button className="btn" type="submit" disabled={busy} style={{width:'100%',marginTop:8}}>
            {busy ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Already registered?</span>
          <Link to="/login" className={styles.link}>Sign in →</Link>
        </div>
      </div>
    </div>
  );
}
