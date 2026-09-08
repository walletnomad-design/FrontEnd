# NomadWallet — Frontend

Frontend de NomadWallet (Proyecto Final · Soy Henry). Aplicación en **React + TypeScript + Tailwind CSS v4** con identidad visual azul/violeta y conexión real a la API del backend desplegada en Railway.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (CSS-first, sin config JS)
- **React Router v6** (rutas públicas y protegidas)
- **Vitest** + **Testing Library** para tests

## Estructura

```
src/
  components/    UI reutilizable: Sidebar, Header, AppLayout, Modal, BalanceCard,
                 GoalProgress, AlertCard, CreateGoalForm, ContributeForm,
                 CreateAlertForm, ExchangeForm, Button, Input, Loader, ErrorMessage,
                 ProtectedRoute
  pages/         Login, Register, Dashboard, Exchange, Transactions, Goals, Alerts
  context/       AuthContext (estado global de autenticación)
  services/      httpClient (wrapper de fetch), authApi, walletApi, exchangeApi,
                 goalsApi, alertsApi
  types/         Tipos TypeScript (contrato con la API)
  utils/         currency (formateo de montos), validators (validación de formularios)
  index.css      Paleta azul/violeta + animaciones (Tailwind v4 @theme)
```

## Puesta en marcha

1. `npm install`
2. Copiar `.env.example` a `.env`:

   ```
   VITE_API_BASE_URL=https://imaginative-friendship-production-3adc.up.railway.app
   ```

   > Sin el `.env`, la app intenta conectarse a `http://localhost:3000`. Para la demo se necesita apuntar a la URL de Railway. **En Vercel, esta variable se configura por separado en Project Settings → Environment Variables** — el `.env` local no la reemplaza en producción.
3. Correr:

   ```
   npm run dev          # desarrollo (Vite)
   npm run build        # compila a dist/
   npm run preview      # preview de la build
   npm test             # suite Vitest
   ```

## Navegación

`AppLayout` (Sidebar fijo + Header con avatar y logout) envuelve todas las pantallas protegidas: Dashboard, Exchange, Transactions, Goals, Alerts. Login/Register usan `AuthShell` (tabs compartidas, sin Sidebar).

En el sidebar, "Ajustes" y "Ayuda" están deshabilitados ("Próximamente") porque quedan fuera del alcance de este sprint.

## API consumida

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Crear cuenta (devuelve JWT) |
| POST | `/api/auth/login` | Iniciar sesión (devuelve JWT) |
| GET | `/api/wallet` | Datos de la wallet del usuario |
| GET | `/api/balances` | Saldos por moneda (USD / EUR / COP) |
| GET | `/api/rates` | Tasas de cambio actuales |
| POST | `/api/exchange` | Comprar / vender / intercambiar monedas (crea transacción real) |
| GET | `/api/transactions` | Historial de movimientos |
| GET / POST | `/api/goals` | Listar / crear metas de ahorro |
| POST | `/api/goals/:id/contributions` | Registrar un aporte a una meta |
| DELETE | `/api/goals/:id` | Eliminar una meta |
| GET / POST | `/api/rate-alerts` | Listar / crear alertas de tasa |
| POST | `/api/rate-alerts/:id/evaluate` | Evaluar una alerta activa |
| POST | `/api/rate-alerts/:id/reactivate` | Reactivar una alerta disparada |
| DELETE | `/api/rate-alerts/:id` | Eliminar una alerta |
| GET | `/` | Health check de la API |

En el sidebar, "Comprar" y "Vender" son el mismo `POST /api/exchange` con `type: buy` / `type: sell` — solo cambia el label.

## Componentes principales

| Componente | Descripción |
|------------|-------------|
| `Sidebar` | Navegación fija con estado activo real (por pathname + query string) |
| `Header` | Barra superior con avatar de iniciales y logout |
| `AppLayout` | Envuelve Sidebar + Header alrededor de las páginas protegidas |
| `Modal` | Overlay reutilizable (cierra con click afuera o Escape), usado por Goals y Alerts |
| `BalanceCard` | Tarjeta de saldo por moneda |
| `GoalProgress` | Barra de porcentaje de una meta de ahorro |
| `AlertCard` | Card de una alerta de tasa con estado activa/disparada |
| `ExchangeForm` | Formulario de compra/venta/intercambio, sincronizado con `?type=` de la URL |
| `ProtectedRoute` | Guard de rutas: redirige a `/login` si no hay token |
| `Loader` | Spinner con label |
| `ErrorMessage` | Mensaje de error inline |

## Identidad visual v2

| Token | Color | Uso |
|-------|-------|-----|
| `--color-bg` | `#0b1220` | Fondo principal |
| `--color-surface` | `#111a2e` | Tarjetas y paneles |
| `--color-primary` | `#6366f1` | Acento principal (índigo) |
| `--color-violet` | `#8b5cf6` | Acento secundario |
| `--color-text` | `#f1f5f9` | Texto principal |
| `--color-muted` | `#94a3b8` | Texto secundario |
| `--color-green` / `--color-red` / `--color-amber` | — | Estados (positivo / negativo / atención) |

> Reemplaza a la paleta "Exchange Board" (navy/ámbar) de Sprint 1.

## Pendiente / fuera de alcance

- Pantallas de Ajustes y Ayuda (deshabilitadas en el sidebar)
- Cuentas, Destinatarios y Tarjetas (deshabilitadas en el sidebar, no se construyen)
- Notificaciones (botón deshabilitado, sin feature de backend todavía)
- Login con Google OAuth (fuera de alcance)

## Miembros

- **P1** — Frontend (React, componentes, routing, temas y animaciones)
- **P2** — Backend: PostgreSQL, tipos, repositorios y servicios de datos + documentación
- **P3** — Backend: Express, autenticación JWT y endpoints