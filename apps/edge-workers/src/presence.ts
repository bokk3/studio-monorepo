export interface Env {}

interface Room {
    id: string;
    hostId: string;
    peers: string[];
    lastHeartbeat: number;
}

// Note: In Cloudflare Workers, global variables only persist across requests handled by the same isolate.
// For true global consistency across edges, Durable Objects should be used eventually, but Maps work for MVP zero-cost lobbies.
const activeRooms = new Map<string, Room>();
const STALE_TIMEOUT_MS = 30000;

function cleanupStaleRooms() {
    const now = Date.now();
    for (const [id, room] of activeRooms.entries()) {
        if (now - room.lastHeartbeat > STALE_TIMEOUT_MS) {
            activeRooms.delete(id);
        }
    }
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        cleanupStaleRooms();
        
        const url = new URL(request.url);
        
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                }
            });
        }

        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        };

        if (url.pathname === "/rooms" && request.method === "GET") {
            const roomsList = Array.from(activeRooms.values()).map(r => ({
                id: r.id,
                hostId: r.hostId,
                peerCount: r.peers.length
            }));
            return new Response(JSON.stringify({ rooms: roomsList }), { headers: corsHeaders });
        }

        if (url.pathname === "/heartbeat" && request.method === "POST") {
            try {
                const body: any = await request.json();
                const roomId = body.roomId;
                if (roomId && activeRooms.has(roomId)) {
                    activeRooms.get(roomId)!.lastHeartbeat = Date.now();
                    return new Response(JSON.stringify({ status: "ok" }), { headers: corsHeaders });
                }
            } catch (e) {
                return new Response("Bad Request", { status: 400 });
            }
        }

        if (url.pathname === "/create" && request.method === "POST") {
            try {
                const body: any = await request.json();
                const roomId = body.roomId || crypto.randomUUID().substring(0, 8);
                const hostId = body.hostId;
                
                activeRooms.set(roomId, {
                    id: roomId,
                    hostId: hostId,
                    peers: [hostId],
                    lastHeartbeat: Date.now()
                });
                
                return new Response(JSON.stringify({ roomId, hostId }), { headers: corsHeaders });
            } catch (e) {
                return new Response("Bad Request", { status: 400 });
            }
        }

        return new Response("Not Found", { status: 404 });
    }
};
