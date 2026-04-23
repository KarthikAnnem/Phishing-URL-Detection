import styles from "./StatsPanel.module.css";

export default function StatsPanel({ stats, history }) {
  if (!stats) return (
    <div style={{fontFamily:'var(--mono)',color:'var(--text-dim)',fontSize:13}}>Loading stats...</div>
  );

  const total = stats.total_scans || 1;
  const phishPct = Math.round((stats.phishing / total) * 100);
  const zeroPct  = Math.round((stats.zero_day  / total) * 100);
  const safePct  = Math.round((stats.safe       / total) * 100);

  // Recent trend from personal history
  const recentLabels = (history || []).slice(0, 10).map(h => h.label);
  const recentPhish  = recentLabels.filter(l => l === 'PHISHING').length;
  const recentZero   = recentLabels.filter(l => l === 'ZERO_DAY').length;
  const recentSafe   = recentLabels.filter(l => l === 'SAFE').length;

  return (
    <div className={styles.wrap}>
      {/* Global counters */}
      <div className={styles.counters}>
        {[
          { label:'Total Scans',   val: stats.total_scans, color:'var(--cyan)',  dot:'dot-cyan'  },
          { label:'Phishing',      val: stats.phishing,    color:'var(--red)',   dot:'dot-red'   },
          { label:'Zero-Day',      val: stats.zero_day,    color:'var(--amber)', dot:'dot-amber' },
          { label:'Safe',          val: stats.safe,        color:'var(--green)', dot:'dot-green' },
        ].map(c => (
          <div key={c.label} className={`${styles.counter} card`}>
            <div className={styles.counterTop}>
              <span className={`dot ${c.dot}`} />
              <span className={styles.counterLabel}>{c.label}</span>
            </div>
            <div className={styles.counterVal} style={{color: c.color}}>{c.val}</div>
          </div>
        ))}
      </div>

      {/* Distribution bar */}
      <div className={`${styles.section} card`}>
        <div className={styles.sectionTitle}>◈ THREAT DISTRIBUTION</div>
        <div className={styles.distBar}>
          <div className={styles.distSegment} style={{width:`${phishPct}%`, background:'var(--red)'}}   title={`Phishing: ${phishPct}%`} />
          <div className={styles.distSegment} style={{width:`${zeroPct}%`,  background:'var(--amber)'}} title={`Zero-Day: ${zeroPct}%`} />
          <div className={styles.distSegment} style={{width:`${safePct}%`,  background:'var(--green)'}} title={`Safe: ${safePct}%`} />
        </div>
        <div className={styles.distLegend}>
          {[['Phishing', phishPct, 'var(--red)'], ['Zero-Day', zeroPct, 'var(--amber)'], ['Safe', safePct, 'var(--green)']].map(([l, p, c]) => (
            <div key={l} className={styles.legendItem}>
              <span className={styles.legendDot} style={{background:c}} />
              <span className={styles.legendLabel}>{l}</span>
              <span className={styles.legendPct} style={{color:c}}>{p}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Your recent scans */}
      {history && history.length > 0 && (
        <div className={`${styles.section} card`}>
          <div className={styles.sectionTitle}>◎ YOUR RECENT ACTIVITY (last 10 scans)</div>
          <div className={styles.miniStats}>
            {[
              ['Phishing Found', recentPhish, 'var(--red)'],
              ['Zero-Day Found', recentZero,  'var(--amber)'],
              ['Safe URLs',      recentSafe,  'var(--green)'],
            ].map(([l, v, c]) => (
              <div key={l} className={styles.miniStat}>
                <div className={styles.miniVal} style={{color:c}}>{v}</div>
                <div className={styles.miniLabel}>{l}</div>
              </div>
            ))}
          </div>

          {/* Mini sparkline */}
          <div className={styles.sparkline}>
            {(history || []).slice(0, 20).reverse().map((h, i) => {
              const color = h.label === 'SAFE' ? 'var(--green)' :
                            h.label === 'PHISHING' ? 'var(--red)' : 'var(--amber)';
              const height = Math.round(h.phish_score * 100);
              return (
                <div key={i} className={styles.sparkBar}>
                  <div
                    className={styles.sparkFill}
                    style={{ height: `${height}%`, background: color }}
                    title={`${h.label}: ${height}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Model info */}
      <div className={`${styles.section} card`}>
        <div className={styles.sectionTitle}>⬡ MODEL INFORMATION</div>
        <div className={styles.modelGrid}>
          {[
            ['Architecture',  'Transformer Encoder'],
            ['Training',      'Federated Learning'],
            ['Classes',       '3 (Safe / Phishing / Zero-Day)'],
            ['Input',         'Character-level URL tokens'],
            ['Max Length',    '512 characters'],
            ['Engine',        history.some(h => h.model_used) ? 'PyTorch Transformer' : 'Heuristic Fallback'],
          ].map(([k, v]) => (
            <div key={k} className={styles.modelRow}>
              <span className={styles.modelKey}>{k}</span>
              <span className={styles.modelVal}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
