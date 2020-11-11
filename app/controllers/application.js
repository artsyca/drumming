import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {

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
  maxTempo = 500;
  @tracked tempo = 324;

  numPossibilities = 11664;

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
}
