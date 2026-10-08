import {doc,getDoc,getDocs,setDoc,collection,serverTimestamp} from 'firebase/firestore';
import {db,hasFirebase} from './firebase';
import {ld,sv} from './storage';
// Con cuentas: un documento por usuario, socios/{uid} = { name, days:{ '2026-10-06': true }, updated }.
// Sin Firebase (modo local): la clave sale del nombre escrito.
export const localKey=n=>(n||'invitado').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'invitado';
export async function loadDays(key){
  if(hasFirebase){try{const s=await getDoc(doc(db,'socios',key));return s.exists()?s.data().days||{}:{}}catch(e){console.warn('Firestore:',e)}}
  return ld('all',{})[key]||{};
}
export async function saveDay(key,name,day,email){
  if(!key)return;
  const all=ld('all',{});all[key]={...(all[key]||{}),[day]:true};sv('all',all); // copia local
  if(hasFirebase){try{await setDoc(doc(db,'socios',key),{name:name||'Socio',...(email?{email}:{}),days:{[day]:true},updated:serverTimestamp()},{merge:true})}catch(e){console.warn('Firestore:',e)}}
}
// Panel del entrenador: el rol se define con un documento admins/{uid} creado a mano en la consola.
export async function isAdmin(uid){
  if(!hasFirebase||!uid)return false;
  try{return (await getDoc(doc(db,'admins',uid))).exists()}catch(e){return false}
}
export async function listSocios(){
  const snap=await getDocs(collection(db,'socios'));
  return snap.docs.map(d=>({id:d.id,...d.data()}));
}
