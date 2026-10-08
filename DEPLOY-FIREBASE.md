# Gym Bro: despliegue en Firebase

Guía paso a paso para publicar **Gym Bro** (React + Vite + Firebase Authentication y Firestore) en Firebase Hosting.

Repo: https://github.com/marcehlvs/gym-bro

---

## 1. Qué hace la app

**Para el socio**
- Rutinas guiadas con animación de figuras, voz (síntesis de voz del navegador) y pitidos.
- 6 ejercicios (sentadilla, escaladores, abdominal corto, elevación de piernas, bicicleta, plancha) agrupados en 3 rutinas: *Quema-grasa total*, *Cardio y cintura* y *Abdominales marcados*.
- Plan semanal fijo (Lun/Jue: A, Mar/Vie: B, Sáb: C, Dom/Mié: descanso activo).
- 3 niveles (Principiante, Intermedio, Avanzado) que cambian series y tiempos.
- Temporizador con anillo de progreso, pausa y saltar.
- Racha de días, contador semanal y medallas ("En marcha", "Constante", "Imparable").
- Pantalla con QR para compartir el link de la app.

**Cuentas**
- Registro, ingreso y recuperación de contraseña por email.
- Progreso guardado en Firestore (`socios/{uid}`), disponible en cualquier dispositivo.
- Sin las variables de Firebase, la app corre en **modo local** (sin cuentas, progreso en el dispositivo).

**Panel del entrenador**
- Solo visible para UIDs que existan en la colección `admins`.
- Lista socios con días entrenados, última vez y estado (activo, en riesgo, inactivo), con filtros, búsqueda y descarga en CSV.

---

## 2. Requisitos previos

- Cuenta de Google.
- Node.js 18 o superior y npm.
- Git.

Verificá las versiones:

```bash
node -v
npm -v
git --version
```

---

## 3. Crear el proyecto en Firebase

1. Entrá a https://console.firebase.google.com y creá un proyecto (Google Analytics es opcional).
2. En **Project settings > General > Your apps**, agregá una app web (`</>`).
3. Copiá los valores de configuración: `apiKey`, `authDomain`, `projectId` y `appId`.

---

## 4. Habilitar los servicios

1. **Build > Authentication > Sign-in method**: habilitá **Correo electrónico/contraseña**.
2. **Build > Firestore Database**: creá la base de datos en **modo producción** y elegí una región cercana.

---

## 5. Clonar e instalar

```bash
git clone https://github.com/marcehlvs/gym-bro
cd gym-bro
npm install
```

---

## 6. Configurar las variables de entorno

Copiá el archivo de ejemplo:

```bash
cp .env.example .env
```

Completá `.env` con los datos de tu app web:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

Probá en local:

```bash
npm run dev
```

Debería aparecer el panel de ingreso y registro. Si ves directamente la app pidiendo "¿Quién va a entrenar hoy?", las variables no se cargaron (modo local).

> `.env` está en `.gitignore`, no se sube al repo.

---

## 7. Instalar Firebase CLI e iniciar sesión

```bash
npm install -g firebase-tools
firebase login
```

---

## 8. Inicializar Hosting y Firestore

```bash
firebase init
```

Respuestas recomendadas:

| Pregunta | Respuesta |
|---|---|
| Qué funciones configurar | **Firestore** y **Hosting** (barra espaciadora para marcar) |
| Proyecto | *Use an existing project* y elegí el que creaste |
| Firestore rules file | `firestore.rules` |
| ¿Sobrescribir `firestore.rules`? | **No** (conserva las reglas del repo) |
| Firestore indexes file | el que propone por defecto |
| Public directory | **`dist`** |
| Configure as a single-page app | **Yes** |
| Set up automatic builds with GitHub | **No** (por ahora) |
| ¿Sobrescribir `dist/index.html`? | **No** |

Esto crea `firebase.json` y `.firebaserc`. El `firebase.json` debería quedar parecido a:

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

---

## 9. Compilar y publicar

```bash
npm run build
firebase deploy
```

Esto sube las reglas de Firestore y el sitio. Al terminar muestra la URL, del estilo:

```
https://tu-proyecto.web.app
```

> Compilá siempre con el `.env` completo: las variables `VITE_FIREBASE_*` se incrustan en el build.

---

## 10. Autorizar el dominio

En **Authentication > Settings > Authorized domains** verificá que estén:

- `tu-proyecto.web.app`
- `tu-proyecto.firebaseapp.com`

Si usás un dominio propio, agregalo también ahí y en **Hosting > Add custom domain**.

---

## 11. Crear la cuenta del entrenador (panel admin)

1. Abrí la app publicada y registrá la cuenta del entrenador como cualquier usuario.
2. En **Authentication > Users**, copiá el **UID** de esa cuenta.
3. En **Firestore**, creá la colección `admins` y un documento cuyo **ID sea ese UID**, con un campo cualquiera (por ejemplo `rol: "entrenador"`).
4. Cerrá sesión y volvé a entrar: aparece el botón **Panel** junto a **Salir**.

---

## 12. Actualizar la app más adelante

```bash
git pull
npm install
npm run build
firebase deploy --only hosting
```

Si cambiaste las reglas de Firestore:

```bash
firebase deploy --only firestore:rules
```

---

## 13. Personalización

- Nombre del gimnasio: `src/data.js` (constante `GYM`). Actualmente: **Gym Bro**.
- Ejercicios, rutinas y niveles: `src/data.js`.
- Sonidos: `src/sound.js`.

---

## 14. Estructura de datos en Firestore

- `socios/{uid}`: `name`, `email`, `days` (mapa de fechas entrenadas) y `updated`. Cada usuario solo lee y escribe su documento.
- `admins/{uid}`: marca de entrenador, creada a mano en la consola.

Las reglas están en `firestore.rules`: el admin puede leer todos los socios, pero no modificarlos.

---

## 15. Problemas frecuentes

| Síntoma | Causa y solución |
|---|---|
| La app pide solo el nombre, sin login | Faltan las variables `VITE_FIREBASE_*` al compilar. Completá `.env` y volvé a hacer `npm run build`. |
| "Falta habilitar Correo/contraseña en Firebase Authentication" | Habilitá ese método en *Authentication > Sign-in method*. |
| El login falla en el sitio publicado | Falta el dominio en *Authorized domains*. |
| El panel dice "No se pudo cargar" | La cuenta no está en `admins` o las reglas no están publicadas (`firebase deploy --only firestore:rules`). |
| Pantalla en blanco al recargar una ruta | Falta el rewrite SPA (`"source": "**"` hacia `/index.html`) en `firebase.json`. |
| `firebase: command not found` | Reinstalá con `npm install -g firebase-tools` o usá `npx firebase-tools deploy`. |

---

## 16. Notas de seguridad

- Las claves `VITE_FIREBASE_*` quedan en el JavaScript público. Es lo normal en Firebase: no son secretas, la protección real son las **reglas de Firestore**.
- No subas `.env` al repo.
- Revisá en *Authentication > Settings* si querés limitar registros o activar protección adicional.

---

## 17. Despliegue automático con GitHub Actions (opcional)

Si más adelante querés que se publique solo en cada push a `main`, ejecutá:

```bash
firebase init hosting:github
```

La CLI crea el workflow y carga el secreto de la cuenta de servicio. Después agregá en el repo (*Settings > Secrets and variables > Actions*) las cuatro variables `VITE_FIREBASE_*` y pasalas al paso de build del workflow con `env:`.
