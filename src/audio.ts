export type Sound = 'swing'|'hit'|'shield'|'buff'|'buy'|'play'|'select';
/** Short original synthesized effects; the master bus caps volume and has no music loop. */
class GameAudio {
 private context:AudioContext|null=null;
 private bus:GainNode|null=null;
 private enabled=localStorage.getItem('battleSound')!=='off';
 private last=new Map<Sound,number>();
 isEnabled(){return this.enabled;}
 async unlock(){
  try{if(!this.context){this.context=new AudioContext();this.bus=this.context.createGain();this.bus.gain.value=this.enabled ? 0.16 : 0;this.bus.connect(this.context.destination);}if(this.context.state==='suspended')await this.context.resume();}catch{/* Audio unavailable: gameplay remains usable. */}
 }
 setEnabled(enabled:boolean){this.enabled=enabled;localStorage.setItem('battleSound',enabled?'on':'off');if(this.context&&this.bus)this.bus.gain.setTargetAtTime(enabled ? 0.16 : 0,this.context.currentTime,.02);if(enabled)void this.unlock();}
 play(sound:Sound){
  const c=this.context,b=this.bus;if(!this.enabled||!c||!b||c.state!=='running')return;
  const at=c.currentTime;if(at-(this.last.get(sound)||-1)<.08)return;this.last.set(sound,at);
  const tone=(frequency:number,end:number,duration:number,volume:number,delay=0,type:OscillatorType='sine')=>{const o=c.createOscillator(),g=c.createGain(),t=at+delay;o.type=type;o.frequency.setValueAtTime(frequency,t);o.frequency.exponentialRampToValueAtTime(end,t+duration);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(volume,t+.008);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(b);o.start(t);o.stop(t+duration+.01);};
  const noise=(duration:number,frequency:number,volume:number)=>{const buffer=c.createBuffer(1,Math.ceil(c.sampleRate*duration),c.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length);const source=c.createBufferSource(),filter=c.createBiquadFilter(),g=c.createGain();source.buffer=buffer;filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.7;g.gain.setValueAtTime(volume,at);g.gain.exponentialRampToValueAtTime(.001,at+duration);source.connect(filter);filter.connect(g);g.connect(b);source.start(at);};
  if(sound==='swing'){noise(.18,1100,.35);tone(170,75,.12,.1);}
  if(sound==='hit'){noise(.09,650,.65);tone(105,40,.16,.65);}
  if(sound==='shield'){noise(.17,4200,.28);tone(1200,480,.25,.2);tone(1830,900,.17,.13,.02);}
  if(sound==='buff'){tone(520,660,.2,.22);tone(780,990,.24,.15,.06);}
  if(sound==='buy'){tone(1350,950,.09,.25);tone(1900,1400,.13,.16,.045);}
  if(sound==='play'){noise(.1,420,.2);tone(180,90,.12,.28);}
  if(sound==='select')tone(400,650,.09,.14);
 }
}
export const gameAudio=new GameAudio();
