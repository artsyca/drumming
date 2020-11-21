import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { nextPattern, createComposite, genAllPatterns, getResultantPatterns } from '../lib/oliverxu07/drumming/logic';

export default class ApplicationController extends Controller {

  @computed
  get audioContext() {
    let ac;
    if ('webkitAudioContext' in window) {
      // safari
      ac = new webkitAudioContext();
    } else if ('AudioContext' in window) {
      // chrome and firefox, and edge
      ac = new AudioContext();
    } else {
      alert("Audio playback is unsupported by your browser. Please upgrade to the latest version of Chrome, Safari, Edge, or Firefox.");
    }
    return ac;
  }

  drummer1 = [0, 3, 5, -1, 3, -1, 5, 3, 2, -1, 3, -1];
  drummer2 = [5, -1, 3, -1, 5, 3, 2, -1, 3, -1, 0, 3];

  get composite() {
    return createComposite(this.drummer1, this.drummer2);
  }

  get allPatterns() {
    return genAllPatterns(this.composite);
  }

  minNotes = 0;
  maxNotes = 10;
  @tracked numNotes = 6;

  minStableBeats = 0;
  maxStableBeats = 3;
  @tracked numStableBeats = 3;

  minMelodicTurns = 0;
  maxMelodicTurns = 5;
  @tracked numMelodicTurns = 5;

  minTempo = 60;
  maxTempo = 300;
  @tracked tempo = 120;

  @tracked voice;

  get numPossibilities() {
    return this.allPatterns.length;
  }

  @computed('numNotes', 'numStableBeats', 'numMelodicTurns')
  get resultantPatterns () {
    return getResultantPatterns(this.allPatterns, this.numNotes, this.numStableBeats, this.numMelodicTurns, );
  }

  @computed('resultantPatterns')
  get pattern () {
    return nextPattern(this.resultantPatterns);
  }

  set pattern (pattern) {
    return pattern;
  }

  @action
  updateStableBeats(event) {
    this.numStableBeats = event.target.value;
  }

  @action
  updateNotes (event) {
    this.numNotes = event.target.value;
  }

  @action updateMelodicTurns(event) {
    this.numMelodicTurns = event.target.value;
  }

  @action updateTempo(event) {
    this.tempo = event.target.value;
  }

  @action generateNextPattern() {
    this.pattern = nextPattern(this.resultantPatterns);
  }

  @action newVoiceGenerated(voice) {
    this.voice = voice;
  }
}
