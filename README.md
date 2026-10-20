# AutoCare Pro • Sistema de Gestión Vehicular, Control de Combustible y Mantenimiento Predictivo

Sistema integral para la administración inteligente de flotas y automóviles particulares, compuesto por una **API RESTful desarrollada en C# .NET 9 con arquitectura N-Layers estricta** (basada en los lineamientos del documento *"Guía para crear una API REST con arquitectura N-Layers en C#"*) y un **Frontend interactivo desarrollado en React + TypeScript + Vite + Tailwind CSS**.

---

## 🏛️ Arquitectura N-Layers de la Solución (.NET 9)

Siguiendo el diseño y estructura recomendada de la guía oficial, la solución se organiza física y lógicamente en tres carpetas principales (`backend`, `core` y `layers`):

```text
AutoCare.sln
├── backend/
│   └── AutoCare.Api/                         # Host / Composition Root (Web API)
│       ├── Properties/
│       │   └── launchSettings.json           # Configuración de arranque (puerto 5000, Scalar/Swagger)
│       ├── appsettings.json                  # Cadenas de conexión (SQLite por defecto / SQL Server)
│       ├── appsettings.Development.json
│       └── Program.cs                        # Registro de DI, Middleware, DbContext y Mapeo de Rutas
│
├── core/
│   └── AutoCare.Core/                        # Transversal / Compartido
│       ├── Constants/                        # SystemConstants (umbrales de alerta, ritmo por defecto)
│       ├── Helpers/                          # DateHelper (meses en español, cálculo de días)
│       └── Utils/                            # ValidationUtils, MathUtils (fórmula Haversine, redondeos)
│
└── layers/
    ├── AutoCare.Presentation/                # Capa de Entrada / Exposición HTTP
    │   ├── Base/
    │   │   ├── BaseController.cs             # Controlador base (Success, Fail, centralización de respuestas)
    │   │   └── ApiResponse.cs                # Formato estándar de respuesta JSON (code, data, message, success)
    │   ├── Controllers/
    │   │   ├── VehiclesController.cs         # Endpoints CRUD de Garaje y Dashboard Consolidado
    │   │   ├── FuelLogsController.cs         # Endpoints de Cargas de Combustible y Matriz Mensual
    │   │   ├── ServicesController.cs         # Endpoints de Planes Preventivos y Bitácora Clínica
    │   │   └── TelemetryController.cs        # Endpoints de Odómetro Virtual y Calibración
    │   ├── Inputs/                           # DTOs de Request (VehicleCreateInput, FuelLogCreateInput, etc.)
    │   └── Outputs/                          # DTOs de Response (VehicleOutput, FuelLogOutput, ServiceItemOutput, etc.)
    │
    ├── AutoCare.BusinessLogic/               # Reglas de Negocio
    │   ├── Interfaces/                       # IVehicleManager, IFuelLogManager, IServiceManager, ITelemetryManager
    │   ├── Managers/                         # Coordinadores por entidad (VehicleManager, FuelLogManager, etc.)
    │   └── Services/                         # Servicios especializados:
    │       ├── FuelCalculationService.cs     # Motor matemático de cargas parciales y matriz con anomalías (>15%)
    │       ├── ServicePredictorService.cs    # Motor predictivo bimodal (Desgaste Odómetro vs Tiempo Calendario)
    │       └── TelemetryService.cs           # Simulación de odómetro virtual y autocalibración factor alfa
    │
    ├── AutoCare.DataAccess/                  # Persistencia y Acceso a Datos
    │   ├── AppDbContext.cs                   # DbContext de Entity Framework Core (DbSet y Fluent API)
    │   ├── DbInitializer.cs                  # Seeder con 6 meses de cargas, mantenimientos y vehículo de prueba
    │   ├── Interfaces/                       # IVehicleStore, IFuelLogStore, IServiceItemStore, IServiceLogStore, ITelemetryStore
    │   └── Stores/                           # Implementaciones concretas de acceso a DB con EF Core
    │
    └── AutoCare.Entities/                    # Dominio Puro (Objetos anémicos)
        ├── Entities/                         # Vehicle, FuelLog, ServiceItem, ServiceLogRecord, TelemetryRecord
        └── Enums/                            # FuelType, TransmissionType, DistributionType, RouteType, ServiceStatus
```

---

## 🔄 Dirección y Flujo de Dependencias

Se respeta de manera estricta la regla fundamental de arquitectura por capas: **ninguna capa depende de una capa superior**.

```text
       ┌────────────────────────┐
       │      AutoCare.Api      │ (Host / Entry Point)
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │ AutoCare.Presentation  │ (Controllers, Inputs, Outputs)
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │ AutoCare.BusinessLogic │ (Managers, Specialized Services)
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │   AutoCare.DataAccess  │ (Stores, AppDbContext)
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │    AutoCare.Entities   │ (Entities, Enums)
       └────────────────────────┘
                   ▲
                   │ (Uso transversal)
       ┌────────────────────────┐
       │     AutoCare.Core      │ (Constants, Helpers, Utils)
       └────────────────────────┘
```

---

## ⚡ Flujo de una Petición HTTP (Pipeline)

1. **Cliente HTTP / Front:** Envía una solicitud (e.g., `POST /api/fuel`).
2. **Presentation:** Recibe los datos, los valida contra el modelo `FuelLogCreateInput` e invoca al `FuelLogManager`.
3. **BusinessLogic (Manager):** Valida las reglas de negocio (e.g. odómetro estrictamente mayor al anterior), llama a los servicios especializados (`FuelCalculationService` y `TelemetryService`) para enriquecer la carga, y coordina los Stores.
4. **DataAccess (Store):** Persiste los registros en la base de datos a través de `AppDbContext` (EF Core).
5. **Base de Datos:** SQLite / SQL Server guarda las entidades anémicas de `AutoCare.Entities`.
6. **Retorno:** El Store devuelve las entidades al Manager, el Manager transforma los resultados en `FuelLogOutput` y el Controller construye una respuesta uniforme `ApiResponse<T>`.

---

## 🛠️ Cómo Iniciar el Backend (.NET 9)

### 1. Compilar la solución
```bash
dotnet build AutoCare.sln
```

### 2. Ejecutar la API
```bash
dotnet run --project backend/AutoCare.Api/AutoCare.Api.csproj
```
* La API iniciará en: `http://localhost:5000`
* **Documentación interactiva de Endpoints (OpenAPI / Scalar UI):** `http://localhost:5000/scalar/v1` (o ingresando a `http://localhost:5000/`)
* La base de datos SQLite (`autocare.db`) se crea e inicializa automáticamente en el primer inicio con el **Seed Data** completo del vehículo, bitácora de combustible y planes de service.

---

## 📱 Cómo Iniciar el Frontend (React + Vite)

El frontend web se encuentra ubicado en el directorio `frontend/`:

```bash
cd frontend
npm install
npm run dev
```
La aplicación cliente estará disponible en: `http://localhost:5173`.

---

## 📡 Catálogo de Endpoints Principales

| Módulo | Método | Ruta | Descripción |
|---|---|---|---|
| **Vehículos** | `GET` | `/api/vehicles` | Listado completo de vehículos del garaje |
| | `GET` | `/api/vehicles/{id}` | Obtener ficha técnica de un rodado |
| | `POST` | `/api/vehicles` | Dar de alta un vehículo nuevo |
| | `PUT` | `/api/vehicles/{id}` | Actualizar datos y odómetro de tablero |
| | `DELETE` | `/api/vehicles/{id}` | Eliminar vehículo del garaje |
| | `GET` | `/api/vehicles/{id}/dashboard` | Resumen consolidado para la pantalla de inicio |
| **Combustible** | `GET` | `/api/fuel/vehicle/{vehicleId}` | Historial enriquecido con cálculo de cargas parciales |
| | `POST` | `/api/fuel` | Asentar nueva carga de combustible |
| | `DELETE` | `/api/fuel/{id}` | Eliminar registro de combustible |
| | `GET` | `/api/fuel/matrix/{vehicleId}` | Matriz mensual analítica con variaciones y detector de anomalías |
| | `GET` | `/api/fuel/daily-rhythm/{vehicleId}` | Ritmo de uso promedio histórico (km/día) |
| **Mantenimientos** | `GET` | `/api/services/vehicle/{vehicleId}` | Planes evaluados por motor bimodal (Desgaste km vs tiempo) |
| | `POST` | `/api/services` | Crear nuevo plan de mantenimiento preventivo |
| | `POST` | `/api/services/{id}/perform` | Asentar service realizado en la bitácora clínica |
| | `GET` | `/api/services/logs/{vehicleId}` | Historial clínico de services completados |
| **Telemetría** | `GET` | `/api/telemetry/{vehicleId}` | Estado actual del odómetro virtual y factor $\alpha$ |
| | `POST` | `/api/telemetry/{vehicleId}/simulate` | Simular trayectos en km sumando al odómetro virtual |
| | `POST` | `/api/telemetry/{vehicleId}/calibrate` | Calibrar telemetría con lectura real de tablero y reajustar factor $\alpha$ |
