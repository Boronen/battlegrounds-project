import {useEffect,useRef,useState} from 'react';
import {HERO_MUSIC} from './hero-media';
import {gameAudio} from './audio';
interface Player {destroy():void;playVideo():void;pauseVideo():void;setVolume(n:number):void}
interface PlayerOptions {videoId?:string;playerVars:Record<string,string|number>;events:{onReady:(event:{target:Player})=>void;onError:()=>void;onAutoplayBlocked:()=>void}}
declare global {interface Window {YT?:{Player:new(el:HTMLElement,options:PlayerOptions)=>Player};onYouTubeIframeAPIReady?:()=>void}}
let ready:Promise<void>|undefined;
function youtubeReady(){return ready??=new Promise<void>((resolve,reject)=>{
 if(window.YT?.Player){resolve();return;}
 const previous=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{previous?.();resolve();};
 const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.onerror=()=>{ready=undefined;reject(Error('YouTube unavailable'));};document.head.append(script);
});}
export function HeroMusicPlayer({heroId,enabled}:{heroId:string|null;enabled:boolean}){
 const music=heroId?HERO_MUSIC[heroId]:undefined;
 const host=useRef<HTMLDivElement>(null),player=useRef<Player|null>(null),liveEnabled=useRef(enabled),playerReady=useRef(false);liveEnabled.current=enabled;
 const [status,setStatus]=useState('A zene betöltése…');
 useEffect(()=>{
  setStatus('A zene betöltése…');if(!music||!host.current||(!music.videoId&&!music.playlistId))return;
  let cancelled=false;playerReady.current=false;const container=host.current;const mount=document.createElement('div');container.append(mount);
  void youtubeReady().then(()=>{if(cancelled)return;player.current=new window.YT!.Player(mount,{videoId:music.videoId,playerVars:{autoplay:1,playsinline:1,controls:1,loop:1,origin:location.origin,...(music.playlistId?{listType:'playlist',list:music.playlistId}:{playlist:music.videoId!})},events:{onReady:({target})=>{if(cancelled)return;playerReady.current=true;target.setVolume(24);if(liveEnabled.current)target.playVideo();else target.pauseVideo();setStatus('Hőshöz választott zene · YouTube');},onError:()=>setStatus('Ez a videó itt nem játszható le. Nyisd meg a forrást.'),onAutoplayBlocked:()=>setStatus('A zene indításához kattints a lejátszóra.')}});}).catch(()=>{if(!cancelled)setStatus('A YouTube nem elérhető. A forrás külön megnyitható.');});
  return()=>{cancelled=true;playerReady.current=false;player.current?.destroy();player.current=null;container.replaceChildren();};
 },[music]);
 useEffect(()=>{if(!playerReady.current)return;if(enabled)player.current?.playVideo();else player.current?.pauseVideo();},[enabled]);
 useEffect(()=>gameAudio.onSnippet(playing=>{if(playerReady.current)player.current?.setVolume(playing?7:24);}),[]);
 if(!music)return null;
 return <section className="hero-music-player" aria-label="Hőszene"><div><strong>♫ Saját zene</strong><p role="status">{status}</p><a href={music.url} target="_blank" rel="noreferrer">{music.label} ↗</a></div><div ref={host} className="youtube-host"/></section>;
}
