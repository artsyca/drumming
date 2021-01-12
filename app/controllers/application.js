import Controller from '@ember/controller';
import {
  action,
  computed
} from '@ember/object';
import {
  collect,
  oneWay,
  gt
} from '@ember/object/computed';
import {
  tracked
} from '@glimmer/tracking';
import {
  getRandomIndex,
  createComposite,
  genAllPatterns,
  getResultantPatterns,
  getMaxNotesFromComposite,
  rotateArray
} from '../lib/oliverxu07/drumming/logic';

export default class ApplicationController extends Controller {

  @computed
  get audioContext() {
    if ('webkitAudioContext' in window) {
      // safari
      return new webkitAudioContext();
    } else if ('AudioContext' in window) {
      // chrome and firefox, and edge
     return new AudioContext();
    } else {
      alert("Audio playback is unsupported by your browser. Please upgrade to the latest version of Chrome, Safari, Edge, or Firefox.");
    }
  }

  drummer1 = [0, 3, 5, -1, 3, -1, 5, 3, 2, -1, 3, -1];

  @computed('phaseValue')
  get drummer2() {
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

  @computed('composite.[]')
  get maxNotes() {
    return getMaxNotesFromComposite(this.composite);
  }

  @computed('maxNotes', '_numNotes')
  get numNotes() {
    return Math.min(this.maxNotes, this._numNotes || 6);
  }

  set numNotes(x) {
    return this._numNotes = x;
  }

  minStableBeats = 0;
  maxStableBeats = 3;
  @tracked numStableBeats = 3;

  minMelodicTurns = 0;
  maxMelodicTurns = 5;
  @tracked numMelodicTurns = 3;

  minTempo = 60;
  maxTempo = 500;
  @tracked tempo = 284;

  @tracked resultantVoice;
  @tracked drummer1Voice;
  @tracked drummer2Voice;

  @tracked phaseValue = 2;
  minPhase = 0;
  maxPhase = 11;

  @computed('numResultantPatterns', '_patternIndex')
  get patternIndex() {
    return Math.min(this.numResultantPatterns - 1, this._patternIndex || 0);
  }

  set patternIndex(x) {
    return this._patternIndex = x;
  }

  @tracked currentPlayer;

  @collect('drummer1Voice', 'drummer2Voice') compositeVoices;

  @computed('allPatterns.length')
  get numPossibilities() {
    return this.allPatterns.length;
  }

  @computed('numNotes', 'numStableBeats', 'numMelodicTurns', 'allPatterns.[]')
  get resultantPatterns() {
    return getResultantPatterns(this.allPatterns, this.numNotes, this.numStableBeats, this.numMelodicTurns);
  }

  @computed('resultantPatterns.[]', 'patternIndex')
  get pattern() {
    return this.resultantPatterns[this.patternIndex];
  }

  @oneWay('resultantPatterns.length') numResultantPatterns;

  @gt('numResultantPatterns', 1) showGeneratePatternButton;

  @action randomizePattern() {
    this.patternIndex = getRandomIndex(this.resultantPatterns);
  }

  @action
  updateStableBeats(event) {
    this.numStableBeats = event.target.value;
  }

  @action
  updateNotes(event) {
    this.numNotes = event.target.value;
  }

  @action updateMelodicTurns(event) {
    this.numMelodicTurns = event.target.value;
  }

  @action updateTempo(event) {
    this.tempo = event.target.value;
  }

  @action resultantVoiceGenerated(voice) {
    this.resultantVoice = voice;
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
    if (this.currentPlayer && this.currentPlayer.isPlaying) {
      this.currentPlayer.pause();
    }
    this.currentPlayer = player;
  }
}
