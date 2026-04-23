import styles from "./ScanHistory.module.css";

const LABEL_CFG = {
  SAFE:     { cls:'badge-safe',  dot:'dot-green' },
  PHISHING: { cls:'badge-phish', dot:'dot-red'   },
  ZERO_DAY: { cls:'badge-zero',  dot:'dot-amber'  },
};

export default function ScanHistory({ history, onSelect }) {
  if (!history.length) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>◎</div>
        <div className={styles.emptyText}>No scans yet</div>
        <div className={styles.emptySub}>Submit a URL to get started</div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.tableHeader}>
        <span>URL</span>
        <span>VERDICT</span>
        <span>RISK</span>
        <span>TIME</span>
      </div>
      {history.map((item, i) => {
        const cfg = LABEL_CFG[item.label] || LABEL_CFG.ZERO_DAY;
        const displayLabel = item.label === 'ZERO_DAY' ? 'ZERO DAY' : item.label;
        return (
          <div key={i} className={styles.row} onClick={() => onSelect(item)}>
            <code className={styles.url}>{item.url}</code>
            <span className={`badge ${cfg.cls}`}>
              <span className={`dot ${cfg.dot}`} />
              {displayLabel}
            </span>
            <div className={styles.riskBar}>
              <div
                className={styles.riskFill}
                style={{
                  width: `${Math.round(item.phish_score * 100)}%`,
                  background: item.label === 'SAFE' ? 'var(--green)' :
                              item.label === 'PHISHING' ? 'var(--red)' : 'var(--amber)',
                }}
              />
              <span className={styles.riskVal}>{Math.round(item.phish_score * 100)}</span>
            </div>
            <span className={styles.time}>
              {new Date(item.scanned_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
            </span>
          </div>
        );
      })}
    </div>
  );
}
