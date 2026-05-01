// Variant 6 — Blend of v1 (chips + commands) and v4 (soft CRT theme)
// Soft One-Dark-ish palette + subtle scanlines (from v4)
// Click-to-run chips above the prompt (from v1)
// ls renders project rows as inline accordions — click row toggles open/close.
// No "go to next line" behavior; the case study expands inline beneath the row.

function V6Blend() {
  const P = window.PORTFOLIO;
  const [lines, setLines] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [booted, setBooted] = React.useState(false);
  const [openIds, setOpenIds] = React.useState({}); // proj.id -> bool, scoped per list-block
  const [cursorIdx, setCursorIdx] = React.useState(0);
  const scrollRef = React.useRef(null);
  const inputRef = React.useRef(null);

  // Boot sequence shared by initial load and `clear` so the tab feels refreshed.
  const startBoot = React.useCallback(() => {
    setLines([]);
    setOpenIds({});
    setBooted(false);
    const boot = [
      { kind: "sys", text: "tty0 · " + P.handle + " · session opened" },
      { kind: "sys", text: "click a chip, run a command, or click any project to expand it" },
      { kind: "spacer" },
      { kind: "prompt", text: "whoami" },
      { kind: "out", text: P.role + ". " + P.blurb },
      { kind: "out", text: "loc · " + P.location + "  ·  focus · " + P.focus },
      { kind: "spacer" },
      { kind: "prompt", text: "ls /projects" },
      { kind: "list", projects: P.projects, blockId: "boot" + Date.now() },
      { kind: "spacer" },
    ];
    let i = 0;
    const tick = () => {
      if (i >= boot.length) { setBooted(true); return; }
      const item = boot[i];
      setLines((cur) => [...cur, item]);
      i++;
      setTimeout(tick, i < 3 ? 220 : 320);
    };
    setTimeout(tick, 220);
  }, [P]);

  React.useEffect(() => { startBoot(); }, [startBoot]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines, openIds]);

  const toggle = (blockId, projId) => {
    const k = blockId + "::" + projId;
    setOpenIds((o) => ({ ...o, [k]: !o[k] }));
  };
  const isOpen = (blockId, projId) => !!openIds[blockId + "::" + projId];

  const run = (cmd) => {
    const c = cmd.trim().toLowerCase();
    const out = [{ kind: "prompt", text: cmd }];
    if (!c) { setLines((l) => [...l, ...out]); return; }
    if (c === "help") {
      out.push({ kind: "out", text: "commands · whoami · ls · contact · clear" });
      out.push({ kind: "out", text: "tip — clicking a project row toggles its case study open/closed" });
    } else if (c === "ls" || c === "ls -la" || c === "projects") {
      out.push({ kind: "list", projects: P.projects, blockId: "b" + Date.now() });
    } else if (c === "whoami") {
      out.push({ kind: "out", text: P.role + ". " + P.blurb });
      out.push({ kind: "out", text: "loc · " + P.location + "  ·  focus · " + P.focus });
    } else if (c === "contact") {
      out.push({ kind: "out", text: "mail · " + P.contact });
      out.push({ kind: "out", text: "site · " + P.domain });
    } else if (c === "clear") { startBoot(); return; }
    else if (c.startsWith("cat ")) {
      const arg = cmd.slice(4).trim();
      const proj = P.projects.find((p) => p.id.toLowerCase() === arg.toLowerCase());
      if (proj) {
        out.push({ kind: "list", projects: [proj], blockId: "cat" + Date.now() });
        // pre-open the only entry
        setTimeout(() => setOpenIds((o) => ({ ...o, ["cat" + Date.now() + "::" + proj.id]: true })), 0);
      } else out.push({ kind: "err", text: "no such project · try ls" });
    } else {
      out.push({ kind: "err", text: "command not found: " + c + " — try `help`" });
    }
    out.push({ kind: "spacer" });
    setLines((l) => [...l, ...out]);
  };

  const onKey = (e) => {
    if (e.key === "Enter") { run(input); setInput(""); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursorIdx((i) => Math.max(0, i - 1)); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setCursorIdx((i) => Math.min(P.projects.length - 1, i + 1)); }
    else if (e.key === "Tab") { e.preventDefault(); toggle("boot", P.projects[cursorIdx].id); }
  };

  const chip = (label, cmd) => (
    <button onClick={(e) => { e.stopPropagation(); run(cmd); }} style={v6.chip}>{label}</button>
  );

  return (
    <div style={v6.frame} onClick={() => inputRef.current && inputRef.current.focus()}>
      <div style={v6.crtScan}></div>
      <div style={v6.crtVignette}></div>

      <div style={v6.topbar}>
        <span style={{ ...v6.tdot, background: "#e06c75" }}></span>
        <span style={{ ...v6.tdot, background: "#e5c07b" }}></span>
        <span style={{ ...v6.tdot, background: "#98c379" }}></span>
        <span style={v6.topTxt}>{P.handle} — tty0</span>
        <span style={{ flex: 1 }}></span>
        <span style={v6.topTxt}>200 OK</span>
      </div>

      <div ref={scrollRef} style={v6.scroll}>
        {lines.map((l, i) => (
          <V6Line key={i} line={l} cursorIdx={cursorIdx} isOpen={isOpen} toggle={toggle} />
        ))}

        {booted && (
          <div style={v6.promptRow}>
            <span style={{ color: "#98c379" }}>guest</span>
            <span style={{ color: "#5c6370" }}>@</span>
            <span style={{ color: "#61afef" }}>{P.domain}</span>
            <span style={{ color: "#5c6370" }}>:</span>
            <span style={{ color: "#c678dd" }}>~</span>
            <span style={{ color: "#abb2bf" }}>$</span>
            <input ref={inputRef} autoFocus value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey}
              style={v6.input} placeholder="type a command — or click below" />
            <span style={v6.caret}>▍</span>
          </div>
        )}

        {booted && (
          <div style={v6.chipRow}>
            {chip("ls", "ls")}
            {chip("whoami", "whoami")}
            {chip("contact", "contact")}
            {chip("help", "help")}
            {chip("clear", "clear")}
          </div>
        )}
      </div>

      <div style={v6.foot}>
        <span>↑↓ select · tab toggle · enter run</span>
        <span style={{ flex: 1 }}></span>
        <span>{P.domain}</span>
      </div>
    </div>
  );
}

function V6Line({ line, cursorIdx, isOpen, toggle }) {
  if (line.kind === "spacer") return <div style={{ height: 8 }}></div>;
  if (line.kind === "sys") return <div style={{ color: "#5c6370" }}>{line.text}</div>;
  if (line.kind === "prompt") return (
    <div style={{ display: "flex", gap: 6 }}>
      <span style={{ color: "#98c379" }}>$</span>
      <span style={{ color: "#abb2bf" }}>{line.text}</span>
    </div>
  );
  if (line.kind === "out") return <div style={{ color: "#abb2bf" }}>{line.text}</div>;
  if (line.kind === "err") return <div style={{ color: "#e06c75" }}>{line.text}</div>;
  if (line.kind === "list") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 4 }}>
        <div style={v6.listHead}>
          <span style={{ width: 18 }}></span>
          <span style={{ width: 180 }}>NAME</span>
          <span style={{ width: 70 }}>SIZE</span>
          <span style={{ width: 90 }}>MODIFIED</span>
          <span style={{ flex: 1 }}>DESCRIPTION</span>
        </div>
        {line.projects.map((p, i) => {
          const open = isOpen(line.blockId, p.id);
          return (
            <div key={p.id}>
              <button onClick={() => toggle(line.blockId, p.id)} style={{
                ...v6.row,
                background: open
                  ? "rgba(97,175,239,0.10)"
                  : (i === cursorIdx ? "rgba(255,255,255,0.03)" : "transparent"),
                borderLeft: open ? "2px solid #61afef" : "2px solid transparent",
              }}>
                <span style={{ ...v6.chev, transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                <span style={{ color: "#e5c07b", width: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.id}</span>
                <span style={{ color: "#5c6370", width: 70 }}>{p.size}</span>
                <span style={{ color: "#5c6370", width: 90 }}>{p.date}</span>
                <span style={{ color: "#abb2bf", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.desc}</span>
                <span style={v6.openTag}>{open ? "[ close ]" : "[ open ]"}</span>
              </button>
              {open && <V6CaseInline proj={p} />}
            </div>
          );
        })}
      </div>
    );
  }
  return null;
}

function V6CaseInline({ proj }) {
  return (
    <div style={v6.case}>
      <div style={v6.caseTitle}>{proj.tagline}</div>
      <div style={v6.caseMeta}>
        <div><span style={v6.metaK}>role</span><span>{proj.role}</span></div>
        <div><span style={v6.metaK}>year</span><span>{proj.year}</span></div>
        <div><span style={v6.metaK}>plat</span><span>{proj.platform}</span></div>
        <div><span style={v6.metaK}>stat</span><span>{proj.status}</span></div>
      </div>
      <div style={v6.caseSec}>// the problem</div>
      <p style={v6.casePara}>{proj.problem}</p>
      <div style={v6.caseSec}>// the insight</div>
      <p style={v6.casePara}>{proj.insight}</p>
      <div style={v6.caseSec}>// design decisions</div>
      {proj.decisions.map(([k, v], i) => (
        <p key={i} style={v6.casePara}><b style={{ color: "#c678dd" }}>{k}.</b> {v}</p>
      ))}
      <div style={v6.casePh}>img · {proj.id} hero</div>
    </div>
  );
}

const v6 = {
  frame: {
    width: "100%", height: "100%",
    background: "#1a1d23",
    color: "#abb2bf",
    fontFamily: "'JetBrains Mono', ui-monospace, Menlo, monospace",
    fontSize: 13, lineHeight: 1.6,
    display: "flex", flexDirection: "column",
    cursor: "text", position: "relative", overflow: "hidden",
  },
  crtScan: {
    position: "absolute", inset: 0,
    background: "repeating-linear-gradient(0deg, rgba(255,255,255,0) 0, rgba(255,255,255,0) 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 3px)",
    pointerEvents: "none", zIndex: 2,
  },
  crtVignette: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)",
    pointerEvents: "none", zIndex: 2,
  },
  topbar: {
    display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
    background: "#21252b", borderBottom: "1px solid #181a1f",
    fontSize: 11, color: "#5c6370", zIndex: 3, position: "relative",
  },
  tdot: { width: 11, height: 11, borderRadius: "50%" },
  topTxt: { fontFamily: "inherit" },
  scroll: { flex: 1, overflow: "auto", padding: "18px 22px", zIndex: 3, position: "relative" },
  promptRow: { display: "flex", alignItems: "center", gap: 6, marginTop: 14 },
  input: { flex: 1, border: "none", outline: "none", background: "transparent",
    color: "#abb2bf", fontFamily: "inherit", fontSize: "inherit" },
  caret: { color: "#61afef", animation: "v6blink 1s steps(2) infinite" },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 },
  chip: {
    border: "1px solid #2a2f37", background: "#21252b", color: "#abb2bf",
    padding: "5px 12px", fontFamily: "inherit", fontSize: 12,
    cursor: "pointer", borderRadius: 2,
  },
  listHead: {
    display: "flex", gap: 12, padding: "4px 8px",
    color: "#5c6370", fontSize: 10, letterSpacing: 1.2,
    borderBottom: "1px solid #2a2f37", marginBottom: 4,
  },
  row: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "7px 8px",
    border: "none", textAlign: "left",
    fontFamily: "inherit", fontSize: "inherit",
    cursor: "pointer", borderRadius: 0, color: "inherit",
    width: "100%", borderLeft: "2px solid transparent",
    transition: "background 0.12s, border-color 0.12s",
  },
  chev: {
    display: "inline-block", width: 18, color: "#61afef",
    transition: "transform 0.18s ease",
    fontWeight: 700, textAlign: "center",
  },
  openTag: { color: "#5c6370", fontSize: 11, marginLeft: "auto" },
  case: {
    margin: "4px 0 8px 28px",
    padding: "14px 18px",
    border: "1px solid #2a2f37",
    borderLeft: "2px solid #61afef",
    background: "rgba(255,255,255,0.015)",
    animation: "v6expand 0.22s ease",
  },
  caseTitle: {
    fontFamily: "Georgia, 'Iowan Old Style', serif",
    color: "#dcdfe4", fontSize: 22, fontWeight: 500, lineHeight: 1.2,
    margin: "0 0 12px", letterSpacing: -0.2,
  },
  caseMeta: {
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "4px 12px", fontSize: 11, color: "#abb2bf",
    paddingBottom: 12, borderBottom: "1px solid #2a2f37",
  },
  metaK: { color: "#5c6370", display: "block", marginBottom: 2, letterSpacing: 0.4 },
  caseSec: { color: "#c678dd", fontSize: 11, marginTop: 14, marginBottom: 4, letterSpacing: 0.4 },
  casePara: {
    margin: "4px 0",
    fontFamily: "Georgia, serif", fontSize: 14, lineHeight: 1.65, color: "#c5cad3",
  },
  casePh: {
    marginTop: 12, height: 110,
    background: "repeating-linear-gradient(45deg,#1a1d23,#1a1d23 6px,#21252b 6px,#21252b 12px)",
    border: "1px dashed #2a2f37",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#5c6370", fontSize: 11,
  },
  foot: {
    padding: "8px 16px", borderTop: "1px solid #2a2f37",
    fontSize: 11, color: "#5c6370", display: "flex", gap: 12,
    zIndex: 3, position: "relative",
  },
};

if (typeof document !== 'undefined' && !document.getElementById('v6-keyframes')) {
  const s = document.createElement('style');
  s.id = 'v6-keyframes';
  s.textContent = '@keyframes v6blink{50%{opacity:0}}@keyframes v6expand{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(s);
}

window.V6Blend = V6Blend;
