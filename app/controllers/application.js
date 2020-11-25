import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { collect } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import { nextPattern, createComposite, genAllPatterns, getResultantPatterns } from '../lib/oliverxu07/drumming/logic';

function rotateArray(arr, n) {
  return arr.slice(n, arr.length).concat(arr.slice(0, n));
}
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

  @computed('phaseValue')
  get drummer2 () {
    return rotateArray(this.drummer1, this.phaseValue);
  }

  @computed('drummer2.[]')
  get composite() {
    return createComposite(this.drummer1, this.drummer2);
  }

  @computed('drummer2.[]')
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
  @tracked drummer1Voice;
  @tracked drummer2Voice;

  @tracked phaseValue = 2;
  minPhase = 1;
  maxPhase = 11;

  @tracked patternIndex = 0;

  @tracked currentPlayer;

  @collect('drummer1Voice', 'drummer2Voice', 'voice') compositeVoices;

  get numPossibilities() {
    return this.allPatterns.length;
  }

  @computed('numNotes', 'numStableBeats', 'numMelodicTurns', 'allPatterns.[]')
  get resultantPatterns () {
    return getResultantPatterns(this.allPatterns, this.numNotes, this.numStableBeats, this.numMelodicTurns, );
  }

  @computed('resultantPatterns.[]', 'patternIndex')
  get pattern () {
    return this.resultantPatterns[this.patternIndex];
  }

  @action randomizePattern() {
    const patterns = this.resultantPatterns || [];
    this.patternIndex = Math.floor(Math.random() * patterns.length);
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

  @action newVoiceGenerated(voice) {
    this.voice = voice;
  }

  @action drummer1VoiceGenerated(voice) {
    this.drummer1Voice = voice;
  }

  @action drummer2VoiceGenerated(voice) {
    this.drummer2Voice = voice;
  }

  @action updatePhase(event) {
    this.phaseValue = event.target.value;
  }

  @action currentlyPlaying(player) {
    if(this.currentPlayer && this.currentPlayer.isPlaying) {
      this.currentPlayer.pause();
    }
    this.currentPlayer = player;
  }
}
