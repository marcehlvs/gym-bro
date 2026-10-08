import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
const e=import.meta.env;
const cfg={apiKey:e.VITE_FIREBASE_API_KEY,authDomain:e.VITE_FIREBASE_AUTH_DOMAIN,projectId:e.VITE_FIREBASE_PROJECT_ID,appId:e.VITE_FIREBASE_APP_ID};
// Sin claves en .env la app corre en modo local (sin cuentas, progreso en el dispositivo).
export const hasFirebase=Boolean(cfg.apiKey&&cfg.projectId);
const app=hasFirebase?initializeApp(cfg):null;
export const db=app?getFirestore(app):null;
export const auth=app?getAuth(app):null;
