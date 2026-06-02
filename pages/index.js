import { useState, useRef, useEffect } from "react";
import Head from "next/head";

function renderLines(text, size) {
  const str = String(text || "").trim();
  const words = str.split(/\s+/);
  const ar = words.filter(w => /[\u0600-\u06FF]/.test(w));
  const en = words.filter(w => !/[\u0600-\u06FF]/.test(w) && w.length > 0);
  let lines = [];
  if (ar.length && en.length) lines = [ar.join(" "), en.join(" ")];
  else if (str.length <= 14) lines = [str];
  else { const m = Math.ceil(words.length / 2); lines = [words.slice(0,m).join(" "), words.slice(m).join(" ")]; }
  const lh = size * 1.38;
  const sy = lines.length > 1 ? 88 - lh/2 : 88;
  return lines.map((line, i) => ({ line, y: sy + i*lh, isAr: /[\u0600-\u06FF]/.test(line) }));
}

const Prev = {
  neon: ({text,color:c="#ff2d78"}) => { const L=renderLines(text,25); return <svg viewBox="0 0 280 160" width="100%" height="100%"><rect width="280" height="160" fill="#03030c"/><ellipse cx="140" cy="80" rx="118" ry="54" fill={c} fillOpacity="0.07"/>{L.map(({line,y,isAr},i)=><text key={i} x="140" y={y} textAnchor="middle" fontFamily={isAr?"Cairo,sans-serif":"Georgia,serif"} fontSize={25} fontWeight="bold" fill={c} style={{filter:`drop-shadow(0 0 8px ${c}) drop-shadow(0 0 22px ${c})`}}>{line}</text>)}</svg>; },
  wood: ({text,color:c="#c9a84c"}) => { const L=renderLines(text,23); return <svg viewBox="0 0 280 160" width="100%" height="100%"><rect width="280" height="160" fill="#110802"/><rect x="5" y="5" width="270" height="150" rx="6" fill="#1c0c04" stroke="#5c2a0a" strokeWidth="1.8"/>{[20,34,48,62,76,90,104,118,132,146].map((y,i)=><line key={i} x1="8" y1={y} x2="272" y2={y+1.5} stroke="#28100a" strokeWidth="0.85"/>)}{L.map(({line,y,isAr},i)=><text key={i} x="140" y={y} textAnchor="middle" fontFamily={isAr?"Cairo,sans-serif":"Georgia,serif"} fontSize={23} fontWeight="bold" fill={c}>{line}</text>)}</svg>; },
  acrylic: ({text,color:c="#00d4ff"}) => { const L=renderLines(text,21); return <svg viewBox="0 0 280 160" width="100%" height="100%"><rect width="280" height="160" fill="#04040f"/><rect x="8" y="12" width="264" height="136" rx="13" fill={c} fillOpacity="0.05" stroke={c} strokeWidth="1.3" strokeOpacity="0.48"/>{L.map(({line,y,isAr},i)=><text key={i} x="140" y={y} textAnchor="middle" fontFamily={isAr?"Cairo,sans-serif":"Arial Black,sans-serif"} fontSize={21} fontWeight="900" fill={c} letterSpacing="2">{line}</text>)}</svg>; },
  "3d": ({text,color:c="#c9a84c"}) => { const L=renderLines(text,22); return <svg viewBox="0 0 280 160" width="100%" height="100%"><defs><linearGradient id="g3d" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c}/><stop offset="65%" stopColor={c} stopOpacity="0.75"/><stop offset="100%" stopColor={c} stopOpacity="0.25"/></linearGradient></defs><rect width="280" height="160" fill="#080604"/><rect x="7" y="7" width="266" height="146" rx="5" fill="#120e06" stroke={c} strokeWidth="0.6" strokeOpacity="0.2"/>{L.map(({line,y,isAr},i)=><g key={i}>{[8,7,6,5,4,3,2,1].map(d=><text key={d} x={140+d*0.75} y={y+d*0.85} textAnchor="middle" fontFamily={isAr?"Cairo,sans-serif":"Arial Black,sans-serif"} fontSize={23} fontWeight="900" fill={c} fillOpacity={0.045+d*0.022}>{line}</text>)}<text x="140" y={y} textAnchor="middle" fontFamily={isAr?"Cairo,sans-serif":"Arial Black,sans-serif"} fontSize={23} fontWeight="900" fill="url(#g3d)">{line}</text></g>)}</svg>; },
  uv: ({text}) => { const L=renderLines(text,21); return <svg viewBox="0 0 280 160" width="100%" height="100%"><rect width="280" height="160" fill="#eee5d2"/><rect x="5" y="5" width="270" height="150" fill="#e4dbc8"/><circle cx="42" cy="36" r="30" fill="#c9a84c" fillOpacity="0.5"/><circle cx="238" cy="124" r="38" fill="#ff6b35" fillOpacity="0.3"/>{L.map(({line,y,isAr},i)=><text key={i} x="140" y={y} textAnchor="middle" fontFamily={isAr?"Cairo,sans-serif":"Georgia,serif"} fontSize={21} fontWeight="bold" fill="#1a1008">{line}</text>)}</svg>; },
  laser: ({text,color:c="#d4824c"}) => { const L=renderLines(text,22); return <svg viewBox="0 0 280 160" width="100%" height="100%"><rect width="280" height="160" fill="#0e0704"/><rect x="5" y="5" width="270" height="150" rx="6" fill="#190c04" stroke="#5c2e0a" strokeWidth="1.5"/>{[20,34,48,62,76,90,104,118,132,146].map((y,i)=><line key={i} x1="8" y1={y} x2="272" y2={y+1} stroke="#240e05" strokeWidth="0.7"/>)}{L.map(({line,y,isAr},i)=><text key={i} x="140" y={y} textAnchor="middle" fontFamily={isAr?"Cairo,sans-serif":"Georgia,serif"} fontSize={22} fontWeight="bold" fill={c}>{line}</text>)}</svg>; },
  metal: ({text,color:c="#b0bec8"}) => { const L=renderLines(text,21); return <svg viewBox="0 0 280 160" width="100%" height="100%"><defs><linearGradient id="gmetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e2838"/><stop offset="45%" stopColor="#2e3e52"/><stop offset="100%" stopColor="#141c26"/></linearGradient></defs><rect width="280" height="160" fill="url(#gmetal)"/><rect x="8" y="8" width="264" height="144" fill="none" stroke={c} strokeWidth="1.1" strokeOpacity="0.3"/>{L.map(({line,y,isAr},i)=><text key={i} x="140" y={y} textAnchor="middle" fontFamily={isAr?"Cairo,sans-serif":"Arial Black,sans-serif"} fontSize={21} fontWeight="900" fill={c} letterSpacing="3">{line}</text>)}</svg>; },
};

function parseCards(text) {
  const m = text.match(/```json\s*([\s\S]*?)```/);
  if (!m) return [];
  try { const arr=JSON.parse(m[1].trim()); if(!Array.isArray(arr)) return []; return arr.map((d,i)=>({id:`c${Date.now()}${i}`,name:d.name||`تصميم ${i+1}`,type:(d.type||"wood").toLowerCase(),color:d.color||null,label:d.label||"مشروعك",price:Number(d.price)||250,time:d.time||"3-5 أيام",desc:d.desc||""})); } catch { return []; }
}
function cleanText(raw) { return raw.replace(/```json[\s\S]*?```/g,"").trim(); }

function Card({d,selected,onSelect}) {
  const Preview=Prev[d.type]||Prev.wood;
  const [hov,setHov]=useState(false);
  return <div onClick={onSelect} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{width:200,flexShrink:0,borderRadius:10,overflow:"hidden",cursor:"pointer",border:selected?"2px solid #c9a84c":`1px solid ${hov?"#3a3218":"#1c1808"}`,background:"#0c0a05",transition:"all .22s",transform:hov&&!selected?"translateY(-3px)":"none",boxShadow:selected?"0 0 24px rgba(201,168,76,.25)":hov?"0 8px 28px rgba(0,0,0,.5)":"none"}}><div style={{height:126}}><Preview text={d.label} color={d.color}/></div><div style={{padding:"10px 13px",borderTop:"1px solid #1c1808",background:"#0a0805"}}><div style={{fontSize:12,color:"#a89060",fontWeight:700,marginBottom:3}}>{d.name}</div>{d.desc&&<div style={{fontSize:11,color:"#5a5028",marginBottom:6,lineHeight:1.4}}>{d.desc}</div>}<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:15,color:"#c9a84c",fontWeight:800}}>{d.price} د.إ</span><span style={{fontSize:10,color:"#484030"}}>⏱ {d.time}</span></div></div></div>;
}

function Av({ai}) { return <div style={{width:36,height:36,flexShrink:0,marginTop:2,border:`1px solid ${ai?"rgba(201,168,76,.2)":"rgba(255,100,50,.18)"}`,background:ai?"rgba(201,168,76,.06)":"rgba(255,100,50,.05)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:ai?14:13,borderRadius:6}}>{ai?"✦":"👤"}</div>; }

function Typing() { return <div style={{display:"flex",gap:10}}><Av ai/><div style={{background:"#0e0c06",border:"1px solid #1c1808",borderRadius:"3px 10px 10px 10px",padding:"12px 16px",display:"flex",gap:6,alignItems:"center"}}>{[0,1,2].map(i=><span
