// Dormitory 1st Floor – floor plan data & pathfinding graph
// Coordinates in SVG user-space (viewBox 0 0 1100 700)

export interface RoomDef {
  id: string; label: string;
  type: 'room'|'bathroom'|'laundry'|'lounge'|'office'|'stairs'|'entrance'|'kitchen';
  x: number; y: number; w: number; h: number;
  door: [number, number];
}

export interface Waypoint { id: string; x: number; y: number; }
export interface GraphNode { id: string; x: number; y: number; neighbors: string[]; }

const RW = 100, RH = 90, HALL_Y = 280, HALL_H = 60, GAP = 10;
const TOP_Y = HALL_Y - HALL_H / 2 - RH;
const BOT_Y = HALL_Y + HALL_H / 2;

function topRoom(id: string, label: string, col: number, type: RoomDef['type'] = 'room', w = RW): RoomDef {
  const x = 60 + col * (RW + GAP);
  return { id, label, type, x, y: TOP_Y, w, h: RH, door: [x + w / 2, TOP_Y + RH] };
}
function botRoom(id: string, label: string, col: number, type: RoomDef['type'] = 'room', w = RW): RoomDef {
  const x = 60 + col * (RW + GAP);
  return { id, label, type, x, y: BOT_Y, w, h: RH, door: [x + w / 2, BOT_Y] };
}

export const rooms: RoomDef[] = [
  { id: 'entrance', label: 'Entrance', type: 'entrance', x: 0, y: HALL_Y - HALL_H / 2, w: 60, h: HALL_H, door: [60, HALL_Y] },
  topRoom('101','Room 101',0), topRoom('102','Room 102',1), topRoom('103','Room 103',2),
  topRoom('104','Room 104',3), topRoom('105','Room 105',4),
  topRoom('bath-m',"Men's Bath",5,'bathroom',120),
  topRoom('106','Room 106',6.1), topRoom('107','Room 107',7.1),
  botRoom('ra','RA Office',0,'office'), botRoom('108','Room 108',1),
  botRoom('109','Room 109',2), botRoom('110','Room 110',3), botRoom('111','Room 111',4),
  botRoom('bath-f',"Women's Bath",5,'bathroom',120),
  botRoom('laundry','Laundry',6.1,'laundry'), botRoom('lounge','Lounge',7.1,'lounge'),
  { id: 'stairs', label: 'Stairwell', type: 'stairs', x: 60 + 8.1*(RW+GAP), y: TOP_Y, w: 80, h: RH*2+HALL_H, door: [60+8.1*(RW+GAP), HALL_Y] },
  botRoom('kitchen','Kitchen',8.8,'kitchen'),
];

function hallWaypoints(): Waypoint[] {
  const xs = new Set<number>();
  const pts: Waypoint[] = [];
  for (const r of rooms) {
    const dx = r.door[0];
    if (!xs.has(dx)) { xs.add(dx); pts.push({ id: `hw-${dx}`, x: dx, y: HALL_Y }); }
  }
  return pts.sort((a, b) => a.x - b.x);
}
export const hallway = hallWaypoints();

export const HALL_RECT = { x: 0, y: HALL_Y - HALL_H/2, w: 60 + 9.8*(RW+GAP), h: HALL_H };
