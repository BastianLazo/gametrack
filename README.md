# Evaluación 1 – Microservicio Backend Monsite

## 1. Introducción

Para esta evaluación partimos del proyecto **Monsite**, específicamente de su backend desarrollado con Node.js y Express, más una parte del frontend estático que ya teníamos de ramos anteriores. La idea era aplicar lo que hemos visto en DevOps: control de versiones con Git, trabajo con ramas, pull requests, revisiones de código y un poco de automatización con GitHub Actions.

El backend de Monsite maneja cosas como pagos (con Mercado Pago y Transbank), recepción de webhooks, envío de correos y mensajes por WhatsApp, y también tiene algunas rutas protegidas para el panel administrativo. Básicamente, es el corazón de la aplicación.

## 2. Estrategia de ramificación

Elegimos **GitFlow** como modelo de ramificación. La razón principal es que nos permite tener bien separado el código que ya está en producción (`main`) del código que estamos desarrollando (`develop`). Como el backend maneja pagos, preferimos ser cuidadosos y no mezclar cambios sin probar directamente en la rama principal.

El flujo que usamos es:

- `main`: código estable, listo para producción.
- `develop`: punto de integración de nuevas funcionalidades.
- `feature/<nombre>`: para desarrollar una funcionalidad nueva.
- `hotfix/<nombre>`: para arreglos urgentes en producción.

También consideramos usar `release/` cuando necesitemos preparar una versión antes de pasarla a `main`, aunque en este proyecto no lo usamos todavía.

Podríamos haber usado trunk-based, pero sentimos que GitFlow se adapta mejor a este tipo de proyecto, donde hay varias integraciones con servicios externos y preferimos tener más control sobre lo que llega a producción.

## 3. Convención de ramas y commits

Para mantener el repositorio ordenado y que cualquier persona del equipo entienda rápidamente qué está pasando, definimos algunas reglas simples:

**Nombres de ramas:**

feature/descripcion-del-cambio
hotfix/descripcion-del-cambio
release/version

**Mensajes de commit:** usamos **Conventional Commits**, que es un estándar que ayuda a que el historial sea más legible y facilita la generación de changelogs automáticos.

Algunos ejemplos de cómo redactamos los commits:

feat(payment): agregar validación de monto mínimo
fix(webhook): corregir validación de pago
docs(readme): actualizar documentación del proyecto

Los tipos que más usamos son: `feat`, `fix`, `docs`, `refactor`, `test` y `chore`.

## 4. Flujo de trabajo con Git y GitHub

Este es el flujo que seguimos para cada cambio:

1. Partimos siempre desde `develop`:

   git switch develop
   git pull origin develop

2. Creamos una rama nueva para lo que vamos a hacer:

   git switch -c feature/nombre-del-cambio

3. Desarrollamos la funcionalidad y hacemos commits:

   git status
   git add .
   git commit -m "feat(scope): descripción del cambio"

4. Subimos la rama a GitHub:

   git push -u origin feature/nombre-del-cambio

5. Abrimos un Pull Request hacia `develop`. Ahí otro integrante revisa el código y se asegura de que las validaciones automáticas de GitHub Actions estén OK.

6. Para hacer el merge, usamos **Squash Merge** en las ramas de funcionalidades, así el historial de `develop` no se llena de commits pequeños y queda más limpio.

## 5. Revisión de código

Las revisiones las hacemos mediante Pull Requests. El objetivo es que otra persona distinta al autor revise el cambio antes de que llegue a `develop` o `main`.

Durante la revisión, nos fijamos en:

- Si el código es entendible y sigue la estructura del proyecto.
- Si hay credenciales o secretos escritos en el código (eso es un NO rotundo).
- Si se consideraron posibles errores o casos borde.
- Que las validaciones automáticas hayan pasado.

Si el revisor encuentra algo, se comenta y se corrige antes de hacer el merge. Esto nos ha ayudado a evitar errores tontos y a mantener la calidad del código.

## 6. Integración y despliegue continuo (CI/CD)

Configuramos un workflow de GitHub Actions en `.github/workflows/ci.yml`. Este se ejecuta automáticamente cuando hay cambios o PRs en `main` y `develop`.

**En la etapa de CI (Integración Continua):**

- Usamos Node.js 20.
- Instalamos dependencias con `npm ci` (más rápido y confiable que `npm install` en CI).
- Revisamos la sintaxis del backend.
- Validamos referencias en HTML y JS (para evitar links rotos o errores tontos).
- Corremos un escaneo básico para asegurarnos de que no se estén subiendo secretos accidentalmente.

**En la etapa de CD (Despliegue Continuo):**

- Cuando un cambio llega a `main` y pasa todas las validaciones, se despliega automáticamente el frontend en Firebase Hosting.
- Esto asegura que solo código validado llegue a producción.

## 7. Manejo de credenciales

Como el proyecto usa servicios externos (Firebase, Mercado Pago, Transbank), tenemos credenciales que **no pueden estar en el repositorio**.

Para eso:

- Ignoramos archivos como `.env` (está en `.gitignore`).
- Dejamos un `.env.example` como referencia de las variables necesarias.
- Para el despliegue en Firebase, usamos un secreto de GitHub: `FIREBASE_SERVICE_ACCOUNT`, que contiene las credenciales necesarias para que GitHub Actions pueda desplegar sin exponer nada.

Esta práctica nos pareció importante porque evita filtraciones de datos sensibles y es algo que cualquier proyecto real debería hacer.

## 8. Estructura del proyecto

El proyecto está organizado en carpetas según la responsabilidad:

backend/        # Código del backend (Node.js/Express)
admin/          # Panel administrativo
js/             # JavaScript del frontend
css/            # Estilos del frontend
scripts/        # Scripts de validación y utilidades
load-tests/     # Pruebas de carga
.github/        # Configuración de GitHub Actions

Para esta evaluación, la carpeta más relevante fue `backend/`, porque ahí están las funciones de pagos, webhooks y notificaciones que mencionamos al principio.

## 9. Ejecución local

Si quieres probar el backend en tu máquina, los pasos son simples:

cd backend
cp .env.example .env   # (completar con tus credenciales reales)
npm install
npm start

Eso sí, recuerda que las credenciales reales no se suben al repositorio; cada uno debe tener su propio `.env` localmente.

## 10. Conclusión

Con este trabajo pudimos aplicar un flujo DevOps completo sobre un proyecto que ya teníamos. Elegir GitFlow nos dio la tranquilidad de tener separado el código estable del que está en desarrollo. Los Pull Requests nos obligaron a revisar el código antes de integrarlo, y GitHub Actions nos ahorró tiempo al automatizar las validaciones y el despliegue.

El manejo de secretos también fue un punto clave, porque trabajar con pagos y servicios externos requiere ser cuidadoso con las credenciales.

En general, el ejercicio nos sirvió para ordenar nuestro proceso de desarrollo y hacerlo más seguro y trazable, que es justamente lo que busca un pipeline DevOps.

**Integrantes:**
- [Nombre Integrante 1]
- [Nombre Integrante 2]
