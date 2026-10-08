import {ld} from './storage';
// sonido
export const M={mute:ld('mute',false)};let ac;
export function beep(f,d=.12,ty='sine',v=.2,w=0){if(M.mute)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain(),s=ac.currentTime+w;o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(.001,s+d);o.connect(g);g.connect(ac.destination);o.start(s);o.stop(s+d)}catch(e){}}
export const say=t=>{if(M.mute||!window.speechSynthesis)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='es-AR';speechSynthesis.speak(u)}catch(e){}};
