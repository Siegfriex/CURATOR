
import * as Tone from 'tone';
import { AxisData } from '../types';

export class AudioService {
  private synth: Tone.PolySynth | null = null;
  private drone: Tone.Player | null = null;
  private filter: Tone.Filter | null = null;
  private reverb: Tone.Reverb | null = null;
  private isInitialized = false;

  public async initialize() {
    if (this.isInitialized) return;
    
    await Tone.start();
    
    // Setup Reverb
    this.reverb = new Tone.Reverb({ decay: 4, wet: 0.5 }).toDestination();
    
    // Setup Filter
    this.filter = new Tone.Filter(800, "lowpass").connect(this.reverb);

    // Setup Synth (Glassy/Ambient)
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 2,
        decay: 1,
        sustain: 0.5,
        release: 3
      }
    }).connect(this.filter);
    
    this.synth.volume.value = -12; // Keep it subtle

    this.isInitialized = true;
  }

  public playAmbient(metrics: AxisData[]) {
    if (!this.isInitialized || !this.synth) return;

    // Data Sonification Mapping
    // Market Value (High) -> High Pitch (G5, A5)
    // Institutional (High) -> Low Pitch (C2, G2) - Foundation
    // Critical (High) -> Middle Harmonics
    
    const market = metrics.find(m => m.axis === 'Market Value')?.value || 50;
    const institutional = metrics.find(m => m.axis === 'Institutional')?.value || 50;
    const discourse = metrics.find(m => m.axis === 'Critical Acclaim')?.value || 50;

    const chords = [];

    // Institutional Foundation (Bass)
    if (institutional > 80) chords.push("C2", "G2");
    else if (institutional > 50) chords.push("D2", "A2");
    else chords.push("E2");

    // Market Shimmer (Highs)
    if (market > 90) chords.push("G5", "B5");
    else if (market > 70) chords.push("E5", "G5");
    else chords.push("C5");

    // Discourse Texture (Mids)
    if (discourse > 80) chords.push("C4", "E4");
    
    this.synth.triggerAttackRelease(chords, "4n");
  }

  public updateScrollEffect(velocity: number) {
    if (!this.isInitialized || !this.filter || !this.reverb) return;

    // Glitch/Warp effect on fast scroll
    // Normalize velocity (0 to 1 approx)
    const intensity = Math.min(Math.abs(velocity) * 0.01, 1);
    
    // Modulate Filter Frequency
    const baseFreq = 800;
    this.filter.frequency.rampTo(baseFreq + (intensity * 2000), 0.1);
    
    // Modulate Reverb (More space when moving fast)
    // this.reverb.wet.rampTo(0.5 + (intensity * 0.4), 0.1);
  }

  public stop() {
    if (this.synth) {
      this.synth.releaseAll();
    }
  }
}

export const audioService = new AudioService();
