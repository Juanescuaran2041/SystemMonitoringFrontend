# Dashboard de observabilidad — Frontend

Frontend del taller *Sistema de monitoreo de microservicios con Proxy de auditoría y logging*.
Muestra, en tiempo real, las métricas y los logs que produce el proxy de logging del backend.

- **Stack:** React 19 · Vite 8 · Tailwind CSS 4 · Recharts 3
- **Backend:** [MonitoringSystemBackend](https://github.com/Juanescuaran2041/MonitoringSystemBackend) (Spring Boot)
- **Despliegue:** Vercel

> El código está en inglés (componentes, hooks, variables); la documentación, en español.

---

## 1. Qué hace

| Requisito del taller | Dónde se implementa |
|---|---|
| Dashboard con 3 tarjetas: total de llamadas, tasa de éxito, tiempo promedio | `components/dashboard/ServiceCardList.jsx` → `ServiceCard.jsx` |
| Gráfica de líneas con las últimas 20 llamadas por servicio y su tiempo de respuesta | `components/charts/ResponseTimeChart.jsx` ← `hooks/useResponseTimeSeries.js` |
| Tabla de logs en tiempo real con polling cada 3 segundos | `components/logs/LogsTable.jsx` ← `hooks/useServiceLogs.js` + `usePolling.js` |
| Filtros por servicio, estado (SUCCESS/ERROR) y rango de fechas | `components/logs/LogFilters.jsx` |
| Botón "Simular carga" que dispara la simulación y actualiza el dashboard | `components/dashboard/SimulateLoadButton.jsx` |
| Al hacer clic en un log, expandir detalles: parámetros de entrada y respuesta completa | `components/logs/LogRow.jsx` → `LogDetails.jsx` |
| Indicador visual en rojo si la tasa de error supera el 15% | `ServiceCard.jsx`, usando el campo `degraded` del backend |

El umbral del 15% lo calcula el backend y el frontend solo lo pinta: una sola fuente de verdad.

---

## 2. Ejecutar en local

```bash
npm install
cp .env.example .env.local     # VITE_API_URL=http://localhost:8080
npm run dev                    # http://localhost:5173
```

Con el backend corriendo en `http://localhost:8080`. Otros comandos:

```bash
npm run build     # build de producción en dist/
npm run lint      # ESLint (react-hooks + react-refresh)
npm run preview   # sirve el build
```

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base del backend. Sin ella se usa `http://localhost:8080` |

`.env.local` no se versiona; el repositorio solo lleva `.env.example`.

---

## 3. Estructura

```
src/
├── api/                      # única capa que habla HTTP
│   ├── apiClient.js          # fetch + manejo de errores + base URL
│   ├── metricsApi.js         # getSummary, getLogs, simulateLoad
│   └── types.js              # typedefs JSDoc del contrato del backend
├── hooks/
│   ├── usePolling.js         # ejecuta algo cada N ms, con limpieza y abort
│   ├── useMetricsSummary.js  # métricas por servicio
│   ├── useServiceLogs.js     # logs filtrados y paginados
│   └── useResponseTimeSeries.js  # últimas 20 llamadas por servicio para la gráfica
├── components/
│   ├── common/               # Button, Panel, StatusBadge, ErrorMessage
│   ├── dashboard/            # ServiceCard, ServiceCardList, SimulateLoadButton
│   ├── charts/               # ResponseTimeChart
│   └── logs/                 # LogsTable, LogRow, LogDetails, LogFilters
├── pages/DashboardPage.jsx   # compone la pantalla y es dueña de filtros y página
├── utils/formatters.js       # formatDuration, formatPercentage, formatTime, formatJson
└── constants.js              # intervalos, tamaños de página, ids y colores de servicio
```

**Regla de dependencias:** `pages → components → hooks → api`. Ningún componente llama a
`fetch` ni conoce una URL, y ningún hook renderiza JSX.

---

## 4. Buenas prácticas aplicadas

| Práctica | Cómo se cumple |
|---|---|
| Responsabilidad única | `ServiceCard` pinta una tarjeta; los datos los trae `useMetricsSummary` |
| Presentacional vs. contenedor | `DashboardPage` orquesta; el resto son componentes puros y reutilizables |
| Capa de API aislada | Cambiar una ruta o pasar a axios toca un solo archivo |
| Sin valores mágicos | 3 s de polling, 20 llamadas y 20 filas viven en `constants.js` |
| Configuración por entorno | `VITE_API_URL`, nunca una URL escrita en el código |
| Estados explícitos | Cada vista maneja *loading*, *error* y *vacío*, no solo el camino feliz |
| Limpieza de efectos | `usePolling` limpia el `setInterval` y aborta la petición en vuelo al desmontar |
| Peticiones abortadas ≠ errores | `isAbortError` evita mostrar errores falsos al desmontar o cambiar filtros |
| Inmutabilidad | El estado se reemplaza, nunca se muta |
| `key` estable | `key={log.requestId}`, el UUID que genera el proxy |
| Estado en el nivel correcto | La fila expandida es estado local de `LogsTable`; los filtros, de la página |
| Nomenclatura | `PascalCase` componentes · `camelCase` funciones · `useX` hooks · `UPPER_SNAKE_CASE` constantes |
| Accesibilidad | Tabla semántica con `<caption>`, `aria-expanded` en la fila expandible, foco visible, teclado (Enter/Espacio) y el color nunca como único indicador |
| Tipado ligero | JSDoc en la capa de API y en las props, sin añadir un compilador |

---

## 5. Despliegue en Vercel

1. Importar el repositorio (Vercel detecta Vite: build `npm run build`, salida `dist`).
2. En *Settings → Environment Variables* definir `VITE_API_URL=https://<dominio-del-backend>`.
3. En el backend, permitir ese origen con `MONITORING_CORS_ALLOWED_ORIGINS=https://<tu-app>.vercel.app`.
