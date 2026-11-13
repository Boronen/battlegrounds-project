export function attackMotion(from:{x:number;y:number},to:{x:number;y:number}){
 const dx=to.x-from.x,dy=to.y-from.y,length=Math.hypot(dx,dy)||1;
 return {dx,dy,recoilX:dx/length*9,recoilY:dy/length*9};
}
