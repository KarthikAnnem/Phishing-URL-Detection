import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";

const FEATURES = [
  { icon: "🧠", title: "Transformer AI", desc: "Deep learning model trained on millions of URLs with attention mechanisms" },
  { icon: "🔗", title: "Federated Learning", desc: "Privacy-preserving distributed training across global threat intelligence nodes" },
  { icon: "⚡", title: "Zero-Day Detection", desc: "Detects novel phishing patterns not seen in training data" },
  { icon: "🛡️", title: "Real-time Scan", desc: "Instant analysis with confidence scoring and threat reasoning" },
];

export default function LandingPage() {
  const nav = useNavigate();
  return (
    <div className={styles.page}>
      {/* Animated background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <span>PHISH<span style={{color:'var(--cyan)'}}>GUARD</span></span>
        </div>
        <div className={styles.navLinks}>
          <button className="btn btn-ghost" onClick={() => nav('/login')}>Sign In</button>
          <button className="btn" onClick={() => nav('/register')}>Get Started</button>
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className="dot dot-green" />
          <span>FEDERATED LEARNING NETWORK ONLINE</span>
        </div>
        <h1 className={styles.heroTitle}>
          <span className={styles.glitch} data-text="DETECT">DETECT</span>
          <br />
          <span style={{color:'var(--cyan)'}}>PHISHING</span>
          <br />
          BEFORE IT<br />STRIKES
        </h1>
        <p className={styles.heroSub}>
          Transformer-powered URL intelligence with federated learning.
          Classify threats as Safe, Phishing, or Zero-Day in milliseconds.
        </p>
        <div className={styles.heroCta}>
          <button className="btn" style={{fontSize:15,padding:'16px 40px'}} onClick={() => nav('/register')}>
            Launch Scanner →
          </button>
          <button className="btn btn-ghost" onClick={() => nav('/login')}>
            Already a member
          </button>
        </div>

        <div className={styles.heroStats}>
          {[['99.2%','Detection Rate'],['<50ms','Scan Time'],['Federated','Privacy-First'],['3','Threat Classes']].map(([v,l]) => (
            <div key={l} className={styles.stat}>
              <span className={styles.statVal}>{v}</span>
              <span className={styles.statLabel}>{l}</span>
            </div>
          ))}
        </div>
      </header>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>CAPABILITIES</h2>
        <div className={styles.featureGrid}>
          {FEATURES.map(f => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.threatDemo}>
        <div className={styles.threatCard + ' card'}>
          <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text-dim)',letterSpacing:'0.1em',marginBottom:16}}>
            THREAT CLASSIFICATION EXAMPLE
          </div>
          {[
            { url:'https://paypal-secure-login.xyz/verify', label:'PHISHING', cls:'badge-phish' },
            { url:'https://github.com/torvalds/linux', label:'SAFE', cls:'badge-safe' },
            { url:'http://192.168.1.1/admin/update', label:'ZERO DAY', cls:'badge-zero' },
          ].map(r => (
            <div key={r.url} className={styles.demoRow}>
              <code className={styles.demoUrl}>{r.url}</code>
              <span className={`badge ${r.cls}`}>{r.label}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>PhishGuard © 2025 — Federated AI Threat Detection</span>
        <button className="btn" onClick={() => nav('/register')}>Start Free →</button>
      </footer>
    </div>
  );
}
