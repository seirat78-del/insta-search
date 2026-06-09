import { useState, useEffect, useRef } from "react";

// ─── サンプルデータ ────────────────────────────────────────
const SAMPLE_POSTS = [
  { id: "1", url: "https://www.instagram.com/p/sample1/", thumbnail: "https://picsum.photos/seed/recipe1/400/400", title: "エビのガーリックバター炒め", tags: ["エビ", "炒め物", "時短", "夕食"], date: "2024-03-10" },
  { id: "2", url: "https://www.instagram.com/p/sample2/", thumbnail: "https://picsum.photos/seed/recipe2/400/400", title: "アボカドとサーモンのサラダ", tags: ["サーモン", "サラダ", "ヘルシー", "昼食"], date: "2024-03-08" },
  { id: "3", url: "https://www.instagram.com/p/sample3/", thumbnail: "https://picsum.photos/seed/recipe3/400/400", title: "エビチリ本格レシピ", tags: ["エビ", "中華", "辛い", "夕食"], date: "2024-03-05" },
  { id: "4", url: "https://www.instagram.com/p/sample4/", thumbnail: "https://picsum.photos/seed/recipe4/400/400", title: "鶏むね肉のやわらか煮", tags: ["鶏肉", "時短", "夕食", "節約"], date: "2024-03-01" },
  { id: "5", url: "https://www.instagram.com/p/sample5/", thumbnail: "https://picsum.photos/seed/recipe5/400/400", title: "エビとブロッコリーのパスタ", tags: ["エビ", "パスタ", "時短", "昼食"], date: "2024-02-28" },
  { id: "6", url: "https://www.instagram.com/p/sample6/", thumbnail: "https://picsum.photos/seed/recipe6/400/400", title: "豆腐のヘルシー麻婆", tags: ["豆腐", "中華", "ヘルシー", "夕食"], date: "2024-02-25" },
];

const STORAGE_KEY = "insta_posts_v2";
const ADMIN_PASS = "admin123";

function loadPosts() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : SAMPLE_POSTS; }
  catch { return SAMPLE_POSTS; }
}
function savePosts(p) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {} }

function parseCSV(text) {
  const lines = text.trim().split("\n");
  return lines.slice(1).map((line, i) => {
    const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
    if (cols.length < 3) return null;
    return { id: Date.now() + "-" + i, url: cols[0] || "", thumbnail: cols[1] || `https://picsum.photos/seed/${i}/400/400`, title: cols[2] || "無題", tags: cols[3] ? cols[3].split("|").map(t => t.trim()).filter(Boolean) : [], date: cols[4] || new Date().toISOString().slice(0,10) };
  }).filter(Boolean);
}

function exportCSV(posts) {
  const header = "URL,サムネURL,タイトル,タグ(|区切り),日付";
  const rows = posts.map(p => `${p.url},${p.thumbnail},"${p.title}","${p.tags.join("|")}",${p.date}`);
  const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "posts.csv"; a.click();
}

// ─── 色定義 ───────────────────────────────────────────────
const C = { pink: "#E8375A", pinkLight: "rgba(232,55,90,0.1)", pinkBorder: "rgba(232,55,90,0.25)", bg: "#fff9fa", white: "#fff", dark: "#1a1a1a", gray: "#888", grayLight: "#f5f5f5", border: "#ebebeb" };

// ─── TagChip ──────────────────────────────────────────────
function TagChip({ label, active, onClick, onRemove }) {
  return (
    <span onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700,
      cursor: "pointer", userSelect: "none", transition: "all .15s",
      background: active ? C.pink : C.pinkLight,
      color: active ? C.white : C.pink,
      border: `1.5px solid ${active ? C.pink : C.pinkBorder}`,
