import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,updateProfile,onAuthStateChanged,sendPasswordResetEmail} from 'firebase/auth';
import {auth} from './firebase';
export const watchUser=cb=>auth?onAuthStateChanged(auth,cb):(cb(null),()=>{});
export async function register(name,email,pass){
  const c=await createUserWithEmailAndPassword(auth,email,pass);
  await updateProfile(c.user,{displayName:name.trim()});
  return c.user;
}
export const login=(email,pass)=>signInWithEmailAndPassword(auth,email,pass);
export const logout=()=>signOut(auth);
export const resetPass=email=>sendPasswordResetEmail(auth,email);
const M={
  'auth/invalid-credential':'Email o contraseña incorrectos.','auth/wrong-password':'Email o contraseña incorrectos.','auth/user-not-found':'Email o contraseña incorrectos.',
  'auth/email-already-in-use':'Ese email ya tiene una cuenta. Ingresá con tu contraseña.','auth/weak-password':'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-email':'El email no es válido.','auth/too-many-requests':'Demasiados intentos. Esperá unos minutos.',
  'auth/network-request-failed':'Sin conexión. Revisá tu internet.','auth/operation-not-allowed':'Falta habilitar Correo/contraseña en Firebase Authentication.'};
export const authError=c=>M[c]||'No se pudo completar. Probá de nuevo.';
