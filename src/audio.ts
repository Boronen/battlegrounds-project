import series from './series-audio.json';
export type Sound='swing'|'hit'|'shield'|'buff'|'buy'|'play'|'select';
const files:Record<Sound,string>={swing:'jump',hit:'land',shield:'break',buff:'coin',buy:'coin',play:'fall',select:'walking'};
/** Only downloaded, decoded recordings. Context is unlocked in the input event. */
class GameAudio{
 private enabled=localStorage.getItem('battleSound')!=='off';
 private context:AudioContext|null=null;
 private bus:GainNode|null=null;
 private buffers=new Map<string,Promise<AudioBuffer>>();
 private active=new Set<AudioBufferSourceNode>();
 private last=new Map<string,number>();
 private snippet:AudioBufferSourceNode|null=null;
 private listeners=new Set<(playing:boolean)=>void>();
 private generation=0;
 private snippetGeneration=0;
 private warned=false;
 isEnabled(){return this.enabled;}
 private error(){if(!this.warned){this.warned=true;window.dispatchEvent(new CustomEvent('battleAudioError',{detail:'A hang nem indult el. Kapcsold be újra a Hang gombbal; ellenőrizd a böngésző hangengedélyét.'}));}}
 async unlock(){
  if(!this.enabled)return;
  try{if(!this.context){this.context=new AudioContext();this.bus=this.context.createGain();this.bus.gain.value=.8;this.bus.connect(this.context.destination);}if(this.context.state!=='running')await this.context.resume();for(const file of new Set(Object.values(files)))void this.buffer(`/audio/sfx/${file}.ogg`).catch(()=>{});}catch{this.error();}
 }
 private buffer(url:string){let pending=this.buffers.get(url);if(!pending){pending=fetch(url).then(r=>{if(!r.ok)throw Error(`Audio ${r.status}`);return r.arrayBuffer();}).then(data=>this.context!.decodeAudioData(data)).catch(e=>{this.buffers.delete(url);this.error();throw e;});this.buffers.set(url,pending);}return pending;}
 onSnippet(listener:(playing:boolean)=>void){this.listeners.add(listener);return()=>{this.listeners.delete(listener);};}
 private stopSnippet(){this.snippetGeneration++;if(this.snippet){try{this.snippet.stop();}catch{}this.active.delete(this.snippet);this.snippet=null;}this.listeners.forEach(fn=>fn(false));}
 stop(){this.generation++;for(const source of this.active){try{source.stop();}catch{}}this.active.clear();this.stopSnippet();}
 setEnabled(enabled:boolean){this.enabled=enabled;localStorage.setItem('battleSound',enabled?'on':'off');if(!enabled)this.stop();else{this.warned=false;void this.unlock().then(()=>this.play('select'));}}
 private async sample(url:string,key:string,volume:number,maxSeconds?:number,isSnippet=false){
  if(!this.enabled||!this.context||!this.bus)return;const now=performance.now();if(now-(this.last.get(key)??-1000)<90)return;this.last.set(key,now);
  const generation=this.generation,snippetGeneration=this.snippetGeneration;
  try{const buffer=await this.buffer(url);if(!this.enabled||generation!==this.generation||(isSnippet&&snippetGeneration!==this.snippetGeneration))return;if(this.context.state!=='running'){this.error();return;}
   if(this.active.size>=10){const oldest=this.active.values().next().value;if(oldest){oldest.stop();this.active.delete(oldest);}}
   const source=this.context.createBufferSource(),gain=this.context.createGain();source.buffer=buffer;gain.gain.value=volume;source.connect(gain);gain.connect(this.bus);this.active.add(source);
   source.onended=()=>{this.active.delete(source);source.disconnect();gain.disconnect();if(this.snippet===source){this.snippet=null;this.listeners.forEach(fn=>fn(false));}};
   if(isSnippet){this.snippet=source;this.listeners.forEach(fn=>fn(true));}source.start(0,0,maxSeconds?Math.min(maxSeconds,buffer.duration):buffer.duration);
  }catch{/* Visible error is emitted by the decoder; gameplay continues. */}
 }
 play(sound:Sound){void this.sample(`/audio/sfx/${files[sound]}.ogg`,sound,sound==='hit'?.9:.65);}
 playSeries(tags:string[]){const clip=series.find(c=>tags.includes(c.franchise));if(!clip||!this.enabled)return;this.stopSnippet();void this.sample(clip.file,`series:${clip.franchise}`,.75,clip.maxSeconds,true);}
}
export const gameAudio=new GameAudio();
