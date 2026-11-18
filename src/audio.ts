import series from './series-audio.json';
export type Sound = 'swing'|'hit'|'shield'|'buff'|'buy'|'play'|'select';
const files:Record<Sound,string>={swing:'jump',hit:'land',shield:'break',buff:'coin',buy:'coin',play:'fall',select:'walking'};
/** Downloaded samples only. No synthesized fallback. */
class GameAudio {
 private enabled=localStorage.getItem('battleSound')!=='off';
 private active=new Set<HTMLAudioElement>();
 private last=new Map<string,number>();
 private snippet:HTMLAudioElement|null=null;
 private snippetTimer:ReturnType<typeof setTimeout>|undefined;
 private listeners=new Set<(playing:boolean)=>void>();
 isEnabled(){return this.enabled;}
 async unlock(){}
 onSnippet(listener:(playing:boolean)=>void){this.listeners.add(listener);return()=>{this.listeners.delete(listener);};}
 private stopSnippet(){if(this.snippet){this.snippet.pause();this.active.delete(this.snippet);this.snippet=null;}clearTimeout(this.snippetTimer);this.listeners.forEach(fn=>fn(false));}
 stop(){this.active.forEach(a=>a.pause());this.active.clear();this.stopSnippet();}
 setEnabled(enabled:boolean){this.enabled=enabled;localStorage.setItem('battleSound',enabled?'on':'off');if(!enabled)this.stop();}
 private sample(url:string,key:string,volume:number,maxSeconds?:number){
  if(!this.enabled)return null;const now=performance.now();if(now-(this.last.get(key)??-1000)<90)return null;this.last.set(key,now);
  if(this.active.size>=10){const oldest=this.active.values().next().value;if(oldest){oldest.pause();this.active.delete(oldest);}}
  const a=new Audio(url);a.volume=volume;this.active.add(a);
  const done=()=>{this.active.delete(a);if(this.snippet===a)this.stopSnippet();};
  a.onended=done;a.onerror=done;void a.play().catch(done);
  if(maxSeconds)this.snippetTimer=setTimeout(()=>{a.pause();done();},maxSeconds*1000);
  return a;
 }
 play(sound:Sound){this.sample(`/audio/sfx/${files[sound]}.ogg`,sound,sound==='hit'?.55:.3);}
 playSeries(tags:string[]){const clip=series.find(c=>tags.includes(c.franchise));if(!clip||!this.enabled)return;this.stopSnippet();this.snippet=this.sample(clip.file,`series:${clip.franchise}`,.48,clip.maxSeconds);if(this.snippet)this.listeners.forEach(fn=>fn(true));}
}
export const gameAudio=new GameAudio();
