# Core Gym

App de entrenamiento funcional para casa. React + Vite + Firebase (Authentication y Firestore).

## Puesta en marcha
1. `npm install`
2. `npm run dev`. Sin Firebase configurado corre en modo local: sin cuentas, con progreso guardado en el dispositivo.

## Activar cuentas y base de datos
1. En https://console.firebase.google.com creá un proyecto y agregá una app web (`</>`).
2. Copiá `.env.example` a `.env` y completá las 4 variables con los datos de esa app.
3. Build > Authentication > Sign-in method: habilitá Correo electrónico/contraseña.
4. Build > Firestore Database: creá la base en modo producción.
5. En Reglas pegá el contenido de `firestore.rules` y publicá.
6. Reiniciá `npm run dev`: vas a ver el panel de ingreso y registro.

## Cómo se guarda
- Usuarios: Authentication (email, contraseña cifrada por Firebase, nombre).
- Progreso: `socios/{uid}` con `name`, `days` (días entrenados) y `updated`. Cada usuario solo accede a su documento.
- El gimnasio puede ver usuarios y progreso desde la consola de Firebase.

## Panel del entrenador
1. Registrá la cuenta del entrenador desde la app como cualquier usuario.
2. En Firebase, Authentication > Users, copiá el UID de esa cuenta.
3. En Firestore creá la colección `admins` y un documento cuyo ID sea ese UID (con un campo cualquiera, por ejemplo `rol: "entrenador"`).
4. Publicá las reglas de `firestore.rules` (incluyen el permiso de admin).
5. Cerrá sesión y volvé a entrar: aparece el botón **Panel** junto a Salir.
El panel muestra socios, días entrenados, última vez y estado (activo, en riesgo, inactivo), con filtro, búsqueda y descarga en CSV. Los socios que entrenaron antes de esta versión no tienen email guardado hasta que completen otra rutina.

## Publicar
`npm run build` genera `dist/`. Subila a Netlify, Vercel, Firebase Hosting o Azure Static Web Apps y cargá las variables `VITE_FIREBASE_*` en el servicio. Después agregá el dominio en Authentication > Settings > Dominios autorizados.

## Personalizar
- Nombre del gimnasio, ejercicios, rutinas y niveles: `src/data.js`.
- Sonidos: `src/sound.js`.
