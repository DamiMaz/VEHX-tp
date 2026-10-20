using AutoCare.Entities.Entities;
using AutoCare.Entities.Enums;
using Microsoft.EntityFrameworkCore;

namespace AutoCare.DataAccess;

/// <summary>
/// Inicializador de base de datos con datos de prueba (Seed Data) acordes al PRD de Gestión Vehicular.
/// </summary>
public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        if (await context.Vehicles.AnyAsync())
        {
            return; // Ya fue inicializada
        }

        // 1. Vehículo Principal
        var vehicle = new Vehicle
        {
            Id = "veh-001",
            Brand = "Toyota",
            Model = "Corolla 2.0 Dynamic Force XEI (Urban X)",
            Year = 2022,
            LicensePlate = "AF 842 XP",
            FuelType = FuelType.NaftaSuper,
            TankCapacity = 50.0,
            DistributionType = DistributionType.Cadena,
            Transmission = TransmissionType.Automatica,
            InitialOdometer = 10000,
            CurrentOdometer = 17480,
            Vin = "8AJBA3BE2N0194821",
            CreatedAt = new DateTime(2026, 4, 1, 8, 0, 0, DateTimeKind.Utc)
        };

        await context.Vehicles.AddAsync(vehicle);

        // 2. 14 Cargas de combustible (Mayo a Octubre 2026 con cargas parciales)
        var fuelLogs = new List<FuelLog>
        {
            new() { Id = "fuel-01", VehicleId = "veh-001", Date = new DateTime(2026, 5, 4, 8, 30, 0, DateTimeKind.Utc), Odometer = 10450, Liters = 38.5, TotalCost = 46200, CostPerLiter = 1200, IsFullTank = true, RouteType = RouteType.Mixto, FuelGrade = "Súper" },
            new() { Id = "fuel-02", VehicleId = "veh-001", Date = new DateTime(2026, 5, 18, 19, 15, 0, DateTimeKind.Utc), Odometer = 10920, Liters = 40.2, TotalCost = 48240, CostPerLiter = 1200, IsFullTank = true, RouteType = RouteType.Ciudad, FuelGrade = "Súper" },
            new() { Id = "fuel-03", VehicleId = "veh-001", Date = new DateTime(2026, 6, 2, 9, 0, 0, DateTimeKind.Utc), Odometer = 11390, Liters = 41.0, TotalCost = 51250, CostPerLiter = 1250, IsFullTank = true, RouteType = RouteType.Ruta, FuelGrade = "Súper" },
            new() { Id = "fuel-04", VehicleId = "veh-001", Date = new DateTime(2026, 6, 14, 17, 45, 0, DateTimeKind.Utc), Odometer = 11620, Liters = 15.0, TotalCost = 18750, CostPerLiter = 1250, IsFullTank = false, RouteType = RouteType.Ciudad, FuelGrade = "Súper" },
            new() { Id = "fuel-05", VehicleId = "veh-001", Date = new DateTime(2026, 6, 25, 14, 10, 0, DateTimeKind.Utc), Odometer = 12100, Liters = 28.5, TotalCost = 35625, CostPerLiter = 1250, IsFullTank = true, RouteType = RouteType.Mixto, FuelGrade = "Súper" },
            new() { Id = "fuel-06", VehicleId = "veh-001", Date = new DateTime(2026, 7, 8, 8, 20, 0, DateTimeKind.Utc), Odometer = 12650, Liters = 44.0, TotalCost = 57200, CostPerLiter = 1300, IsFullTank = true, RouteType = RouteType.Ruta, FuelGrade = "Súper" },
            new() { Id = "fuel-07", VehicleId = "veh-001", Date = new DateTime(2026, 7, 22, 18, 30, 0, DateTimeKind.Utc), Odometer = 13220, Liters = 43.5, TotalCost = 56550, CostPerLiter = 1300, IsFullTank = true, RouteType = RouteType.Mixto, FuelGrade = "Súper" },
            new() { Id = "fuel-08", VehicleId = "veh-001", Date = new DateTime(2026, 8, 5, 12, 0, 0, DateTimeKind.Utc), Odometer = 13800, Liters = 45.0, TotalCost = 60750, CostPerLiter = 1350, IsFullTank = true, RouteType = RouteType.Ciudad, FuelGrade = "Súper" },
            new() { Id = "fuel-09", VehicleId = "veh-001", Date = new DateTime(2026, 8, 16, 16, 20, 0, DateTimeKind.Utc), Odometer = 14040, Liters = 18.0, TotalCost = 24300, CostPerLiter = 1350, IsFullTank = false, RouteType = RouteType.Ciudad, FuelGrade = "Súper" },
            new() { Id = "fuel-10", VehicleId = "veh-001", Date = new DateTime(2026, 8, 28, 20, 10, 0, DateTimeKind.Utc), Odometer = 14550, Liters = 39.0, TotalCost = 52650, CostPerLiter = 1350, IsFullTank = true, RouteType = RouteType.Mixto, FuelGrade = "Súper" },
            new() { Id = "fuel-11", VehicleId = "veh-001", Date = new DateTime(2026, 9, 10, 10, 40, 0, DateTimeKind.Utc), Odometer = 15150, Liters = 48.0, TotalCost = 67200, CostPerLiter = 1400, IsFullTank = true, RouteType = RouteType.Ciudad, FuelGrade = "Súper" },
            new() { Id = "fuel-12", VehicleId = "veh-001", Date = new DateTime(2026, 9, 24, 19, 0, 0, DateTimeKind.Utc), Odometer = 15720, Liters = 50.5, TotalCost = 70700, CostPerLiter = 1400, IsFullTank = true, RouteType = RouteType.Ciudad, FuelGrade = "Súper" },
            new() { Id = "fuel-13", VehicleId = "veh-001", Date = new DateTime(2026, 10, 2, 8, 15, 0, DateTimeKind.Utc), Odometer = 16350, Liters = 45.2, TotalCost = 65540, CostPerLiter = 1450, IsFullTank = true, RouteType = RouteType.Mixto, FuelGrade = "Premium" },
            new() { Id = "fuel-14", VehicleId = "veh-001", Date = new DateTime(2026, 10, 10, 18, 40, 0, DateTimeKind.Utc), Odometer = 17100, Liters = 49.0, TotalCost = 71050, CostPerLiter = 1450, IsFullTank = true, RouteType = RouteType.Mixto, FuelGrade = "Premium" }
        };

        await context.FuelLogs.AddRangeAsync(fuelLogs);

        // 3. Mantenimientos Preventivos Programados
        var serviceItems = new List<ServiceItem>
        {
            new()
            {
                Id = "srv-01",
                VehicleId = "veh-001",
                Name = "Kit de Distribución (Cadena)",
                Category = "Distribución",
                IntervalKm = 120000,
                IntervalDays = 1825, // 5 años
                LastServiceKm = 0,
                LastServiceDate = new DateTime(2024, 1, 15, 0, 0, 0, DateTimeKind.Utc),
                Cost = 185000,
                Workshop = "Concesionario Oficial Toyota",
                Notes = "Inspección de tensor hidráulico y guía de cadena"
            },
            new()
            {
                Id = "srv-02",
                VehicleId = "veh-001",
                Name = "Cambio de Aceite Sintético 0W-20 & Filtros",
                Category = "Aceite",
                IntervalKm = 10000,
                IntervalDays = 365,
                LastServiceKm = 8200,
                LastServiceDate = new DateTime(2026, 2, 10, 0, 0, 0, DateTimeKind.Utc),
                Cost = 94000,
                Workshop = "Lubricentro Box Rápido",
                Notes = "Aceite Toyota Motor Oil 0W-20 Sintético + Filtro original Denso"
            },
            new()
            {
                Id = "srv-03",
                VehicleId = "veh-001",
                Name = "Purga y Reemplazo de Líquido de Frenos DOT 4",
                Category = "Frenos",
                IntervalKm = 40000,
                IntervalDays = 730, // 2 años
                LastServiceKm = 2000,
                LastServiceDate = new DateTime(2024, 6, 15, 0, 0, 0, DateTimeKind.Utc),
                Cost = 58000,
                Workshop = "Taller Especializado Frenos Centro",
                Notes = "Comprobar punto de ebullición y humedad > 3.5%"
            }
        };

        await context.ServiceItems.AddRangeAsync(serviceItems);

        // 4. Bitácora Clínica de Services
        var serviceLogs = new List<ServiceLogRecord>
        {
            new()
            {
                Id = "slog-01",
                VehicleId = "veh-001",
                ServiceItemId = "srv-02",
                ServiceName = "Cambio de Aceite Sintético & Filtros",
                Date = new DateTime(2026, 2, 10, 0, 0, 0, DateTimeKind.Utc),
                Odometer = 8200,
                Cost = 88000,
                Workshop = "Lubricentro Box Rápido",
                InvoiceNumber = "FAC-0004-0019283",
                Notes = "Filtro de aire y habitáculo cambiados preventivamente"
            },
            new()
            {
                Id = "slog-02",
                VehicleId = "veh-001",
                ServiceItemId = "srv-03",
                ServiceName = "Revisión General y Purga DOT 4",
                Date = new DateTime(2024, 6, 15, 0, 0, 0, DateTimeKind.Utc),
                Odometer = 2000,
                Cost = 45000,
                Workshop = "Taller Especializado Frenos Centro",
                InvoiceNumber = "FAC-0001-0008472",
                Notes = "Primer chequeo oficial de fluidos"
            }
        };

        await context.ServiceLogRecords.AddRangeAsync(serviceLogs);

        // 5. Telemetría Inicial
        var telemetry = new TelemetryRecord
        {
            Id = "tel-001",
            VehicleId = "veh-001",
            SimulatedOdometer = 17480,
            DailyRhythmKm = 42.0,
            CorrectionFactorAlpha = 1.02,
            AccumulatedTelemetryKm = 0,
            LastSyncDate = DateTime.UtcNow,
            CalibrationErrorDeltaKm = 0
        };

        await context.TelemetryRecords.AddAsync(telemetry);

        await context.SaveChangesAsync();
    }
}
