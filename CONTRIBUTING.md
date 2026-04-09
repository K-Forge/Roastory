# Guía para Contribuir a Roastory

## ¿Quién puede contribuir?

Este proyecto es parte de **K-Forge** en la Fundación Universitaria Konrad Lorenz. Todos los miembros del club pueden contribuir. Si eres externo y deseas colaborar, contacta al equipo a través del repositorio.

---

## Convención para Commits

Para mantener un historial limpio y comprensible, seguimos la convención de **Conventional Commits**.

Formato:

```
type: short message in english
```

> El mensaje siempre debe estar en **inglés**, en **minúsculas**, y sin punto final. No usar scopes entre paréntesis.

### Tipos de Commits

| Tipo       | Descripción                                                  |
| ---------- | ------------------------------------------------------------ |
| `feat`     | Nueva funcionalidad                                          |
| `fix`      | Corrección de errores                                        |
| `chore`    | Tareas de mantenimiento del proyecto                         |
| `release`  | Preparación de una nueva versión                             |
| `hotfix`   | Corrección urgente en producción                             |
| `docs`     | Cambios en documentación                                     |
| `refactor` | Refactorización de código sin cambiar comportamiento         |
| `test`     | Agregar o modificar tests                                    |

### Ejemplos Correctos

```
feat: add product catalog endpoint
fix: resolve null pointer in inventory service
chore: update dependencies
docs: add database schema documentation
refactor: extract sales logic to service layer
test: add unit tests for product repository
release: prepare version 1.0.0
hotfix: fix critical stock calculation error
```

### Ejemplos Incorrectos

```
update                          → No describe nada útil
cambios                         → Muy ambiguo y no está en inglés
FEAT: Add product               → No uses mayúsculas
feat(api): add product          → No usar scopes entre paréntesis
feat: Add Product Listing.      → No uses mayúsculas ni punto final
```

---

## Modelo de Ramas — Git Flow

Seguimos el modelo **Git Flow** para organizar el trabajo en ramas. Las ramas de trabajo parten de `develop`, excepto `hotfix/*`, que parte de `main`.

### Diagrama de ramas

```mermaid
gitGraph
   commit id: "init"
   branch develop
   checkout develop
   commit id: "setup project"
   branch feature/catalog
   checkout feature/catalog
   commit id: "feat: add product catalog"
   commit id: "feat: add search and filters"
   checkout develop
   merge feature/catalog
   branch feature/inventory
   checkout feature/inventory
   commit id: "feat: add inventory model"
   commit id: "feat: add stock alerts"
   checkout develop
   merge feature/inventory
   branch chore/update-docs
   checkout chore/update-docs
   commit id: "docs: add database schema"
   checkout develop
   merge chore/update-docs
   branch bugfix/fix-stock-count
   checkout bugfix/fix-stock-count
   commit id: "fix: correct stock count calculation"
   checkout develop
   merge bugfix/fix-stock-count
   branch release/1.0.0
   checkout release/1.0.0
   commit id: "release: prepare v1.0.0"
   checkout main
   merge release/1.0.0 tag: "v1.0.0"
   checkout develop
   merge release/1.0.0
   checkout main
   branch hotfix/fix-pos-error
   checkout hotfix/fix-pos-error
   commit id: "hotfix: fix point of sale total error"
   checkout main
   merge hotfix/fix-pos-error tag: "v1.0.1"
   checkout develop
   merge hotfix/fix-pos-error
```

### Tipos de Ramas

| Rama        | Propósito                                           | Nace de   | Se fusiona en       |
| ----------- | --------------------------------------------------- | --------- | ------------------- |
| `main`      | Código estable en producción                        | —         | —                   |
| `develop`   | Integración de funcionalidades en desarrollo        | `main`    | `release/*`, `main` |
| `feature/*` | Desarrollo de nuevas funcionalidades                | `develop` | `develop`           |
| `chore/*`   | Mantenimiento (docs, configs, dependencias, CI/CD)  | `develop` | `develop`           |
| `bugfix/*`  | Corrección de bugs no urgentes en desarrollo        | `develop` | `develop`           |
| `test/*`    | Pruebas de integración o experimentación            | `develop` | `develop`           |
| `hotfix/*`  | Correcciones urgentes en producción                 | `main`    | `main`, `develop`   |
| `release/*` | Preparación de una versión para producción          | `develop` | `main`, `develop`   |

### Cómo crear ramas

```bash
# Desde develop, crear una feature
git checkout develop
git pull origin develop
git checkout -b feature/product-catalog

# Mantenimiento (docs, configs, refactor de estructura)
git checkout develop
git pull origin develop
git checkout -b chore/update-dependencies

# Corrección de bug no urgente
git checkout develop
git pull origin develop
git checkout -b bugfix/fix-stock-count

# Desde develop, crear una rama de test
git checkout develop
git pull origin develop
git checkout -b test/sales-integration

# Desde main, crear un hotfix
git checkout main
git pull origin main
git checkout -b hotfix/fix-pos-error

# Desde develop, crear un release
git checkout develop
git pull origin develop
git checkout -b release/1.0.0
```

### Convención de nombres para ramas

Usar **kebab-case** (minúsculas separadas por guiones) después del prefijo. Los nombres deben ser descriptivos y concisos.

```
feature/product-catalog             (correcto)
feature/customer-history            (correcto)
chore/update-dependencies           (correcto)
bugfix/fix-stock-count              (correcto)
hotfix/fix-pos-total                (correcto)
release/1.0.0                       (correcto)
test/sales-e2e                      (correcto)

feature/MiFeature                   (incorrecto — no usar camelCase)
Feature/nueva-feature               (incorrecto — prefijo en mayúscula)
fix-bug                             (incorrecto — falta prefijo)
feature/x                           (incorrecto — no es descriptivo)
```

### Flujo completo de trabajo — Ejemplo

```bash
# 1. Actualizar develop
git checkout develop
git pull origin develop

# 2. Crear feature
git checkout -b feature/sales-report

# 3. Trabajar y hacer commits
git add .
git commit -m "feat: add sales report endpoint"

git add .
git commit -m "feat: add sales report page"

# 4. Push de la rama
git push origin feature/sales-report

# 5. Crear Pull Request → develop
# Esperar code review y aprobación

# 6. Merge a develop (vía PR)
# 7. Eliminar la rama feature
git branch -d feature/sales-report
```

---

## Versionamiento

Seguimos **SemVer** (Semantic Versioning) con formato `MAJOR.MINOR.PATCH`.

| Segmento | Cuándo incrementar                                | Ejemplo            |
| -------- | ------------------------------------------------- | ------------------ |
| `MAJOR`  | Cambios incompatibles con versiones anteriores    | `1.0.0` → `2.0.0`  |
| `MINOR`  | Nueva funcionalidad compatible hacia atrás        | `1.0.0` → `1.1.0`  |
| `PATCH`  | Correcciones de errores en producción (hotfix)    | `1.1.0` → `1.1.1`  |

### Versiones Pre-release

Para versiones en desarrollo o pruebas, se agrega un sufijo:

```
1.0.0-alpha.1    → Primera iteración en desarrollo, puede ser inestable
1.0.0-alpha.2    → Segunda iteración en desarrollo
1.0.0-beta.1     → Primera versión en pruebas, funcionalidad completa
1.0.0-beta.2     → Segunda versión en pruebas
1.0.0            → Versión estable lista para producción
```

### Ciclo de vida de una versión

```mermaid
graph LR
    A[alpha] --> B[beta]
    B --> C[release candidate]
    C --> D[stable]
    D --> E[maintenance / patch]
```

1. **Alpha** — Funcionalidad en desarrollo, puede ser inestable
2. **Beta** — Funcionalidad completa, en fase de pruebas
3. **Release Candidate** — Candidata a versión estable
4. **Stable** — Versión lista para producción
5. **Maintenance** — Correcciones post-release (patches)

```bash
# 1. Crear rama de release desde develop
git checkout develop
git pull origin develop
git checkout -b release/1.0.0-alpha

# 2. Commit de preparación
git commit -m "release: prepare v1.0.0-alpha"

# 3. Mergear a main y taggear
git checkout main
git merge release/1.0.0-alpha
git tag -a v1.0.0-alpha -m "release: v1.0.0-alpha"
git push origin main --tags

# 4. Mergear de vuelta a develop
git checkout develop
git merge release/1.0.0-alpha
```

---

## Estándares de Código

> El stack tecnológico de Roastory está por definir. Esta sección se completará una vez que el equipo y el profesor de Nuevas Tecnologías establezcan las tecnologías a usar.

Independientemente del stack, se aplicarán las siguientes reglas generales:

- Nombres de clases/componentes en **PascalCase**
- Nombres de métodos, funciones y variables en **camelCase**
- Constantes en **UPPER_SNAKE_CASE**
- Indentación consistente según el lenguaje (2 espacios para JS/TS, 4 para Java)
- Sin código comentado ni imports sin usar en el código final

---

> Si el proyecto habilita hooks de validación, consulta la documentación interna del equipo para instalarlos en tu entorno.
