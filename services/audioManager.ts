class AudioManager {
  private ctx: AudioContext | null = null;
  private buzzOscillator: OscillatorNode | null = null;
  private buzzGain: GainNode | null = null;
  private lfo: OscillatorNode | null = null; // For that warbling insect sound
  private isInitialized = false;

  constructor() {
    // Lazy init via user interaction
  }

  init() {
    if (this.isInitialized) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Create nodes for the background buzz
    this.buzzOscillator = this.ctx.createOscillator();
    this.buzzGain = this.ctx.createGain();
    this.lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    // Configure Buzz
    this.buzzOscillator.type = 'sawtooth';
    this.buzzOscillator.frequency.value = 600; // Base buzz frequency

    // Configure LFO (to modulate pitch slightly for realism)
    this.lfo.type = 'sine';
    this.lfo.frequency.value = 25; // Fast flutter
    lfoGain.gain.value = 20; // Modulation depth

    // Connect graph: LFO -> Buzz Frequency
    this.lfo.connect(lfoGain);
    lfoGain.connect(this.buzzOscillator.frequency);

    // Connect Buzz -> Main Gain -> Output
    this.buzzOscillator.connect(this.buzzGain);
    this.buzzGain.connect(this.ctx.destination);

    // Initial state
    this.buzzGain.gain.value = 0;
    
    this.buzzOscillator.start();
    this.lfo.start();
    
    this.isInitialized = true;
  }

  resume() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Updates the buzzing sound based on mosquito proximity (scale).
   * @param scale 0.5 (far) to 2.5 (close)
   * @param isDead boolean
   */
  updateBuzz(scale: number, isDead: boolean) {
    if (!this.ctx || !this.buzzGain || !this.buzzOscillator) return;

    if (isDead) {
      this.buzzGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      return;
    }

    // Map scale to volume. 
    // Scale 0.5 -> Volume 0.02
    // Scale 2.5 -> Volume 0.3
    const normalizedScale = (scale - 0.5) / 2; 
    const targetVolume = Math.max(0.01, Math.min(0.3, normalizedScale * 0.15));

    this.buzzGain.gain.setTargetAtTime(targetVolume, this.ctx.currentTime, 0.1);

    // Doppler-ish effect: Lower pitch when bigger/closer? Or constant?
    // Let's vary pitch slightly by speed or scale. Smaller = higher pitch usually.
    // Scale 0.5 = 700Hz, Scale 2.5 = 550Hz
    const targetFreq = 700 - (normalizedScale * 150);
    this.buzzOscillator.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
  }

  playSlapSound() {
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Slap Impact (White noise burst)
    const bufferSize = this.ctx.sampleRate * 0.1; // 0.1 sec buffer
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    
    // Low frequency thud
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    
    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.8, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    noise.start();
    osc.start();
  }

  playSplatSound() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // "Squish" sound - filtered noise with pitch glide
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
  }
}

export const audioManager = new AudioManager();
