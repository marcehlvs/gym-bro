import {useState,useEffect} from 'react';
import {GYM,EX,R,PLAN,D,LV,dkey,dayDate,streak,qrSvg,build} from './data';
import {M,beep,say} from './sound';
import {ld,sv} from './storage';
import {loadDays,saveDay,localKey,isAdmin} from './progress';
import AdminPanel from './components/AdminPanel';
import {hasFirebase,auth} from './firebase';
import {watchUser,logout} from './auth';
import AuthPanel from './components/AuthPanel';
import Fig from './components/Fig';
import Workout from './components/Workout';
export default function App(){
const [lv,setLv]=useState(ld('lv','Principiante')),[sel,setSel]=useState(new Date().getDay()),[mute,setMute]=useState(M.mute),[user,setUser]=useState(undefined),[admin,setAdmin]=useState(false),[view,setView]=useState('app'),[who,setWho]=useState(ld('who','')),[done,setDone]=useState({}),[run,setRun]=useState(null),[fin,setFin]=useState(null),[hi,setHi]=useState(0),[qr,setQr]=useState(false),[url,setUrl]=useState(ld('qrurl',''));
const order=['mc','sq','bi','pl','cr','lr'];
useEffect(()=>{const t=setInterval(()=>setHi(h=>(h+1)%order.length),5000);return()=>clearInterval(t)},[]);
const n=hasFirebase?(user?.name||''):who.trim();
const ukey=hasFirebase?user?.uid:localKey(n);
useEffect(()=>watchUser(u=>setUser(u?{uid:u.uid,name:u.displayName||'',email:u.email}:null)),[]);
useEffect(()=>{if(!ukey){setDone({});return}let ok=true;loadDays(ukey).then(d=>ok&&setDone(d));return()=>{ok=false}},[ukey]);
const refresh=()=>setUser(u=>u?{...u,name:auth.currentUser?.displayName||u.name}:u);
useEffect(()=>{setAdmin(false);if(hasFirebase&&user?.uid)isAdmin(user.uid).then(setAdmin)},[user?.uid]);
const sk=streak(done),wk=Math.min(D.filter((_,i)=>done[dkey(dayDate(i))]).length,5),medal=sk>=7?'Imparable':sk>=5?'Constante':sk>=3?'En marcha':'';
const L=LV[lv],key=PLAN[sel],c=key&&R[key];
const min=c?Math.round(L.s*(c.ex.length*(L.w+L.r)-L.r+L.sr)/60):0;
const finish=()=>{const d={...done,[dkey(new Date())]:1};setDone(d);saveDay(ukey,n,dkey(new Date()),user?.email);[523,659,784,1047].forEach((f,j)=>beep(f,.4,'triangle',.2,j*.18));say('Entrenamiento completo. Excelente trabajo'+(n?', '+n:''));setFin({s:L.s,n:c.ex.length*L.s,m:min,t:Object.keys(d).length,r:streak(d)});setRun(null)};
if(hasFirebase&&user===undefined)return <div className="wrap"><p>Cargando…</p></div>;
  if(hasFirebase&&!user)return <AuthPanel onDone={refresh}/>;
  if(admin&&view==='admin')return <AdminPanel onBack={()=>setView('app')}/>;
  return (<div className="wrap">
<section className="hero"><div className="top"><div className="brand"><span className="logo">{GYM.name[0]}</span>{GYM.name}</div>
<div className="btns"><button onClick={()=>setQr(true)}>QR</button><button onClick={()=>{M.mute=!M.mute;sv('mute',M.mute);setMute(M.mute);beep(600)}}>Sonido: {mute?'no':'sí'}</button></div></div>
<h1>Abdomen fuerte, sin equipo.</h1>
<p>{n?'Hola, '+n+'. Hoy te toca: '+(c?c.n:'descanso activo')+'.':'Rutinas guiadas con animación, voz y pitidos para entrenar en casa entre clases.'}</p>
<div className="stage"><Fig ex={EX[order[hi]]}/><span className="chip">{EX[order[hi]].n}</span></div></section>
<section>
{hasFirebase?(<div className="card userbar"><span>Entrena hoy: <b>{n||user.email}</b></span><div className="btns">{admin&&<button onClick={()=>setView('admin')}>Panel</button>}<button onClick={logout}>Salir</button></div></div>):(<label className="who">¿Quién va a entrenar hoy?<input value={who} placeholder="Escribí tu nombre" maxLength="24" autoComplete="off" onChange={e=>{setWho(e.target.value);sv('who',e.target.value)}}/></label>)}
<div className="pills">{Object.keys(LV).map(k=>(<button key={k} className={k==lv?'sel':''} onClick={()=>{setLv(k);sv('lv',k)}}>{k}</button>))}</div>
<div className="week">{D.map((d,i)=>(<button key={d} className={i==sel?'sel':''} onClick={()=>setSel(i)}>{d}<span>{done[dkey(dayDate(i))]?'✓':PLAN[i]?'•':'–'}</span></button>))}</div>
<div className="card streak"><div><b>{sk}</b>{sk==1?'día':'días'} de racha</div><div><b>{wk}/5</b>entrenamientos esta semana</div>{medal&&(<span className="medal">★ {medal}</span>)}</div>
{c?(<div className="card plan"><div className="band"><h2>{c.n}</h2><div className="stats"><div><b>{L.s}</b>series</div><div><b>{L.w} s</b>trabajo</div><div><b>{L.r} s</b>pausa</div><div><b>{min} min</b>total</div></div></div>
<div className="rows">{c.ex.map(k=>(<div className="row" key={k}><div className="mini"><Fig ex={EX[k]}/></div><div><h3>{EX[k].n}</h3><span className="tag">{EX[k].m}</span><p className="mut">{EX[k].d}</p></div></div>))}
<button className="go" onClick={()=>{beep(1,.01,'sine',0);setRun(build(c,L))}}>Comenzar</button></div></div>)
:(<div className="card"><h2>Descanso activo</h2><p>Hoy toca recuperar: caminá 30 a 40 minutos a paso ligero y hacé 5 minutos de estiramiento suave. El músculo se arma en el descanso.</p></div>)}
<div className="card tips" style={{marginTop:16}}><h2>Para ver resultados</h2><p>La grasa abdominal no se elimina con abdominales: se pierde en todo el cuerpo con un déficit calórico moderado. Los ejercicios fortalecen el abdomen; la alimentación hace que se vea.</p><p>Sumá proteína en cada comida, tomá agua, dormí 7 a 8 horas y caminá a diario. Descansá un día entre entrenamientos duros.</p></div></section>
{run&&(<Workout steps={run} L={L} total={key} name={n} onClose={()=>setRun(null)} onDone={finish}/>)}
{qr&&(<div className="ov" data-t="prep" style={{justifyContent:'center'}}><h2>Escaneá y entrená</h2><div className="qrbox" dangerouslySetInnerHTML={{__html:qrSvg(url||location.href)}}/><label className="who" style={{width:'100%',maxWidth:420,fontSize:20,marginTop:14}}>Link de la app<input value={url||location.href} onChange={e=>{setUrl(e.target.value);sv('qrurl',e.target.value)}}/></label><button onClick={()=>setQr(false)}>Cerrar</button></div>)}
{fin&&(<div className="ov" data-t="prep" style={{justifyContent:'center'}}><h2>{n?'¡Bien ahí, '+n+'!':'¡Entrenamiento completo!'}</h2><p>Entrenamiento completo. Descansá, hidratate y volvé mañana.</p>
<div className="sum"><div><b>{fin.s}</b>series</div><div><b>{fin.n}</b>ejercicios</div><div><b>{fin.t}</b>días entrenados</div><div><b>{fin.r}</b>de racha</div></div><button onClick={()=>setFin(null)}>Volver al inicio</button></div>)}
</div>)}
