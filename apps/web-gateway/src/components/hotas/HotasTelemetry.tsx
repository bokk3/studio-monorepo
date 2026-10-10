import React, { useState } from 'react';
import { 
  Activity, 
  Copy, 
  Check, 
  Share2, 
  Wifi, 
  WifiOff, 
  QrCode
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HotasTelemetryProps {
  roomCode: string;
  setRoomCode: (code: string) => void;
  isConnected: boolean;
  packetCount: number;
  packetHz: number;
  latencyMs: number;
  rawFrameBytes: string;
  onConnect: () => void;
}

export const HotasTelemetry: React.FC<HotasTelemetryProps> = ({
  roomCode,
  setRoomCode,
  isConnected,
  packetCount,
  packetHz,
  latencyMs,
  rawFrameBytes,
  onConnect
}) => {
  const [copied, setCopied] = useState(false);
  const [showPairModal, setShowPairModal] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-3 bg-black/60 border border-slate-800/90 rounded-2xl select-none backdrop-blur-md font-mono text-[10px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Connection Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge 
            variant={isConnected ? "default" : "outline"} 
            className={`gap-1.5 py-0.5 px-2.5 ${
              isConnected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'text-slate-400 border-slate-800'
            }`}
          >
            {isConnected ? <Wifi size={12} className="text-emerald-400 animate-pulse" /> : <WifiOff size={12} className="text-amber-400" />}
            {isConnected ? "WEBRTC LINKED" : "STANDALONE TESTBED"}
          </Badge>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-slate-500">ROOM:</span>
            <span className="text-neon-cyan font-bold">{roomCode}</span>
            <button onClick={handleCopyCode} className="text-slate-400 hover:text-white p-0.5">
              {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPairModal(!showPairModal)}
            className="h-6 px-2 text-[10px] border-slate-800 text-slate-300 gap-1 hover:text-neon-cyan"
          >
            <QrCode size={11} />
            Pair Screen
          </Button>
        </div>

        {/* Real-time Packet Telemetry Ticker */}
        <div className="flex items-center gap-3 text-slate-400 flex-wrap">
          <div className="flex items-center gap-1">
            <Activity size={12} className="text-neon-cyan animate-pulse" />
            <span>STREAM: <strong className="text-white">{packetHz} Hz</strong></span>
          </div>

          <div className="flex items-center gap-1">
            <span>PACKETS: <strong className="text-neon-magenta">{packetCount}</strong></span>
          </div>

          <div className="flex items-center gap-1">
            <span>LATENCY: <strong className="text-emerald-400">{latencyMs}ms</strong></span>
          </div>
        </div>
      </div>

      {/* 16-Byte Packed Frame Hex Dump Preview */}
      <div className="mt-2 pt-2 border-t border-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[9px] text-slate-500">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <span className="text-neon-cyan font-bold flex-shrink-0">16-BYTE BINARY:</span>
          <code className="text-slate-300 tracking-wider font-mono bg-black/60 px-1.5 py-0.5 rounded border border-slate-900">
            {rawFrameBytes || "3F 80 00 00 00 00 00 00 42 48 00 00 01 00 00 01"}
          </code>
        </div>
        <span className="text-slate-600 flex-shrink-0">
          Packed float32(Pitch, Roll, Thr) + uint8(Bitmask, Mode) + uint16(Seq)
        </span>
      </div>

      {/* Pairing Modal / Instructions */}
      {showPairModal && (
        <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-white">
            <span className="flex items-center gap-1.5 text-neon-cyan">
              <Share2 size={13} />
              Pair Companion To Desktop Screen
            </span>
            <button onClick={() => setShowPairModal(false)} className="text-slate-500 hover:text-white">
              &times;
            </button>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-light">
            Open Tachyon on your desktop or TV browser. Enter Room Code <strong className="text-neon-cyan">{roomCode}</strong> in the game client settings or scan the QR code to instantly stream 6-DOF gyro telemetry over WebRTC DataChannel with sub-3ms latency.
          </p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={roomCode} 
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="ENTER ROOM CODE"
              className="bg-black border border-slate-800 rounded px-2 py-1 text-xs text-neon-cyan uppercase font-bold focus:outline-none focus:border-neon-cyan"
            />
            <Button size="sm" variant="cyan" onClick={onConnect} className="h-7 text-xs">
              Connect Peer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
