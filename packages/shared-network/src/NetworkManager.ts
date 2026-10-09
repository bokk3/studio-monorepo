import { Peer, DataConnection } from 'peerjs';

export class NetworkManager {
    private peer: Peer;
    private connection: DataConnection | null = null;
    private dataChannelOpen = false;

    // Buffer to reuse for packing to avoid GC allocation stutter
    private sendBuffer = new ArrayBuffer(16);
    private floatView = new Float32Array(this.sendBuffer);
    private uint8View = new Uint8Array(this.sendBuffer);
    private uint16View = new Uint16Array(this.sendBuffer);

    constructor(
        private peerId: string | undefined,
        private onFrameReceived: (data: ArrayBuffer) => void,
        private onConnected: () => void
    ) {
        this.peer = new Peer(this.peerId || '', {
            debug: 2
        });

        this.peer.on('open', (id) => {
            console.log('Peer connected to broker with ID:', id);
        });

        this.peer.on('connection', (conn) => {
            this.handleConnection(conn);
        });
    }

    public connectToPeer(targetId: string) {
        const conn = this.peer.connect(targetId, {
            reliable: false // UDP-like behavior for game frames
        });
        this.handleConnection(conn);
    }

    private handleConnection(conn: DataConnection) {
        this.connection = conn;
        conn.on('open', () => {
            console.log('Data channel open');
            this.dataChannelOpen = true;
            this.onConnected();
        });

        conn.on('data', (data) => {
            if (data instanceof ArrayBuffer) {
                this.onFrameReceived(data);
            }
        });

        conn.on('close', () => {
            this.dataChannelOpen = false;
            console.log('Data channel closed');
        });
    }

    /**
     * Sends a 16-byte packed binary frame
     */
    public sendBinaryFrame(pitch: number, roll: number, throttle: number, bitmask: number, seqNum: number) {
        if (!this.dataChannelOpen || !this.connection) return;

        // Byte 0-3: Pitch
        this.floatView[0] = pitch;
        // Byte 4-7: Roll
        this.floatView[1] = roll;
        // Byte 8-11: Throttle
        this.floatView[2] = throttle;
        
        // Byte 12: Bitmask (Buttons/Triggers)
        this.uint8View[12] = bitmask;
        
        // Byte 13: Power Mode (Reserved)
        this.uint8View[13] = 0; 
        
        // Byte 14-15: Sequence Number
        this.uint16View[7] = seqNum; // index 7 in uint16 is bytes 14-15

        this.connection.send(this.sendBuffer);
    }
}
