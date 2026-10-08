import {useEffect,useRef} from 'react';
export default function Fig({ex}){const r=useRef(),e=useRef(ex);e.current=ex;
useEffect(()=>{const q=c=>r.current.querySelector(c),n={fa:q('.fa'),tr:q('.tr'),nl:q('.nl'),ar:q('.ar'),hd:q('.hd')};let id;
const f=t=>{const x=e.current,k=(1-Math.cos(2*Math.PI*((t%x.p)/x.p)))/2,v=x.f[0].map((u,i)=>u+(x.f[1][i]-u)*k),p=i=>v[2*i]+','+v[2*i+1];
n.hd.setAttribute('cx',v[0]);n.hd.setAttribute('cy',v[1]);n.tr.setAttribute('points',p(1)+' '+p(2));n.ar.setAttribute('points',p(1)+' '+p(3)+' '+p(4));n.nl.setAttribute('points',p(2)+' '+p(5)+' '+p(6));n.fa.setAttribute('points',p(2)+' '+p(7)+' '+p(8));id=requestAnimationFrame(f)};
id=requestAnimationFrame(f);return()=>cancelAnimationFrame(id)},[]);
return (<svg ref={r} viewBox="0 0 220 130" className="fig"><line className="fl" x1="10" y1="111" x2="210" y2="111"/><polyline className="fa"/><polyline className="tr"/><polyline className="nl"/><polyline className="ar"/><circle className="hd" r="8"/></svg>)}
