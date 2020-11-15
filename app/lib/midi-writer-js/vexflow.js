import { NoteEvent, Track } from 'midi-writer-js';

class VexFlow {

/**
 * Support for converting VexFlow voice into MidiWriterJS track
 * @return MidiWritier.Track object
 */
trackFromVoice(voice) {
  var track = new Track();
  var wait = [];
  var pitches = [];

  voice.tickables.forEach(tickable => {
    pitches = [];

    if (tickable.noteType === 'n') {
      tickable.keys.forEach(key => {
        // build array of pitches
        pitches.push(this.convertPitch(key));
      });
      track.addEvent(new NoteEvent({pitch: pitches, duration: this.convertDuration(tickable), wait: wait}));
      wait = [];

    } else if (tickable.noteType === 'r') {
      // move on to the next tickable and use this rest as a `wait` property for the next event
      wait.push(this.convertDuration(tickable));
      return;
    }
  });

  // Rests at the end of the track, add a ghost note..
  if(wait.length > 0) {
    track.addEvent(new NoteEvent({pitch: '[E3]', duration: '0', wait, velocity: '0'}));
  }

  return track;
}


	/**
	 * Converts VexFlow pitch syntax to MidiWriterJS syntax
	 * @param pitch string
	 */
	convertPitch(pitch) {
		return pitch.replace('/', '');
	}


	/**
	 * Converts VexFlow duration syntax to MidiWriterJS syntax
	 * @param note struct from VexFlow
	 */
	convertDuration(note) {
		switch (note.duration) {
			case 'w':
				return '1';
			case 'h':
				return note.isDotted() ? 'd2' : '2';
			case 'q':
				return note.isDotted() ? 'd4' : '4';
			case '8':
				return note.isDotted() ? 'd8' : '8';
		}

		return note.duration;
	}
}

export { VexFlow };
