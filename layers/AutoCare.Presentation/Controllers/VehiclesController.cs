using AutoCare.BusinessLogic.Interfaces;
using AutoCare.Entities.Entities;
using AutoCare.Presentation.Base;
using AutoCare.Presentation.Inputs;
using AutoCare.Presentation.Outputs;
using Microsoft.AspNetCore.Mvc;

namespace AutoCare.Presentation.Controllers;

[Route("api/vehicles")]
public class VehiclesController : BaseController
{
    private readonly IVehicleManager _vehicleManager;
    private readonly IFuelLogManager _fuelLogManager;
    private readonly IServiceManager _serviceManager;
    private readonly ITelemetryManager _telemetryManager;

    public VehiclesController(
        IVehicleManager vehicleManager,
        IFuelLogManager fuelLogManager,
        IServiceManager serviceManager,
        ITelemetryManager telemetryManager)
    {
        _vehicleManager = vehicleManager;
        _fuelLogManager = fuelLogManager;
        _serviceManager = serviceManager;
        _telemetryManager = telemetryManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var vehicles = await _vehicleManager.GetAllVehiclesAsync();
        var outputs = vehicles.Select(VehicleOutput.FromEntity).ToList();
        return Success(outputs, "Vehículos obtenidos correctamente.");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var vehicle = await _vehicleManager.GetVehicleAsync(id);
        if (vehicle == null)
            return Fail($"Vehículo con ID '{id}' no encontrado.", 404);

        return Success(VehicleOutput.FromEntity(vehicle));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] VehicleCreateInput input)
    {
        if (!ModelState.IsValid)
            return Fail("Datos de entrada inválidos.");

        var entity = new Vehicle
        {
            Brand = input.Brand,
            Model = input.Model,
            Year = input.Year,
            LicensePlate = input.LicensePlate.ToUpperInvariant().Trim(),
            FuelType = input.FuelType,
            TankCapacity = input.TankCapacity,
            DistributionType = input.DistributionType,
            Transmission = input.Transmission,
            InitialOdometer = input.InitialOdometer,
            CurrentOdometer = input.CurrentOdometer,
            Vin = input.Vin,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _vehicleManager.CreateVehicleAsync(entity);
        return Success(VehicleOutput.FromEntity(created), "Vehículo registrado exitosamente.");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] VehicleUpdateInput input)
    {
        if (!ModelState.IsValid)
            return Fail("Datos de entrada inválidos.");

        var existing = await _vehicleManager.GetVehicleAsync(id);
        if (existing == null)
            return Fail($"Vehículo con ID '{id}' no encontrado.", 404);

        existing.Brand = input.Brand;
        existing.Model = input.Model;
        existing.Year = input.Year;
        existing.LicensePlate = input.LicensePlate.ToUpperInvariant().Trim();
        existing.FuelType = input.FuelType;
        existing.TankCapacity = input.TankCapacity;
        existing.DistributionType = input.DistributionType;
        existing.Transmission = input.Transmission;
        existing.CurrentOdometer = input.CurrentOdometer;
        existing.Vin = input.Vin;

        var updated = await _vehicleManager.UpdateVehicleAsync(existing);
        return Success(VehicleOutput.FromEntity(updated), "Vehículo actualizado exitosamente.");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _vehicleManager.DeleteVehicleAsync(id);
        if (!deleted)
            return Fail($"No se pudo eliminar el vehículo con ID '{id}'.", 404);

        return Success(true, "Vehículo eliminado exitosamente.");
    }

    [HttpGet("{id}/dashboard")]
    public async Task<IActionResult> GetDashboardSummary(string id)
    {
        var vehicle = await _vehicleManager.GetVehicleAsync(id);
        if (vehicle == null)
            return Fail($"Vehículo con ID '{id}' no encontrado.", 404);

        var telemetry = await _telemetryManager.GetTelemetryStateAsync(id);
        var services = await _serviceManager.GetVehicleServiceEvaluationsAsync(id);
        var fuelLogs = await _fuelLogManager.GetEnrichedFuelLogsAsync(id);

        var nextService = services.FirstOrDefault();
        double totalDistance = fuelLogs.Sum(l => l.TripDistance);
        double totalLiters = fuelLogs.Sum(l => l.Liters);
        double fuelAvg = totalLiters > 0 ? Math.Round(totalDistance / totalLiters, 2) : 11.5;

        int warningOrOverdue = services.Count(s => s.Status != AutoCare.Entities.Enums.ServiceStatus.Ok);

        var summary = new DashboardSummaryOutput
        {
            Vehicle = VehicleOutput.FromEntity(vehicle),
            Telemetry = TelemetryOutput.FromEntity(telemetry),
            NextServiceDue = nextService != null ? ServiceItemOutput.FromEvaluation(nextService) : null,
            FuelAvgKmPerL = fuelAvg,
            DriveTimeHours = Math.Round(totalDistance / 48.0, 1),
            DriveScore = 94,
            TotalServicesWarningOrOverdue = warningOrOverdue,
            TotalFuelLogsCount = fuelLogs.Count
        };

        return Success(summary, "Dashboard consolidado obtenido exitosamente.");
    }
}
