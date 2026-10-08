import {useState} from 'react';
import {GYM} from '../data';
import {register,login,resetPass,authError} from '../auth';
export default function AuthPanel({onDone}){
  const [mode,setMode]=useState('in'),[name,setName]=useState(''),[email,setEmail]=useState(''),[pass,setPass]=useState('');
  const [err,setErr]=useState(''),[info,setInfo]=useState(''),[busy,setBusy]=useState(false);
  const reg=mode==='up';
  const submit=async e=>{
    e.preventDefault();setErr('');setInfo('');
    if(reg&&name.trim().length<2)return setErr('Escribí tu nombre.');
    setBusy(true);
    try{if(reg){await register(name,email.trim(),pass);onDone()}else await login(email.trim(),pass)}
    catch(x){setErr(authError(x.code))}
    setBusy(false);
  };
  const forgot=async()=>{
    setErr('');setInfo('');
    if(!email.trim())return setErr('Escribí tu email para recuperar la contraseña.');
    try{await resetPass(email.trim());setInfo('Te enviamos un email para cambiar la contraseña.')}catch(x){setErr(authError(x.code))}
  };
  return (
    <div className="wrap">
      <section className="hero">
        <div className="top"><div className="brand"><span className="logo">{GYM.name[0]}</span>{GYM.name}</div></div>
        <h1>Tu entrenamiento, tu progreso.</h1>
        <p>Creá tu cuenta para guardar tus días entrenados y tu racha en cualquier dispositivo.</p>
      </section>
      <section>
        <form className="card" onSubmit={submit}>
          <div className="pills" style={{marginBottom:14}}>
            <button type="button" className={!reg?'sel':''} onClick={()=>setMode('in')}>Ingresar</button>
            <button type="button" className={reg?'sel':''} onClick={()=>setMode('up')}>Crear cuenta</button>
          </div>
          {reg&&<label className="who">Nombre<input value={name} maxLength="24" autoComplete="name" onChange={e=>setName(e.target.value)}/></label>}
          <label className="who">Email<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>
          <label className="who">Contraseña<input type="password" required minLength="6" autoComplete={reg?'new-password':'current-password'} value={pass} onChange={e=>setPass(e.target.value)}/></label>
          {err&&<p className="err">{err}</p>}{info&&<p className="mut">{info}</p>}
          <button className="go" disabled={busy}>{busy?'Un momento…':reg?'Crear cuenta':'Ingresar'}</button>
          {!reg&&<p style={{textAlign:'center'}}><button type="button" className="link" onClick={forgot}>Olvidé mi contraseña</button></p>}
        </form>
      </section>
    </div>
  );
}
