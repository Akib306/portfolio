<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Portfolio — print</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  html, body { margin: 0; padding: 0; background: #1a1d23; }
  body {
    font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace;
    color: #abb2bf;
  }
  #root { width: 100%; }
  /* Sized canvas for print so the full terminal renders without clipping */
  .print-stage {
    width: 1100px;
    min-height: 1500px;
    background: #1a1d23;
    margin: 0 auto;
  }
  .print-stage > div { height: 1500px !important; }

  @page { size: A4 portrait; margin: 0.4cm; }
  @media print {
    html, body { background: #1a1d23 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .print-stage { width: 100%; min-height: auto; }
    .print-stage > div { height: auto !important; min-height: 1400px; }
    /* Force every project to render expanded for print */
    .print-stage [data-print-expand-all="true"] { display: block !important; }
    /* Hide blinking caret + animated dots in print */
    [style*="v6blink"] { animation: none !important; }
  }
</style>
</head>
<body>
<div class="print-stage"><div id="root"></div></div>

<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

<script type="text/babel" src="shared-data.jsx"></script>
<script type="text/babel" src="v6-blend.jsx"></script>

<script type="text/babel">
function PrintAll() {
  const P = window.PORTFOLIO;
  // Render each section as a static, fully expanded snapshot for PDF.
  return (
    <div style={{ padding: 32, color: "#abb2bf", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.65 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 12, borderBottom: "1px solid #2a2f37", marginBottom: 22 }}>
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#e06c75" }}></span>
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#e5c07b" }}></span>
        <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#98c379" }}></span>
        <span style={{ marginLeft: 8, color: "#5c6370", fontSize: 11 }}>{P.handle} — tty0</span>
        <span style={{ flex: 1 }}></span>
        <span style={{ color: "#5c6370", fontSize: 11 }}>200 OK</span>
      </div>

      <div style={{ color: "#5c6370" }}>tty0 · {P.handle} · session opened</div>
      <div style={{ color: "#5c6370" }}>click a chip, run a command, or click any project to expand it</div>
      <div style={{ height: 12 }}></div>

      <div style={{ display: "flex", gap: 6 }}><span style={{ color: "#98c379" }}>$</span><span>whoami</span></div>
      <div>{P.role}. {P.blurb}</div>
      <div>loc · {P.location}  ·  focus · {P.focus}</div>
      <div style={{ height: 12 }}></div>

      <div style={{ display: "flex", gap: 6 }}><span style={{ color: "#98c379" }}>$</span><span>ls /projects</span></div>

      <div style={{ display: "flex", gap: 12, padding: "4px 8px", color: "#5c6370", fontSize: 10, letterSpacing: 1.2,
        borderBottom: "1px solid #2a2f37", marginTop: 8, marginBottom: 8 }}>
        <span style={{ width: 18 }}></span>
        <span style={{ width: 180 }}>NAME</span>
        <span style={{ width: 70 }}>SIZE</span>
        <span style={{ width: 90 }}>MODIFIED</span>
        <span style={{ flex: 1 }}>DESCRIPTION</span>
      </div>

      {P.projects.map((p) => (
        <div key={p.id} style={{ pageBreakInside: "avoid", breakInside: "avoid", marginBottom: 18 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, padding: "7px 8px",
            background: "rgba(97,175,239,0.10)", borderLeft: "2px solid #61afef",
          }}>
            <span style={{ width: 18, color: "#61afef", textAlign: "center", fontWeight: 700, transform: "rotate(90deg)", display: "inline-block" }}>›</span>
            <span style={{ color: "#e5c07b", width: 180 }}>{p.id}</span>
            <span style={{ color: "#5c6370", width: 70 }}>{p.size}</span>
            <span style={{ color: "#5c6370", width: 90 }}>{p.date}</span>
            <span style={{ color: "#abb2bf", flex: 1 }}>{p.desc}</span>
            <span style={{ color: "#5c6370", fontSize: 11 }}>[ open ]</span>
          </div>
          <div style={{
            margin: "4px 0 8px 28px", padding: "14px 18px",
            border: "1px solid #2a2f37", borderLeft: "2px solid #61afef",
            background: "rgba(255,255,255,0.015)",
          }}>
            <div style={{ fontFamily: "Georgia, serif", color: "#dcdfe4", fontSize: 22, fontWeight: 500, lineHeight: 1.2, margin: "0 0 12px", letterSpacing: -0.2 }}>{p.tagline}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "4px 12px", fontSize: 11, paddingBottom: 12, borderBottom: "1px solid #2a2f37" }}>
              <div><span style={{ color: "#5c6370", display: "block", marginBottom: 2 }}>role</span><span>{p.role}</span></div>
              <div><span style={{ color: "#5c6370", display: "block", marginBottom: 2 }}>year</span><span>{p.year}</span></div>
              <div><span style={{ color: "#5c6370", display: "block", marginBottom: 2 }}>plat</span><span>{p.platform}</span></div>
              <div><span style={{ color: "#5c6370", display: "block", marginBottom: 2 }}>stat</span><span>{p.status}</span></div>
            </div>
            <div style={{ color: "#c678dd", fontSize: 11, marginTop: 14, marginBottom: 4, letterSpacing: 0.4 }}>// the problem</div>
            <p style={{ margin: "4px 0", fontFamily: "Georgia, serif", fontSize: 14, lineHeight: 1.65, color: "#c5cad3" }}>{p.problem}</p>
            <div style={{ color: "#c678dd", fontSize: 11, marginTop: 14, marginBottom: 4, letterSpacing: 0.4 }}>// the insight</div>
            <p style={{ margin: "4px 0", fontFamily: "Georgia, serif", fontSize: 14, lineHeight: 1.65, color: "#c5cad3" }}>{p.insight}</p>
            <div style={{ color: "#c678dd", fontSize: 11, marginTop: 14, marginBottom: 4, letterSpacing: 0.4 }}>// design decisions</div>
            {p.decisions.map(([k, v], i) => (
              <p key={i} style={{ margin: "4px 0", fontFamily: "Georgia, serif", fontSize: 14, lineHeight: 1.65, color: "#c5cad3" }}>
                <b style={{ color: "#c678dd" }}>{k}.</b> {v}
              </p>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 6, marginTop: 14 }}><span style={{ color: "#98c379" }}>$</span><span>contact</span></div>
      <div>mail · {P.contact}</div>
      <div>site · {P.domain}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PrintAll />);

// Auto-print after fonts + Babel scripts load
(async () => {
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch(e){}
  setTimeout(() => window.print(), 700);
})();
</script>
</body>
</html>
