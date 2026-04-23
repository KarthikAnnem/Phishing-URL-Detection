import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import ScanResult from "../components/ScanResult";
import ScanHistory from "../components/ScanHistory";
import StatsPanel from "../components/StatsPanel";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const [url,     setUrl]     = useState("");
  const [result,  setResult]  = useState(null);
  const [history, setHistory] = useState([]);
  const [stats,   setStats]   = useState(null);
  const [busy,    setBusy]    = useState(false);
  const [err,     setErr]     = useState("");
  const [tab,     setTab]     = useState("scan");   // scan | history | stats

  const fetchHistory = useCallback(async () => {
    try { const r = await api.get("/scan/history"); setHistory(r.data.history); }
    catch {}
  }, []);

  const fetchStats = useCallback(async () => {
    try { const r = await api.get("/stats"); setStats(r.data); }
    catch {}
  }, []);

  useEffect(() => { fetchHistory(); fetchStats(); }, [fetchHistory, fetchStats]);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setBusy(true); setErr(""); setResult(null);
    try {
      const r = await api.post("/scan", { url: url.trim() });
      setResult(r.data);
      await fetchHistory();
      await fetchStats();
    } catch (ex) {
      setErr(ex.response?.data?.detail || "Scan failed. Check the backend is running.");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = () => { logout(); nav("/"); };

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sideTop}>
          <div className={styles.logo}>
            <span className={styles.logoHex}>⬡</span>
            <div>
              <div className={styles.logoText}>PHISH<span style={{color:'var(--cyan)'}}>GUARD</span></div>
              <div className={styles.logoSub}>v2.0 · Federated AI</div>
            </div>
          </div>

          <div className={styles.userCard}>
            <div className={styles.avatar}>
              {(user?.full_name || user?.username || "U")[0].toUpperCase()}
            </div>
            <div>
              <div className={styles.userName}>{user?.full_name || user?.username}</div>
              <div className={styles.userHandle}>@{user?.username}</div>
            </div>
          </div>

          <nav className={styles.nav}>
            {[
              { id:'scan',    icon:'⬡', label:'URL Scanner' },
              { id:'history', icon:'◎', label:'Scan History' },
              { id:'stats',   icon:'◈', label:'Threat Stats' },
            ].map(n => (
              <button
                key={n.id}
                className={styles.navItem + (tab === n.id ? ' ' + styles.navActive : '')}
                onClick={() => setTab(n.id)}
              >
                <span className={styles.navIcon}>{n.icon}</span>
                <span>{n.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className={styles.sideBottom}>
          <div className={styles.nodeStatus}>
            <span className="dot dot-green" />
            <span className="mono" style={{fontSize:10,color:'var(--text-dim)',letterSpacing:'0.08em'}}>
              NETWORK NODE ACTIVE
            </span>
          </div>
          <button className="btn btn-ghost" style={{width:'100%',marginTop:12}} onClick={handleLogout}>
            ⬡ SIGN OUT
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>
              {tab === 'scan'    && 'URL SCANNER'}
              {tab === 'history' && 'SCAN HISTORY'}
              {tab === 'stats'   && 'THREAT STATISTICS'}
            </h1>
            <p className={styles.pageSub}>
              {tab === 'scan'    && 'Submit any URL for transformer-based phishing analysis'}
              {tab === 'history' && `${history.length} scans performed`}
              {tab === 'stats'   && 'Aggregated threat intelligence across all users'}
            </p>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.modelBadge}>
              <span className="dot dot-cyan" />
              <span>MODEL ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>

          {/* ─ Scanner tab ─ */}
          {tab === 'scan' && (
            <div className="fade-in">
              <form onSubmit={handleScan} className={styles.scanForm}>
                <div className={styles.scanInputWrap}>
                  <span className={styles.scanPrefix}>URL://</span>
                  <input
                    className={styles.scanInput}
                    type="text"
                    placeholder="paste any URL here — e.g. https://example.com"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    spellCheck={false}
                    autoFocus
                  />
                  <button className="btn" type="submit" disabled={busy || !url.trim()} style={{flexShrink:0}}>
                    {busy ? <><Spinner /> SCANNING</> : 'SCAN →'}
                  </button>
                </div>
                <div className={styles.scanHints}>
                  <span>Try:</span>
                  {[
                    'https://paypal-verify.xyz/login',
                    'https://github.com',
                    'http://192.168.1.1/admin',
                  ].map(hint => (
                    <button
                      key={hint}
                      type="button"
                      className={styles.hintBtn}
                      onClick={() => setUrl(hint)}
                    >{hint}</button>
                  ))}
                </div>
              </form>

              {err && (
                <div className={styles.errBox}>
                  <span style={{fontSize:18}}>⚠</span>
                  <span>{err}</span>
                </div>
              )}

              {busy && (
                <div className={styles.scanning}>
                  <div className={styles.scanningRing} />
                  <div className={styles.scanningText}>
                    <div className={styles.scanningTitle}>ANALYZING URL</div>
                    <div className={styles.scanningSteps}>
                      {['Tokenizing URL...','Running transformer...','Evaluating features...','Classifying threat...'].map((s,i) => (
                        <div key={s} className={styles.scanningStep} style={{animationDelay:`${i*0.4}s`}}>{s}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {result && !busy && <ScanResult result={result} />}
            </div>
          )}

          {tab === 'history' && (
            <div className="fade-in">
              <ScanHistory history={history} onSelect={r => { setResult(r); setTab('scan'); setUrl(r.url); }} />
            </div>
          )}

          {tab === 'stats' && (
            <div className="fade-in">
              <StatsPanel stats={stats} history={history} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function Spinner() {
  return (
    <span style={{
      display:'inline-block', width:12, height:12,
      border:'2px solid rgba(0,230,255,0.3)',
      borderTopColor:'var(--cyan)',
      borderRadius:'50%',
      animation:'spinSlow 0.6s linear infinite',
    }} />
  );
}
