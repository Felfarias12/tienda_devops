# [Nombre del Microservicio]

> Repositorio base para el pipeline DevOps — Evaluación Parcial N°1, Ingeniería DevOps (DOY0101)

**Integrantes:**
Vicente Donoso
Felipe Farias
Mario Jaramillo


**Fecha de entrega:** [4/9/2026]

---

## Tabla de contenidos

1. [Descripción del proyecto](#descripción-del-proyecto)
2. [Estrategia de ramificación](#estrategia-de-ramificación)
3. [Estructura de ramas](#estructura-de-ramas)
4. [Convenciones de commits](#convenciones-de-commits)
5. [Naming de ramas](#naming-de-ramas)
6. [Flujo de trabajo colaborativo simulado](#flujo-de-trabajo-colaborativo-simulado)
7. [Pull Requests y estrategia de revisión](#pull-requests-y-estrategia-de-revisión)
8. [CI/CD — GitHub Actions](#cicd--github-actions)
9. [Estructura de carpetas](#estructura-de-carpetas)
10. [Control de versiones](#control-de-versiones)
11. [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
12. [Uso de Inteligencia Artificial](#uso-de-inteligencia-artificial)
13. [Reflexiones individuales](#reflexiones-individuales)

---

## Descripción del proyecto

El microservicio muestra una pagina de productos para mascotas, utilizando Node.js, Java, utilizando el framework express y la base de datos MySQL, todo esto se maneja con Docker

---

## Estrategia de ramificación

Escogimos GitFlow ya que permite separar claramente el trabajo en desarrollo (develop) del código estable en producción (main), lo cual facilita gestionar releases planificados y correcciones urgentes (hotfixes) de forma aislada.
---

## Estructura de ramas

```
main            → Código en producción, siempre estable
develop         → Rama de integración, contiene los últimos cambios listos para el próximo release
feature/<nombre> → Ramas para nuevas funcionalidades, nacen de develop
hotfix/<nombre>  → Ramas para correcciones urgentes en producción, nacen de main
```

**Diagrama del flujo:**

```
main      ●───────────────────●───hotfix───●──────────────▶
           \                 /              \              
develop     ●───●───●───●───●────────────────●─────────────▶
                 \     /         \      /
        feature/A ●───●  feature/B ●───●
```

---

## Convenciones de commits

Se utiliza el estándar **Conventional Commits**:

```
<tipo>(<alcance opcional>): <descripción breve en presente>
```

**Tipos permitidos:**

| Tipo | Uso |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de errores |
| `docs` | Cambios solo en documentación |
| `style` | Formato, espacios, punto y coma (sin cambios de lógica) |
| `refactor` | Cambio de código que no corrige bugs ni agrega features |
| `test` | Agregar o corregir tests |
| `chore` | Tareas de mantenimiento, configuración, dependencias |



---

## Naming de ramas

```
feature/<descripcion-corta-en-kebab-case>
hotfix/<descripcion-corta-en-kebab-case>
release/<version>
```



---

## Flujo de trabajo colaborativo simulado


Se documentan aquí, en orden cronológico, los comandos ejecutados durante la simulación del desarrollo colaborativo.

### Feature 1: [nombre de la funcionalidad]

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-feature-1

git add .
git commit -m "feat(modulo): descripción del cambio"

git push origin feature/nombre-feature-1
```

### Feature 2: [nombre de la funcionalidad]

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-feature-2

git add .
git commit -m "feat(modulo): descripción del cambio"

git push origin feature/nombre-feature-2
```

### Hotfix: [descripción del bug corregido]

```bash
git checkout main
git pull origin main
git checkout -b hotfix/descripcion-del-bug

git add .
git commit -m "fix(modulo): descripción de la corrección"

git push origin hotfix/descripcion-del-bug

```

### Registro de Pull Requests

| # | Rama origen | Rama destino | Tipo | Enlace PR | Estado |
|---|---|---|---|---|---|
| 1 | feature/nombre-feature-1 | develop | Feature | [link] | Merged |
| 2 | feature/nombre-feature-2 | develop | Feature | [link] | Merged |
| 3 | hotfix/descripcion-del-bug | main | Hotfix | [link] | Merged |

---

## Pull Requests y estrategia de revisión

- Toda rama `feature/*` o `hotfix/*` se integra mediante **Pull Request**, nunca con push directo a `main` o `develop`.
- Cada PR debe:
  - Tener un título claro siguiendo la convención de commits (ej. `feat: agregar login social`).
  - Incluir una descripción breve del cambio y su motivación.
  - Pasar el pipeline de CI (GitHub Actions) antes de poder fusionarse.
  - Ser revisado por al menos un integrante distinto al autor (revisión cruzada en la pareja).
- Los PR de `hotfix/*` tienen prioridad de revisión por su carácter urgente.
- Se utiliza merge commit

---

## CI/CD — GitHub Actions

> **IE3 / IE4** — Automatización del flujo DevOps

Se configuró un workflow básico ubicado en `.github/workflows/ci.yml` que se ejecuta automáticamente:

- En cada **push a `develop`**.
- En cada **pull request hacia `main`**.

**¿Qué hace el workflow?**

actualmente hace un echo para mostrar que esta funcionando, mostrando un mensaje que lo corrobora


---

## Estructura de carpetas

```
nombre-microservicio/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   
│── db/
│   
│── frontend/   
│   
├── instrucciones/
├── README.md
```

**Convenciones:**
Actualmente el proyecto funciona unicamente en local
---

## Control de versiones

Se utiliza`MAJOR.MINOR.PATCH`

- **MAJOR**: cambios incompatibles con versiones anteriores.
- **MINOR**: nuevas funcionalidades compatibles hacia atrás (ej. features).
- **PATCH**: correcciones de bugs compatibles hacia atrás (ej. hotfixes).

| Versión | Cambio | Tipo |
|---|---|---|
| 1.0.0 | Versión base del microservicio | — |
| 1.1.0 | Feature 1 agregada | MINOR |
| 1.2.0 | Feature 2 agregada | MINOR |
| 1.2.1 | Hotfix aplicado | PATCH |

Los releases se etiquetan (`git tag`) desde `main` tras cada fusión relevante.

---

## Cómo ejecutar el proyecto

```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd nombre-microservicio

Comandos a utilizar:
    docker compose build
    docker compose up -d

Se necesita Docker Desktop

corre en local: http://localhost:8080/productos

Una vez que se haya hecho push a la rama desarrollo_front, 
se ejecutará el workflow de GitHub Actions para desplegar la aplicación en el servidor EC2 cuando los secretos se configuren.


---

## Uso de Inteligencia Artificial

Conforme a las indicaciones de la evaluación, se declara el uso de IA en este trabajo:

| Herramienta | Uso dado | Sección aplicada |
|---|---|---|
| [ Claude ] | [Apoyo en redacción y estructura del formato de este README] | [Formato general, tablas] |
---

## Reflexiones individuales

### [Felipe Farías]

Con este proyecto aprendi la forma correcta de versionar, modificar y trabajar en equipo utilizando github.
### [Mario Jaramillo]

Gracias a este proyecto, pude pulir mi forma de trabajar con github para ser mas eficiente.

###[Vicente Donoso]

Aunque ya conocía GitHub de antes y lo usaba en otros ramos, este proyecto me sirvió para entender de verdad cómo se organiza un trabajo en equipo ordenado usando gitflow y ramas separadas.
