import {useState,useEffect,useRef} from 'react';
import {EX,R} from '../data';
import {beep,say} from '../sound';
import Fig from './Fig';
export default function Workout({steps,L,total,name,onClose,onDone}){
const [i,setI]=useState(0),[sec,setSec]=useState(steps[0].d),[fr,setFr]=useState(1),[pz,setPz]=useState(false);
const R_=useRef({i:0,rem:steps[0].d*1000,last:performance.now(),ls:-1,pz:false});
const enter=k=>{const st=steps[k],e=EX[st.k],r=R_.current;r.i=k;r.rem=st.d*1000;r.last=performance.now();r.ls=-1;setI(k);setSec(st.d);setFr(1);
if(st.t=='prep'){beep(440,.2);if(name)say('Vamos, '+name)}
if(st.t=='work'){beep(1320,.5,'square',.16);say(e.n)}
if(st.t=='rest'){beep(330,.3);say('Descanso')}
if(st.t=='sr'){[523,659,784].forEach((f,j)=>beep(f,.3,'triangle',.2,j*.15));say('Serie completa. Descansá')}};
const go=()=>{const k=R_.current.i+1;k>=steps.length?onDone():enter(k)};
useEffect(()=>{enter(0);const iv=setInterval(()=>{const r=R_.current;if(r.pz)return;const n=performance.now();r.rem-=n-r.last;r.last=n;if(r.rem<=0)return go();
const st=steps[r.i],sc=Math.ceil(r.rem/1000);if(sc!==r.ls){r.ls=sc;if(sc<=3)st.t=='work'?beep(880,.18,'square',.14):beep(520,.14,'sine',.22);setSec(sc)}setFr(r.rem/(st.d*1000))},200);
return()=>{clearInterval(iv);try{speechSynthesis.cancel()}catch(e){}}},[]);
const st=steps[i],e=EX[st.k];
const T={prep:['Preparate','Primero: '+e.n],work:[e.n,e.d],rest:['Descanso','Siguiente: '+e.n],sr:['Descanso entre series','Siguiente serie: '+e.n]}[st.t];
const n=R[total].ex.length;
return (<div className="ov" data-t={st.t}>
<div className="top"><span>{st.t=='sr'?'Serie '+st.s+' completada':'Serie '+st.s+' de '+L.s}</span><button onClick={onClose}>Salir</button></div>
<h2>{T[0]}</h2><p className="ds">{T[1]}</p>
<div className="stage"><Fig ex={e}/></div>
<div className="dots">{Array.from({length:n},(_,j)=>(<i key={j} className={j<=st.j&&st.t!='sr'?'on':''}/>))}</div>
<div className="ringw"><svg viewBox="0 0 120 120"><circle className="rb" cx="60" cy="60" r="52"/><circle className="rg" cx="60" cy="60" r="52" transform="rotate(-90 60 60)" style={{strokeDashoffset:327*(1-fr)}}/></svg><div className="big">{sec}</div></div>
<div className="ctl"><button onClick={()=>{const r=R_.current;r.pz=!r.pz;r.last=performance.now();setPz(r.pz)}}>{pz?'Seguir':'Pausar'}</button><button onClick={go}>Saltar</button></div></div>)}
