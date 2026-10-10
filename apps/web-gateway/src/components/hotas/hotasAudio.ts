/**
 * Tachyon HOTAS Audio Synthesizer
 * 100% Client-side procedural Web Audio API sounds.
 * Zero external audio assets, zero latency, runs offline.
 */

class HotasAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Continuous Thruster Sound Nodes
  private thrusterOsc: OscillatorNode | null = null;
  private thrusterSubOsc: OscillatorNode | null = null;
  private thrusterGain: GainNode | null = null;
  private thrusterLfo: OscillatorNode | null = null;

  // Missile Lock Loop
  private missileLockInterval: any = null;
  private isLocking: boolean = false;

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    } catch {
      // AudioContext not supported
    }
  }

  public ensureRunning() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Continuous dynamic thruster engine rumble
   */
  public updateThrusterHum(throttle: number, boost: boolean) {
    if (this.isMuted) {
      this.stopThrusterHum();
      return;
    }
    this.ensureRunning();
    if (!this.ctx || !this.masterGain) return;

    if (throttle <= 0 && !boost) {
      this.stopThrusterHum();
      return;
    }

    if (!this.thrusterOsc) {
      // Create thruster oscillators
      this.thrusterOsc = this.ctx.createOscillator();
      this.thrusterSubOsc = this.ctx.createOscillator();
      this.thrusterGain = this.ctx.createGain();
      this.thrusterLfo = this.ctx.createOscillator();

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(8, this.ctx.currentTime);

      this.thrusterOsc.type = 'sawtooth';
      this.thrusterSubOsc.type = 'triangle';
      this.thrusterLfo.type = 'sine';
      this.thrusterLfo.frequency.setValueAtTime(6, this.ctx.currentTime);

      this.thrusterLfo.connect(lfoGain);
      lfoGain.connect(this.thrusterOsc.frequency);

      this.thrusterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.thrusterOsc.connect(this.thrusterGain);
      this.thrusterSubOsc.connect(this.thrusterGain);
      this.thrusterGain.connect(this.masterGain);

      this.thrusterOsc.start();
      this.thrusterSubOsc.start();
      this.thrusterLfo.start();
    }

    const baseFreq = boost ? 260 : 55 + (throttle / 100) * 160;
    const targetGain = boost ? 0.12 : 0.02 + (throttle / 100) * 0.06;

    if (this.thrusterOsc && this.thrusterSubOsc && this.thrusterGain && this.ctx) {
      this.thrusterOsc.frequency.setTargetAtTime(baseFreq, this.ctx.currentTime, 0.1);
      this.thrusterSubOsc.frequency.setTargetAtTime(baseFreq * 0.5, this.ctx.currentTime, 0.1);
      this.thrusterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    }
  }

  public stopThrusterHum() {
    if (this.thrusterGain && this.ctx) {
      this.thrusterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    }
  }

  /**
   * Tactical haptic notch sound when sliding past 0, 25, 50, 75, 100%
   */
  public playDetentTick() {
    if (this.isMuted) return;
    this.ensureRunning();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  }

  /**
   * Primary Kinetic Cannon Fire
   */
  public playKineticShot() {
    if (this.isMuted) return;
    this.ensureRunning();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(850, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.07);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  /**
   * Pulse Laser Fire
   */
  public playLaserShot() {
    if (this.isMuted) return;
    this.ensureRunning();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.09);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  /**
   * Gauss Railgun Discharge
   */
  public playRailgunShot() {
    if (this.isMuted) return;
    this.ensureRunning();
    if (!this.ctx || !this.masterGain) return;

    // Sub-bass impact
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(80, this.ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.25);
    subGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    // High metal snap
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snapOsc.type = 'sawtooth';
    snapOsc.frequency.setValueAtTime(2400, this.ctx.currentTime);
    snapOsc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.08);
    snapGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    snapGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    snapOsc.connect(snapGain);
    snapGain.connect(this.masterGain);

    subOsc.start();
    subOsc.stop(this.ctx.currentTime + 0.25);
    snapOsc.start();
    snapOsc.stop(this.ctx.currentTime + 0.08);
  }

  /**
   * Missile lock tone (progressive beep or solid tone)
   */
  public startMissileLockTone(isSolidLock: boolean = false) {
    if (this.isMuted || this.isLocking) return;
    this.ensureRunning();
    this.isLocking = true;

    if (isSolidLock) {
      if (this.ctx && this.masterGain) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(900, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        setTimeout(() => {
          try {
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + 0.05);
            osc.stop(this.ctx!.currentTime + 0.05);
          } catch {}
        }, 300);
      }
    } else {
      let intervalMs = 180;
      this.missileLockInterval = setInterval(() => {
        if (!this.ctx || !this.masterGain || this.isMuted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(700, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      }, intervalMs);
    }
  }

  public stopMissileLockTone() {
    this.isLocking = false;
    if (this.missileLockInterval) {
      clearInterval(this.missileLockInterval);
      this.missileLockInterval = null;
    }
  }

  /**
   * Countermeasure Flare Release
   */
  public playFlareRelease() {
    if (this.isMuted) return;
    this.ensureRunning();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  /**
   * Horizon Tare / Re-zero Chime
   */
  public playTareChime() {
    if (this.isMuted) return;
    this.ensureRunning();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.1, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start(now);
    osc1.stop(now + 0.12);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.09);
    gain2.gain.setValueAtTime(0.12, now + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start(now + 0.09);
    osc2.stop(now + 0.25);
  }
}

export const hotasAudio = new HotasAudioEngine();
