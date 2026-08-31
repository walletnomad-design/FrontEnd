# NomadWallet — Frontend

Frontend de NomadWallet (Proyecto Final · Soy Henry). Aplicación en **React + TypeScript + Tailwind CSS v4** con tema "Exchange Board" y conexión a la API del backend desplegada en Railway.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (CSS-first, sin config JS)
- **React Router v6** (rutas públicas y protegidas)
- **Vitest** + **Testing Library** para tests

## Estructura

```
src/
  components/    UI reutilizable: BalanceCard, GoalProgress, Navbar, Button, Input, Loader, ErrorMessage, ProtectedRoute, TickerBackground
  pages/         Login, Register, Dashboard
  context/       AuthContext (estado global de autenticación)
  services/      httpClient (wrapper de fetch), authApi, walletApi
  types/         Tipos TypeScript (contrato con la API)
  utils/         currency (formateo de montos), validators (validación de formularios)
  index.css      Paleta Exchange Board + animaciones (Tailwind v4 @theme)
```

## Puesta en marcha

1. `npm install`
2. Copiar `.env.example` a `.env`:

   ```
   VITE_API_BASE_URL=https://imaginative-friendship-production-3adc.up.railway.app
   ```

   > Sin el `.env`, la app intenta conectarse a `http://localhost:3000`. Para la demo se necesita apuntar a la URL de Railway.
3. Correr:

   ```
   npm run dev          # desarrollo (Vite)
   npm run build        # compila a dist/
   npm run preview      # preview de la build
   npm test             # suite Vitest
   ```

## API consumida

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Crear cuenta (devuelve JWT) |
| POST | `/api/auth/login` | Iniciar sesión (devuelve JWT) |
| GET | `/api/wallet` | Datos de la wallet del usuario |
| GET | `/api/balances` | Saldos por moneda (USD / EUR / COP) |
| GET | `/api/transactions` | Historial de movimientos |
| GET | `/` | Health check de la API |

## Componentes principales

| Componente | Descripción |
|------------|-------------|
| `BalanceCard` | Tarjeta de saldo por moneda con línea escáner animada y acento lateral de color |
| `GoalProgress` | Barra de porcentaje de objetivos con hitos, label flotante y efecto shine |
| `Navbar` | Barra superior con glassmorphism (backdrop blur) |
| `TickerBackground` | Cinta de cotizaciones de mercado en movimiento infinito |
| `ProtectedRoute` | Guard de rutas: redirige a `/login` si no hay token |
| `Loader` | Spinner dorado con label |
| `ErrorMessage` | Toast de error con estilo rojo |

## Paleta "Exchange Board"

| Token | Color | Uso |
|-------|-------|-----|
| `--color-navy` | `#0e1b33` | Fondo principal |
| `--color-navy-card` | `#152847` | Tarjetas y paneles |
| `--color-amber` | `#f0a537` | Acentos dorados |
| `--color-mint` | `#2dd4a7` | Acento moneda USD |
| `--color-bone` | `#f5f3ee` | Texto principal |
| `--color-slate` | `#8b96ac` | Texto secundario |

## Animaciones CSS

| Animación | Descripción |
|-----------|-------------|
| `rise-in` | Entrada de tarjetas/secciones (desliza hacia arriba + fade) |
| `scan-sweep` | Línea escáner que recorre las tarjetas de saldo |
| `shine-sweep` | Brillo que recorre la barra de progreso de objetivos |
| `spin-slow` | Halo dorado que gira lento detrás del GoalProgress |
| `ticker-scroll` | Cinta de cotizaciones en movimiento infinito |
| `glow-pulse` | Resplandor ambiental que respira |

Todas respetan `prefers-reduced-motion: reduce`.

## Miembros

- **P1** — Frontend (React, componentes, routing, temas y animaciones)
- **P2** — Backend: PostgreSQL, tipos, repositorios y servicios de datos + documentación
- **P3** — Backend: Express, autenticación JWT y endpoints
