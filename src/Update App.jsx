import { useState, useEffect } from "react";

const SAMPLE = [
  { id: "1", url: "https://www.instagram.com/", thumb: "https://picsum.photos/seed/a/400/400", title: "エビのガーリック炒め", tags: ["エビ", "時短", "夕食"] },
  { id: "2", url: "https://www.instagram.com/", thumb: "https://picsum.photos/seed/b/400/400", title: "サーモンサラダ", tags: ["サーモン", "サラダ", "ヘルシー"] },
  { id: "3", url: "https://www.instagram.com/", thumb: "https://picsum.photos/seed/c/400/400", title: "エビチリ", tags: ["エビ", "中華", "夕食"] },
  { id: "4", url: "https://www.instagram.com/", thumb: "https://picsum.photos/seed/d/400/400", title: "鶏むね肉の煮物", tags: ["鶏肉", "時短", "節約"] },
];

const KEY = "posts_v1";
const PASS = "admin123";
const P = "#E8375A";

function load() {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : SAMPLE; }
  catch { return SAMPLE; }
}
function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {} }

export default function App() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [q, setQ] = useState("");
  const [admin, setAdmin] = useState(false);
  const [loginBox, setLoginBox] = useState(false);
  const [pw, setPw] = useState("");
  const [form, setForm] = useState({ url: "", thumb: "", title: "", tag: "" });
  const [formTags, setFormTags] = useState([]);
  const [tab, setTab] = useState("add");

  useEffect(() => { setPosts(load()); }, []);

  const allTags = [...new Set(posts.flatMap(p => p.tags))].sort();
  const filtered = posts.filter(p => {
    const mt = tags.length === 0 || tags.every(t => p.tags.includes(t));
    const mq = !q || p.title.includes(q) || p.tags.some(t => t.includes(q));
    return mt && mq;
  });

  const toggle = t => setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const addPost = () => {
    if (!form.url || !form.title) return;
    const np = { id: Date.now().toString(), url: form.url, thumb: form.thumb || "https://picsum.photos/seed/" + Date.now() + "/400/400", title: form.title, tags: formTags };
    const u = [np, ...posts]; setPosts(u); save(u);
    setForm({ url: "", thumb: "", title: "", tag: "" }); setFormTags([]);
  };

  const addTag = () => {
    const t = form.tag.trim();
    if (t && !formTags.includes(t)) setFormTags([...formTags, t]);
    setForm({ ...form, tag: "" });
  };

  const del = id => { const u = posts.filter(p => p.id !== id); setPosts(u); save(u); };

  const chip = (label, active, onClick) => (
    <span key={label} onClick={onClick} style={{
      display: "inline-block", padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700,
      cursor: "pointer", margin: "3px", userSelect: "none",
      background: active ? P : "rgba(232,55,90,0.1)",
      color: active ? "#fff" : P,
      border: "1.5px solid " + (active ? P : "rgba(232,55,90,0.3)"),
    }}>{label}</span>
  );

  const inp = (val, set, ph) => (
    <input value={val} onChange={e => set(e.target.value)} placeholder={ph} style={{
      width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10,
      border: "1.5px solid #e0e0e0", fontSize: 14, outline: "none", marginBottom: 10,
    }} />
  );
  if (admin) return (
    <div style={{ minHeight: "100vh", background: "#fff9fa", fontFamily: "sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", position: "sticky", top: 0 }}>
        <button onClick={() => setAdmin(false)} style={{ background: "#f0f0f0", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: 700 }}>← 戻る</button>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>⚙️ 管理</h2>
      </div>
      <div style={{ display: "flex", borderBottom: "1px solid #eee", background: "#fff" }}>
        {[["add", "➕ 追加"], ["list", "📋 一覧"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex: 1, padding: "14px 0", border: "none", background: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, color: tab === k ? P : "#888", borderBottom: tab === k ? "3px solid " + P : "3px solid transparent" }}>{l}</button>
        ))}
      </div>
      <div style={{ padding: 16, maxWidth: 500, margin: "0 auto" }}>
        {tab === "add" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {inp(form.url, v => setForm({ ...form, url: v }), "Instagram URL（必須）")}
            {inp(form.thumb, v => setForm({ ...form, thumb: v }), "サムネURL（任意）")}
            {inp(form.title, v => setForm({ ...form, title: v }), "タイトル（必須）")}
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} onKeyDown={e => e.key === "Enter" && addTag()} placeholder="タグを入力" style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 14, outline: "none" }} />
              <button onClick={addTag} style={{ background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 10, padding: "0 16px", cursor: "pointer", fontWeight: 700 }}>追加</button>
            </div>
            <div style={{ marginBottom: 14 }}>{formTags.map(t => chip("#" + t, true, () => setFormTags(formTags.filter(x => x !== t))))}</div>
            <button onClick={addPost} style={{ width: "100%", background: P, color: "#fff", border: "none", borderRadius: 12, padding: 14, cursor: "pointer", fontWeight: 900, fontSize: 16 }}>＋ 保存</button>
          </div>
        )}
        {tab === "list" && posts.map(p => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", marginBottom: 10, display: "flex", gap: 10, alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <img src={p.thumb} alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
              <p style={{ margin: "3px 0 0", fontSize: 11, color: "#888" }}>{p.tags.map(t => "#" + t).join(" ")}</p>
            </div>
            <button onClick={() => del(p.id)} style={{ background: "none", border: "1px solid #ddd", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#cc4444", fontSize: 12, fontWeight: 700 }}>削除</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fff9fa", fontFamily: "sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "14px 16px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 8px rgba(232,55,90,0.06)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: P }}>🔍 投稿さくっと検索</h1>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#999" }}>タグで過去の投稿をすぐ見つけよう</p>
            </div>
            <button onClick={() => setLoginBox(!loginBox)} style={{ background: "#f5f5f5", border: "none", borderRadius: 10, padding: "8px 14px", cursor: "pointer", fontSize: 12, color: "#666", fontWeight: 700 }}>⚙️</button>
          </div>
          {loginBox && (
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && (pw === PASS ? (setAdmin(true), setLoginBox(false), setPw("")) : alert("パスワードが違います"))} placeholder="管理パスワード" style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 14, outline: "none" }} />
              <button onClick={() => pw === PASS ? (setAdmin(true), setLoginBox(false), setPw("")) : alert("パスワードが違います")} style={{ background: P, color: "#fff", border: "none", borderRadius: 10, padding: "0 16px", cursor: "pointer", fontWeight: 700 }}>入る</button>
            </div>
          )}
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="キーワードで検索..." style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", borderRadius: 12, border: "2px solid rgba(232,55,90,0.25)", fontSize: 15, outline: "none", background: "#fffafc" }} />
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#555" }}>🏷️ タグで絞り込む</p>
            {tags.length > 0 && <button onClick={() => setTags([])} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: P, fontWeight: 700 }}>クリア ✕</button>}
          </div>
          <div>{allTags.map(t => chip("#" + t, tags.includes(t), () => toggle(t)))}</div>
        </div>
        {tags.length > 0 && <p style={{ fontSize: 13, color: P, fontWeight: 600, marginBottom: 12 }}>{filtered.length}件が見つかりました</p>}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#ccc" }}>
            <p style={{ fontSize: 40, margin: "0 0 10px" }}>🫙</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>該当する投稿がありません</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {filtered.map(p => (
              <div key={p.id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", cursor: "pointer" }} onClick={() => window.open(p.url, "_blank")}>
                <div style={{ position: "relative", paddingBottom: "100%" }}>
                  <img src={p.thumb} alt={p.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />
                  <p style={{ position: "absolute", bottom: 8, left: 8, right: 8, margin: 0, color: "#fff", fontWeight: 700, fontSize: 12, lineHeight: 1.3 }}>{p.title}</p>
                </div>
                <div style={{ padding: "8px 8px 10px" }}>
                  {p.tags.map(t => chip("#" + t, tags.includes(t), e => { e.stopPropagation(); toggle(t); }))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

