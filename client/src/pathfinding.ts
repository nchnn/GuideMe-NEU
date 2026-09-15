import { rooms, hallway, type GraphNode } from './floorData';
export type { GraphNode };

function dist(a: GraphNode, b: GraphNode) { return Math.hypot(a.x - b.x, a.y - b.y); }

export function buildGraph(): Map<string, GraphNode> {
  const g = new Map<string, GraphNode>();
  const add = (id: string, x: number, y: number) => { if (!g.has(id)) g.set(id, { id, x, y, neighbors: [] }); };
  const edge = (a: string, b: string) => { g.get(a)!.neighbors.push(b); g.get(b)!.neighbors.push(a); };

  for (const wp of hallway) add(wp.id, wp.x, wp.y);
  for (let i = 0; i < hallway.length - 1; i++) edge(hallway[i].id, hallway[i + 1].id);

  for (const r of rooms) {
    add(r.id, r.x + r.w / 2, r.y + r.h / 2);
    const hwId = `hw-${r.door[0]}`;
    const doorId = `door-${r.id}`;
    add(doorId, r.door[0], r.door[1]);
    edge(r.id, doorId);
    if (g.has(hwId)) {
      edge(doorId, hwId);
    } else {
      let best = hallway[0];
      let bd = Infinity;
      for (const wp of hallway) { const d = Math.abs(wp.x - r.door[0]); if (d < bd) { bd = d; best = wp; } }
      edge(doorId, best.id);
    }
  }
  return g;
}

export function findPath(graph: Map<string, GraphNode>, startId: string, endId: string): string[] | null {
  const start = graph.get(startId), end = graph.get(endId);
  if (!start || !end) return null;

  const open = new Set([startId]);
  const from = new Map<string, string>();
  const gS = new Map<string, number>([[startId, 0]]);
  const fS = new Map<string, number>([[startId, dist(start, end)]]);

  while (open.size) {
    let cur = '', best = Infinity;
    for (const id of open) { const f = fS.get(id) ?? Infinity; if (f < best) { best = f; cur = id; } }
    if (cur === endId) {
      const path = [cur]; let c = cur;
      while (from.has(c)) { c = from.get(c)!; path.unshift(c); }
      return path;
    }
    open.delete(cur);
    const node = graph.get(cur)!;
    for (const nid of node.neighbors) {
      const nb = graph.get(nid)!;
      const tg = (gS.get(cur) ?? Infinity) + dist(node, nb);
      if (tg < (gS.get(nid) ?? Infinity)) {
        from.set(nid, cur); gS.set(nid, tg); fS.set(nid, tg + dist(nb, end)); open.add(nid);
      }
    }
  }
  return null;
}

export function pathDistance(graph: Map<string, GraphNode>, path: string[]): number {
  let d = 0;
  for (let i = 0; i < path.length - 1; i++) {
    d += dist(graph.get(path[i])!, graph.get(path[i + 1])!);
  }
  return d;
}
