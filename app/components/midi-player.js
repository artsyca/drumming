import Component from '@glimmer/component';
import MidiPlayer from 'midi-player-js';
import MidiWriter from 'midi-writer-js';
import { VexFlow } from '../lib/midi-writer-js/vexflow';
import { action, computed } from '@ember/object';
import { oneWay, empty } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import Soundfont from 'soundfont-player';
import { run } from '@ember/runloop';
import ENV from 'ember-drumming/config/environment';
import { makeArray } from '@ember/array';

// plays each note
function midiCallback(event, instrument) {
  if (event.name == 'Note on' && event.velocity != 0) {
    instrument.play(event.noteName);
  }
}

export default class MidiPlayerComponent extends Component {

  @tracked instrument;
  @tracked isPlaying = false;

  @oneWay('args.voice') voice;
  @oneWay('args.tempo') tempo;

  @oneWay('args.audioContext') audioContext;
  @empty('instrument') disablePlayButton

  @computed('voice.[]')
  get dataUri () {
    const voice = this.voice;
    if(!voice || voice.length == 0) { return; }
    var vexWriter = new VexFlow();
    var tracks = makeArray(voice).map(v => vexWriter.trackFromVoice(v) );
		var writer = new MidiWriter.Writer(tracks);
    // write MIDI track as dataUri
    return writer.dataUri();
  }

  @computed('instrument')
  get player() {
    if(!this.instrument) {
      return;
    }
    var player = new MidiPlayer.Player((event) => {
      midiCallback(event, this.instrument);
    });
    player.on('endOfFile', () => {
      // Loop track
      run.later(() => {
        this.playerPlay(this.audioContext);
      }, 1);
    });
    return player
  }

  @action
  playerPlay() {
    // load MIDI track into Player
    if(this.isDestroyed || this.isDestroying) {
      return;
    }
    this.player.pause();
    const dataUri = this.dataUri;
    const audioContext = this.audioContext;
    if(!dataUri || !audioContext || this.isDestroyed || this.isDestroying) {
      return;
    }
    this.player.loadDataUri(dataUri);
    this.player.setTempo(this.tempo);
    if (audioContext.state !== 'running') {
      this.audioContext.resume().then(() => {
        run.next(() => { this.playerPlay() });
      })
    }
    else {
      run(() => { this.player.play() });
    }
  }

  @action
  setupInstrument() {
    return Soundfont.instrument(this.audioContext, 'bongos', { nameToUrl: getUrl }).then((bongos) => {
      this.instrument = bongos;
    });

    function getUrl() {
      return ENV.APP.bongoSample;
    }
  }

  @action play() {
    this.args.currentlyPlaying(this);
    this.isPlaying = true;
    this.playerPlay();
  }

  @action pause() {
    this.isPlaying = false;
    this.player.pause();
  }
}
