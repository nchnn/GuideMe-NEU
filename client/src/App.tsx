import { useState, useMemo } from 'react';
import './App.css';
import { rooms, HALL_RECT, type RoomDef } from './floorData';
import { buildGraph, findPath, pathDistance } from './pathfinding';

const COL: Record<string, string> = {
  room:'#dbeafe', bathroom:'#a5f3fc', laundry:'#fde68a', lounge:'#bbf7d0',
  office:'#fecaca', stairs:'#e9d5ff', entrance:'#fed7aa', kitchen:'#fbcfe8',
};
const ICO: Record<string, string> = {
  room:'🛏️', bathroom:'🚿', laundry:'👕', lounge:'🛋️',
  office:'📋', stairs:'🪜', entrance:'🚪', kitchen:'🍳',
};
const LEG: { t: RoomDef['type']; l: string }[] = [
  {t:'room',l:'Dorm Room'},{t:'bathroom',l:'Bathroom'},{t:'laundry',l:'Laundry'},
  {t:'lounge',l:'Lounge'},{t:'office',l:'RA Office'},{t:'kitchen',l:'Kitchen'},
  {t:'stairs',l:'Stairwell'},{t:'entrance',l:'Entrance'},
];

export default function App() {
  const graph = useMemo(() => buildGraph(), []);
  const [startId, setStartId] = useState('');
  const [endId, setEndId] = useState('');
  const [clickMode, setClickMode] = useState<'start'|'end'>('start');

  const path = useMemo(() => {
    if (!startId || !endId || startId === endId) return null;
    return findPath(graph, startId, endId);
  }, [graph, startId, endId]);

  const totalDist = path ? Math.round(pathDistance(graph, path) * 0.3) : 0;
  const pts = useMemo(() => {
    if (!path) return '';
    return path.map(id => { const n = graph.get(id)!; return `${n.x},${n.y}`; }).join(' ');
  }, [graph, path]);

  function onRoom(id: string) {
    if (clickMode === 'start') { setStartId(id); setClickMode('end'); }
    else { setEndId(id); setClickMode('start'); }
  }
  function clear() { setStartId(''); setEndId(''); setClickMode('start'); }


  return (
    <div className="app">
      <div className="controls">
        <h1>🏢 Dormitory — 1st Floor</h1>
        <label>From:
          <select value={startId} onChange={e => setStartId(e.target.value)}>
            <option value="">Select start…</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </label>
        <label>To:
          <select value={endId} onChange={e => setEndId(e.target.value)}>
            <option value="">Select destination…</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </label>
        <button className="clear-btn" onClick={clear}>Clear</button>
        <span style={{fontSize:12,color:'#9ca3af'}}>💡 Click rooms to pick start/end</span>
      </div>

      <div className="map-container">
        <svg viewBox="-10 120 1120 310" xmlns="http://www.w3.org/2000/svg">
          <rect x="-10" y="120" width="1120" height="310" fill="#1e293b" rx="12"/>
          <rect x={HALL_RECT.x} y={HALL_RECT.y} width={HALL_RECT.w} height={HALL_RECT.h}
                fill="#e5e7eb" stroke="#94a3b8" strokeWidth="1.5" rx="4"/>
          <text x={HALL_RECT.w/2} y={HALL_RECT.y+HALL_RECT.h/2+4}
                textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="600">MAIN HALLWAY</text>

          {rooms.map(r => {
            const isS = r.id === startId, isE = r.id === endId;
            const bg = isS ? '#22c55e' : isE ? '#e94560' : COL[r.type];
            return (
              <g key={r.id} className="room-group" onClick={() => onRoom(r.id)}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h}
                      fill={bg} stroke={isS||isE?'#fff':'#334155'}
                      strokeWidth={isS||isE?2.5:1.2} rx="5"/>
                <line x1={r.door[0]-8} y1={r.door[1]} x2={r.door[0]+8} y2={r.door[1]}
                      stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
                <text x={r.x+r.w/2} y={r.y+r.h/2-6} textAnchor="middle" fontSize="18">{ICO[r.type]}</text>
                <text x={r.x+r.w/2} y={r.y+r.h/2+14} textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="600">{r.label}</text>
                {isS && <text x={r.x+r.w/2} y={r.y-4} textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="700">▶ START</text>}
                {isE && <text x={r.x+r.w/2} y={r.y-4} textAnchor="middle" fontSize="9" fill="#e94560" fontWeight="700">◉ END</text>}
              </g>
            );
          })}

          {path && pts && <>
            <polyline points={pts} className="nav-path"/>
            <circle cx={graph.get(path[0])!.x} cy={graph.get(path[0])!.y} r="6" className="marker-start marker-pulse"/>
            <circle cx={graph.get(path[path.length-1])!.x} cy={graph.get(path[path.length-1])!.y} r="6" className="marker-end marker-pulse"/>
          </>}
        </svg>
      </div>

      <div className="info-bar">
        {LEG.map(l => <span key={l.t} className="legend-item"><span className="legend-swatch" style={{background:COL[l.t]}}/>{l.l}</span>)}
        {path && <span className="distance-info">📏 ~{totalDist}m ({path.length-1} steps)</span>}
        {startId && !endId && <span className="distance-info">👆 Now click destination</span>}
      </div>
    </div>
  );
}
