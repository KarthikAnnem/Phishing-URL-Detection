import styles from "./ScanResult.module.css";

const CONFIG = {
  SAFE:     { label:'SAFE',      cls:'safe',   icon:'✓', color:'var(--green)', glow:'var(--glow-g)', tagCls:'badge-safe'  },
  PHISHING: { label:'PHISHING',  cls:'phish',  icon:'✗', color:'var(--red)',   glow:'var(--glow-r)', tagCls:'badge-phish' },
  ZERO_DAY: { label:'ZERO DAY',  cls:'zero',   icon:'⚠', color:'var(--amber)', glow:'0 0 24px rgba(255,184,0,0.35)', tagCls:'badge-zero'  },
};

export default function ScanResult({ result }) {
  const cfg   = CONFIG[result.label] || CONFIG.ZERO_DAY;
  const score = Math.round(result.phish_score * 100);

  return (
    <div className={`${styles.card} card fade-up`}>
      {/* Top section */}
      <div className={`${styles.topSection} ${styles[cfg.cls + 'Bg']}`}>
        <div className={styles.verdict}>
          <div className={styles.verdictIcon} style={{color: cfg.color, boxShadow: cfg.glow}}>
            {cfg.icon}
          </div>
          <div>
            <div className={styles.verdictLabel} style={{color: cfg.color}}>
              {cfg.label}
            </div>
            <div className={styles.verdictConf}>
              {result.confidence}% confidence
            </div>
          </div>
        </div>

        {/* Score ring */}
        <div className={styles.scoreRing}>
          <svg viewBox="0 0 100 100" className={styles.ringsvg}>
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"/>
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke={cfg.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${score * 2.513} 251.3`}
              strokeDashoffset="62.83"
              style={{filter:`drop-shadow(0 0 6px ${cfg.color})`}}
            />
          </svg>
          <div className={styles.ringCenter}>
            <div className={styles.ringScore} style={{color: cfg.color}}>{score}</div>
            <div className={styles.ringLabel}>RISK</div>
          </div>
        </div>
      </div>

      {/* URL */}
      <div className={styles.urlSection}>
        <span className={styles.urlPrefix}>SCANNED:</span>
        <code className={styles.urlText}>{result.url}</code>
      </div>

      {/* Reasons */}
      {result.reasons && result.reasons.length > 0 && (
        <div className={styles.reasonsSection}>
          <div className={styles.sectionTitle}>
            <span>⬡</span> THREAT INDICATORS
          </div>
          <div className={styles.reasons}>
            {result.reasons.map((r, i) => (
              <div key={i} className={styles.reason}>
                <span className={styles.reasonBullet} style={{color: cfg.color}}>▸</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features grid */}
      <div className={styles.featuresSection}>
        <div className={styles.sectionTitle}>
          <span>◈</span> URL ANALYSIS
        </div>
        <div className={styles.featGrid}>
          {[
            ['Length',    result.features?.url_length,       null],
            ['HTTPS',     result.features?.has_https ? 'YES' : 'NO', result.features?.has_https ? 'green' : 'red'],
            ['Has IP',    result.features?.has_ip ? 'YES' : 'NO',    result.features?.has_ip    ? 'red'   : 'green'],
            ['Entropy',   result.features?.entropy?.toFixed(2), null],
            ['Dots',      result.features?.num_dots,          null],
            ['Subdomains',result.features?.subdomain_count,   null],
            ['@ Symbol',  result.features?.num_at > 0 ? 'YES':'NO', result.features?.num_at > 0 ? 'red':'green'],
            ['Sus. TLD',  result.features?.sus_tld ? 'YES':'NO',    result.features?.sus_tld    ? 'red':'green'],
          ].map(([k, v, col]) => (
            <div key={k} className={styles.featItem}>
              <div className={styles.featKey}>{k}</div>
              <div className={styles.featVal} style={col ? {color:`var(--${col})`} : {}}>
                {v ?? '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.footerMeta}>
          Scanned {new Date(result.scanned_at).toLocaleString()}
          {' · '}
          {result.model_used ? 'Transformer Model' : 'Heuristic Engine'}
        </span>
        <span className={`badge ${cfg.tagCls}`}>
          <span className={`dot dot-${result.label === 'SAFE' ? 'green' : result.label === 'PHISHING' ? 'red' : 'amber'}`}/>
          {cfg.label}
        </span>
      </div>
    </div>
  );
}
