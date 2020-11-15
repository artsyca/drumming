import Component from '@glimmer/component';
import Vex from 'vexflow';
import { createLine } from '../lib/oliverxu07/drumming/logic';
import { action } from '@ember/object';
export default class StaveContainerComponent extends Component {

  @action
  renderScore(element, [pattern]) {
    element.innerHTML='';
    if(!pattern) {
      return;
    }
    var vf = new Vex.Flow.Factory({renderer: {
      elementId: element.id,
      width: 500,
      height: 120
    }});
    var score = vf.EasyScore().set({ clef: 'bass', time: '12/8' });
    var newVoice = score.voice(score.notes(createLine(pattern)));
    this.args.newVoiceGenerated(newVoice);

    var system = vf.System();
    system.addStave({
      voices: [
        newVoice
      ]
    }).addClef('bass').addKeySignature('D#m');
    vf.draw();
  }

}
