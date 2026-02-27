
class SoundManager {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) {
      this.stopEngine();
    } else if (this.ctx && !this.engineOsc) {
      this.startEngine();
    }
  }

  startEngine() {
    if (this.muted || this.engineOsc) return;
    this.init();
    if (!this.ctx) return;

    this.engineOsc = this.ctx.createOscillator();
    this.engineGain = this.ctx.createGain();
    this.engineFilter = this.ctx.createBiquadFilter();

    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.setValueAtTime(42, this.ctx.currentTime); // Deep idle freq

    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(120, this.ctx.currentTime);
    this.engineFilter.Q.setValueAtTime(1, this.ctx.currentTime);

    this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.engineGain.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 2); // Fade in

    this.engineOsc.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);

    this.engineOsc.start();
  }

  stopEngine() {
    if (this.engineOsc) {
      this.engineOsc.stop();
      this.engineOsc.disconnect();
      this.engineOsc = null;
    }
  }

  revEngine(active: boolean) {
    if (this.muted || !this.ctx || !this.engineOsc || !this.engineGain || !this.engineFilter) return;

    const now = this.ctx.currentTime;
    const targetFreq = active ? 75 : 42;
    const targetGain = active ? 0.04 : 0.015;
    const targetFilter = active ? 250 : 120;

    this.engineOsc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.4);
    this.engineGain.gain.linearRampToValueAtTime(targetGain, now + 0.4);
    this.engineFilter.frequency.exponentialRampToValueAtTime(targetFilter, now + 0.4);
  }

  playClick() {
    this.init();
    if (this.muted || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playExpand() {
    this.init();
    if (this.muted || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }
}

export const soundManager = new SoundManager();
