import {useEffect,useMemo,useState} from 'react';
import {GYM,dkey} from '../data';
import {listSocios} from '../progress';

const DAY=864e5;
const at=k=>new Date(k+'T00:00:00');
// Estado según días desde el último entrenamiento: activo hasta 4, en riesgo de 5 a 9, inactivo desde 10.
function info(s){
  const days=Object.keys(s.days||{}).sort(),last=days[days.length-1],today=at(dkey(new Date()));
  const ago=last?Math.round((today-at(last))/DAY):null;
  const wk=days.filter(k=>Math.round((today-at(k))/DAY)<=6).length;
  const st=ago===null||ago>=10?'inactivo':ago>=5?'riesgo':'activo';
  return {id:s.id,name:s.name||'Sin nombre',email:s.email||'',total:days.length,wk,last,ago,st};
}
const LBL={activo:'Activo',riesgo:'En riesgo',inactivo:'Inactivo'};
const agoTxt=a=>a===null?'Nunca entrenó':a===0?'Hoy':a===1?'Ayer':'Hace '+a+' días';

export default function AdminPanel({onBack}){
  const [rows,setRows]=useState(null),[err,setErr]=useState(''),[f,setF]=useState('todos'),[q,setQ]=useState('');
  useEffect(()=>{listSocios().then(l=>setRows(l.map(info))).catch(()=>setErr('No se pudo cargar. Revisá que tu cuenta esté en la colección admins y que las reglas estén publicadas.'))},[]);
  const all=rows||[],cnt=k=>all.filter(r=>r.st===k).length;
  const list=useMemo(()=>all.filter(r=>(f==='todos'||r.st===f)&&r.name.toLowerCase().includes(q.trim().toLowerCase())).sort((a,b)=>(b.ago??999)-(a.ago??999)),[rows,f,q]);
  const csv=()=>{
    const esc=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
    const head=['Nombre','Email','Días entrenados','Últimos 7 días','Última vez','Estado'];
    const body=list.map(r=>[r.name,r.email,r.total,r.wk,r.last||'',LBL[r.st]]);
    const txt='\ufeff'+[head,...body].map(l=>l.map(esc).join(',')).join('\n');
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/csv'}));a.download='socios.csv';a.click();
  };
  return (
    <div className="wrap one">
      <section className="hero">
        <div className="top"><div className="brand"><span className="logo">{GYM.name[0]}</span>{GYM.name}</div>
          <div className="btns"><button onClick={csv} disabled={!list.length}>Descargar CSV</button><button onClick={onBack}>Volver</button></div></div>
        <h1 style={{fontSize:'clamp(40px,8vw,60px)'}}>Panel del entrenador</h1>
        <div className="stats">
          <div><b>{all.length}</b>socios</div><div><b>{cnt('activo')}</b>activos</div>
          <div><b>{cnt('riesgo')}</b>en riesgo</div><div><b>{cnt('inactivo')}</b>inactivos</div>
        </div>
      </section>
      <section className="card">
        <div className="pills">{['todos','activo','riesgo','inactivo'].map(k=><button key={k} className={f===k?'sel':''} onClick={()=>setF(k)}>{k==='todos'?'Todos':LBL[k]}</button>)}</div>
        <label className="who" style={{margin:'12px 0',fontSize:18}}>Buscar socio<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Nombre"/></label>
        <p className="mut">Activo: entrenó en los últimos 4 días. En riesgo: hace 5 a 9 días. Inactivo: 10 días o más. Primero aparecen quienes hace más que no vienen.</p>
        {err&&<p className="err">{err}</p>}
        {!err&&rows===null&&<p>Cargando socios…</p>}
        {!err&&rows&&!list.length&&<p>No hay socios para mostrar.</p>}
        {list.map(r=>(
          <div className="row adm" key={r.id}>
            <div><h3>{r.name}</h3><p className="mut">{r.email||'Sin email'}</p></div>
            <div className="adr"><span className={'bdg st-'+r.st}>{LBL[r.st]}</span>
              <p className="mut">{agoTxt(r.ago)}</p><p className="mut">{r.total} días entrenados, {r.wk} esta semana</p></div>
          </div>
        ))}
      </section>
    </div>
  );
}
