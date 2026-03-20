import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { value: "商談",                                        color: "#ef4444" },
  { value: "企画・演出",                                  color: "#8b5cf6" },
  { value: "案件管理",                                    color: "#f59e0b" },
  { value: "撮影前",                                      color: "#92400e" },
  { value: "撮影本番",                                    color: "#16a34a" },
  { value: "編集",                                        color: "#f97316" },
  { value: "定例会議",                                    color: "#ec4899" },
  { value: "定例会議・人事評価制度以外の打ち合わせ",      color: "#db2777" },
  { value: "アクションプラン関連",                        color: "#c026d3" },
  { value: "人事制度関連",                                color: "#6366f1" },
  { value: "個人のタスク管理・スケジュール管理",          color: "#0ea5e9" },
  { value: "その他の事務",                                color: "#64748b" },
];

const CAT_SHORT = {
  "定例会議・人事評価制度以外の打ち合わせ": "定例外MTG",
  "個人のタスク管理・スケジュール管理":     "タスク管理",
  "アクションプラン関連":                  "AP関連",
};

const MEMBERS = [
  { id: "kofune",      name: "小船" },
  { id: "matsuya",     name: "松谷" },
  { id: "sanbonsuge",  name: "三本杉" },
  { id: "t.ogasawara", name: "小笠原" },
  { id: "r.araki",     name: "荒木" },
  { id: "t.yamanobe",  name: "山野邊" },
  { id: "y.tobita",    name: "飛田" },
  { id: "t.kuga",      name: "久賀" },
  { id: "n.nakamura",  name: "中村" },
  { id: "k.sato",      name: "佐藤" },
  { id: "m.imai",      name: "今井" },
  { id: "a.syouji",    name: "庄司" },
  { id: "t.tanaka",    name: "田中" },
  { id: "r.kosugi",    name: "小杉" },
  { id: "h.oda",       name: "小田" },
  { id: "w.sugai",     name: "菅井" },
  { id: "h.katsumura", name: "勝村" },
];

const pad      = n  => String(n).padStart(2, "0");
const fmtT     = d  => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const toHalfH  = ms => { const h = Math.round(ms / 1800000) * 0.5; return h < 0.5 ? 0.5 : h; };
const msDisp   = ms => { const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60); return `${pad(h)}:${pad(m%60)}:${pad(s%60)}`; };
const todayKey = () => { const d=new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };
const catColor = v  => CATEGORIES.find(c=>c.value===v)?.color || "#64748b";
const short    = v  => CAT_SHORT[v] || v;

const LOGS_KEY = "pump_worklog_v4_logs";

async function loadLogs() {
  try { const r = await window.storage.get(LOGS_KEY, true); return r ? JSON.parse(r.value) : []; }
  catch { return []; }
}
async function saveLogs(logs) {
  try { await window.storage.set(LOGS_KEY, JSON.stringify(logs), true); } catch {}
}

export default function App() {
  const [user,       setUser]       = useState(null);
  const [nameInput,  setNameInput]  = useState("");
  const [logs,       setLogs]       = useState([]);
  const [loaded,     setLoaded]     = useState(false);

  const [running,    setRunning]    = useState(false);
  const [startTs,    setStartTs]    = useState(null);
  const [elapsed,    setElapsed]    = useState(0);
  const timerRef = useRef(null);

  const [taskName,   setTaskName]   = useState("");
  const [category,   setCategory]   = useState("定例会議");
  const [manualMode, setManualMode] = useState(false);
  const [mStart,     setMStart]     = useState("");
  const [mEnd,       setMEnd]       = useState("");
  const [filterDate, setFilterDate] = useState(todayKey());
  const [flash,      setFlash]      = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    loadLogs().then(l => { setLogs(l); setLoaded(true); });
  }, []);

  useEffect(() => {
    if (running) { timerRef.current = setInterval(() => setElapsed(Date.now()-startTs), 500); }
    else         { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [running, startTs]);

  const pushLog = async entry => {
    const next = [entry, ...logs];
    setLogs(next);
    await saveLogs(next);
    setFlash(true); setTimeout(() => setFlash(false), 800);
  };

  const handleStart = () => {
    if (!taskName.trim()) { nameRef.current?.focus(); return; }
    setStartTs(Date.now()); setElapsed(0); setRunning(true);
  };

  const handleStop = async () => {
    if (!running) return;
    setRunning(false);
    const end = Date.now();
    await pushLog({
      id: end, date: todayKey(), user: user.id, userName: user.name,
      taskName: taskName.trim(), category,
      startTs, endTs: end, hours: toHalfH(end - startTs), manual: false,
    });
    setTaskName(""); setElapsed(0);
  };

  const handleManual = async () => {
    if (!taskName.trim() || !mStart || !mEnd) return;
    const [sh,sm] = mStart.split(":").map(Number);
    const [eh,em] = mEnd.split(":").map(Number);
    const b1 = new Date(); b1.setHours(sh,sm,0,0);
    const b2 = new Date(); b2.setHours(eh,em,0,0);
    let endTs = b2.getTime(); const st = b1.getTime();
    if (endTs <= st) endTs += 86400000;
    await pushLog({
      id: Date.now(), date: filterDate, user: user.id, userName: user.name,
      taskName: taskName.trim(), category,
      startTs: st, endTs, hours: toHalfH(endTs - st), manual: true,
    });
    setTaskName(""); setMStart(""); setMEnd("");
  };

  const handleDelete = async id => {
    const next = logs.filter(l => l.id !== id);
    setLogs(next);
    await saveLogs(next);
  };

  const filtered = logs.filter(l => l.date === filterDate && l.user === user?.id);
  const totalH   = filtered.reduce((s,l) => s+l.hours, 0);

  const handleNotionPush = () => {
    const lines = filtered.map(l =>
      `・${l.taskName} [${short(l.category)}] ${l.hours}h [${fmtT(new Date(l.startTs))}〜${fmtT(new Date(l.endTs))}]`
    ).join("\n");
    sendPrompt(`以下の作業ログを工数管理DBに入力してください。\n担当者: ${user.name}\n日付: ${filterDate}\n\n${lines}`);
  };

  // ── ログイン ──────────────────────────────────────────────────────────
  if (!user) return (
    <div style={{fontFamily:"'DM Sans',sans-serif",minHeight:"100vh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box}`}</style>
      <div style={{width:300,padding:"26px 20px",background:"#111",borderRadius:12,border:"1px solid #1e1e1e"}}>
        <div style={{fontSize:10,color:"#333",letterSpacing:"0.15em",marginBottom:18}}>PUMP WORKLOG — メンバー選択</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:14}}>
          {MEMBERS.map(m=>(
            <button key={m.id} onClick={()=>setUser(m)} style={{
              padding:"7px 4px",borderRadius:5,border:"1px solid #1e1e1e",
              background:"transparent",color:"#666",fontSize:12,cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",transition:"all 0.12s",
            }}
              onMouseEnter={e=>{e.target.style.borderColor="#555";e.target.style.color="#e8e4dc";}}
              onMouseLeave={e=>{e.target.style.borderColor="#1e1e1e";e.target.style.color="#666";}}
            >{m.name}</button>
          ))}
        </div>
        <div style={{borderTop:"1px solid #181818",paddingTop:12,display:"flex",gap:6}}>
          <input value={nameInput} onChange={e=>setNameInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&nameInput.trim()) setUser({id:nameInput.trim(),name:nameInput.trim()});}}
            placeholder="その他（名前入力）"
            style={{flex:1,background:"#181818",border:"1px solid #222",borderRadius:5,
              color:"#e8e4dc",padding:"6px 9px",fontSize:12,outline:"none",fontFamily:"'DM Sans',sans-serif"}} />
          <button onClick={()=>{if(nameInput.trim()) setUser({id:nameInput.trim(),name:nameInput.trim()});}}
            style={{padding:"6px 12px",borderRadius:5,border:"none",background:"#e8e4dc",
              color:"#0a0a0a",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>OK</button>
        </div>
      </div>
    </div>
  );

  // ── メイン ────────────────────────────────────────────────────────────
  return (
    <div style={{fontFamily:"'DM Mono','Courier New',monospace",minHeight:"100vh",background:"#0a0a0a",color:"#e8e4dc"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box}input,select,button{font-family:inherit}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#222;border-radius:2px}
        .logrow:hover .delbtn{opacity:1!important}
        @keyframes fin{0%{background:#182018}100%{background:transparent}}.flash{animation:fin 0.8s ease-out}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}.pulsing{animation:pulse 1s ease-in-out infinite}
      `}</style>

      {/* Header */}
      <div style={{borderBottom:"1px solid #141414",padding:"13px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0d0d0d"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{
            width:7,height:7,borderRadius:"50%",
            background:running?"#4ade80":"#222",
            boxShadow:running?"0 0 6px #4ade80":"none",
            transition:"all 0.3s",
          }} className={running?"pulsing":""} />
          <span style={{fontSize:10,color:"#3a3a3a",letterSpacing:"0.15em"}}>PUMP WORKLOG</span>
          <span style={{fontSize:10,color:"#222"}}>|</span>
          <button onClick={()=>setUser(null)}
            style={{fontSize:11,color:"#4a4a4a",background:"transparent",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            {user.name} ▾
          </button>
        </div>
        <div style={{
          fontSize:24,fontWeight:300,letterSpacing:"0.04em",
          color:running?"#4ade80":"#242424",
          transition:"color 0.3s",fontVariantNumeric:"tabular-nums",
        }}>
          {msDisp(elapsed)}
        </div>
      </div>

      <div style={{padding:"14px",maxWidth:640,margin:"0 auto"}}>

        {/* 入力エリア */}
        <div style={{
          background:"#111",border:"1px solid #1a1a1a",
          borderRadius:8,padding:14,marginBottom:12,
        }} className={flash?"flash":""}>

          {/* 作業名 */}
          <input
            ref={nameRef}
            value={taskName}
            onChange={e=>setTaskName(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!running&&!manualMode) handleStart();}}
            placeholder="作業名を入力..."
            style={{
              width:"100%",background:"transparent",border:"none",
              borderBottom:"1px solid #1e1e1e",color:"#e8e4dc",
              fontSize:14,padding:"2px 0 9px",marginBottom:12,
              outline:"none",fontFamily:"'DM Sans',sans-serif",
            }}
          />

          {/* カテゴリ */}
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
            {CATEGORIES.map(c=>(
              <button key={c.value} onClick={()=>setCategory(c.value)} style={{
                padding:"2px 7px",borderRadius:3,fontSize:10,cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",transition:"all 0.1s",
                border:category===c.value?`1px solid ${c.color}`:"1px solid #1c1c1c",
                background:category===c.value?`${c.color}14`:"transparent",
                color:category===c.value?c.color:"#3a3a3a",
              }}>{short(c.value)}</button>
            ))}
          </div>

          {/* モード切替 */}
          <div style={{display:"flex",gap:5,marginBottom:10}}>
            {["⏱ タイマー","✏️ 手動"].map((lbl,i)=>(
              <button key={i} onClick={()=>setManualMode(!!i)} style={{
                fontSize:10,padding:"2px 8px",borderRadius:3,cursor:"pointer",
                background:(!i&&!manualMode)||(i&&manualMode)?"#1c1c1c":"transparent",
                border:"1px solid #1c1c1c",color:"#555",
                fontFamily:"'DM Sans',sans-serif",
              }}>{lbl}</button>
            ))}
          </div>

          {/* 操作ボタン */}
          {manualMode ? (
            <div style={{display:"flex",gap:7,alignItems:"center"}}>
              {[mStart, mEnd].map((v,i)=>(
                <input key={i} type="time" value={v}
                  onChange={e => i ? setMEnd(e.target.value) : setMStart(e.target.value)}
                  style={{background:"#161616",border:"1px solid #222",borderRadius:4,
                    color:"#e8e4dc",padding:"5px 7px",fontSize:12,outline:"none",width:92}} />
              ))}
              <span style={{fontSize:10,color:"#333",flex:1,textAlign:"center"}}>
                {mStart && mEnd ? `${toHalfH((()=>{const[sh,sm]=mStart.split(":").map(Number),[eh,em]=mEnd.split(":").map(Number),b1=new Date(),b2=new Date();b1.setHours(sh,sm);b2.setHours(eh,em);let e=b2.getTime();if(e<=b1.getTime())e+=86400000;return e-b1.getTime();})())}h` : ""}
              </span>
              <button onClick={handleManual} style={{
                padding:"6px 16px",borderRadius:4,border:"none",
                background:"#e8e4dc",color:"#0a0a0a",fontSize:11,fontWeight:600,
                cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
              }}>ADD</button>
            </div>
          ) : running ? (
            <button onClick={handleStop} style={{
              width:"100%",padding:8,borderRadius:4,border:"none",
              background:"#4ade80",color:"#0a0a0a",
              fontSize:11,fontWeight:600,cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.08em",
            }}>■ STOP &amp; SAVE</button>
          ) : (
            <button onClick={handleStart} style={{
              width:"100%",padding:8,borderRadius:4,border:"none",
              background:"#e8e4dc",color:"#0a0a0a",
              fontSize:11,fontWeight:600,cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.08em",
            }}>▶ START</button>
          )}
        </div>

        {/* ログリスト */}
        <div style={{background:"#111",border:"1px solid #1a1a1a",borderRadius:8,overflow:"hidden"}}>

          {/* リストヘッダー */}
          <div style={{
            padding:"9px 14px",borderBottom:"1px solid #161616",
            display:"flex",alignItems:"center",justifyContent:"space-between",
          }}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)}
                style={{background:"transparent",border:"none",color:"#4a4a4a",
                  fontSize:11,outline:"none",fontFamily:"inherit",cursor:"pointer"}} />
              <span style={{color:"#1e1e1e"}}>|</span>
              <span style={{fontSize:11,color:"#3a3a3a"}}>{filtered.length}件</span>
              <span style={{fontSize:13,fontWeight:500,color:"#ccc",fontVariantNumeric:"tabular-nums"}}>
                {totalH.toFixed(1)}h
              </span>
            </div>
            {filtered.length > 0 && (
              <button onClick={handleNotionPush} style={{
                padding:"3px 9px",borderRadius:4,border:"1px solid #1e1e1e",
                background:"transparent",color:"#4a4a4a",fontSize:10,
                cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
              }}>↗ Notionへ</button>
            )}
          </div>

          {/* ログ一覧 */}
          {filtered.length === 0 ? (
            <div style={{padding:28,textAlign:"center",color:"#222",fontSize:12}}>
              この日の記録はまだありません
            </div>
          ) : filtered.map((log,i) => (
            <div key={log.id} className="logrow" style={{
              display:"flex",alignItems:"center",gap:9,
              padding:"8px 14px",
              borderBottom: i < filtered.length-1 ? "1px solid #111" : "none",
            }}>
              <div style={{width:3,height:36,borderRadius:2,flexShrink:0,background:catColor(log.category)}} />
              <div style={{flex:1,minWidth:0}}>
                <div style={{
                  fontSize:13,color:"#ccc",fontFamily:"'DM Sans',sans-serif",fontWeight:500,
                  whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                }}>{log.taskName}</div>
                <div style={{fontSize:10,color:"#303030",marginTop:2,display:"flex",gap:7}}>
                  <span style={{color:catColor(log.category)+"66"}}>{short(log.category)}</span>
                  <span>{fmtT(new Date(log.startTs))}〜{fmtT(new Date(log.endTs))}</span>
                  {log.manual && <span style={{color:"#262626"}}>手動</span>}
                </div>
              </div>
              <div style={{
                fontSize:14,fontWeight:500,color:"#ddd",
                fontVariantNumeric:"tabular-nums",flexShrink:0,
              }}>
                {log.hours.toFixed(1)}
                <span style={{fontSize:9,color:"#333",marginLeft:2}}>h</span>
              </div>
              <button className="delbtn" onClick={()=>handleDelete(log.id)} style={{
                opacity:0,background:"transparent",border:"none",color:"#2a2a2a",
                cursor:"pointer",fontSize:12,padding:"2px 4px",
                transition:"opacity 0.12s,color 0.12s",flexShrink:0,
              }}
                onMouseEnter={e=>e.target.style.color="#ef4444"}
                onMouseLeave={e=>e.target.style.color="#2a2a2a"}
              >✕</button>
            </div>
          ))}
        </div>

        {/* チーム今日の合計 */}
        <div style={{
          marginTop:10,padding:"9px 14px",
          background:"#0d0d0d",borderRadius:8,border:"1px solid #131313",
        }}>
          <div style={{fontSize:9,color:"#242424",letterSpacing:"0.12em",marginBottom:7}}>TODAY'S TEAM</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"4px 14px"}}>
            {MEMBERS.map(m => {
              const mH = logs.filter(l=>l.date===filterDate&&l.user===m.id).reduce((s,l)=>s+l.hours,0);
              if (!mH && m.id !== user.id) return null;
              return (
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{
                    fontSize:11,color:m.id===user.id?"#bbb":"#3a3a3a",
                    fontFamily:"'DM Sans',sans-serif",
                  }}>{m.name}</span>
                  <span style={{fontSize:10,color:"#303030",fontVariantNumeric:"tabular-nums"}}>
                    {mH.toFixed(1)}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
