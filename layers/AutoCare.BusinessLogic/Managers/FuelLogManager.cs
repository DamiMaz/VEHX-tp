using AutoCare.BusinessLogic.Interfaces;
using AutoCare.BusinessLogic.Services;
using AutoCare.DataAccess.Interfaces;
using AutoCare.Entities.Entities;

namespace AutoCare.BusinessLogic.Managers;

/// <summary>
/// Coordinador de negocio para las cargas de combustible (combina stores, motor de cálculo y telemetría).
/// </summary>
public class FuelLogManager : IFuelLogManager
{
    private readonly IFuelLogStore _fuelLogStore;
    private readonly IVehicleStore _vehicleStore;
    private readonly ITelemetryStore _telemetryStore;
    private readonly IFuelCalculationService _calculationService;
    private readonly ITelemetryService _telemetryService;

    public FuelLogManager(
        IFuelLogStore fuelLogStore,
        IVehicleStore vehicleStore,
        ITelemetryStore telemetryStore,
        IFuelCalculationService calculationService,
        ITelemetryService telemetryService)
    {
        _fuelLogStore = fuelLogStore;
        _vehicleStore = vehicleStore;
        _telemetryStore = telemetryStore;
        _calculationService = calculationService;
        _telemetryService = telemetryService;
    }

    public async Task<FuelLog?> GetFuelLogAsync(string id)
    {
        return await _fuelLogStore.GetByIdAsync(id);
    }

    public async Task<List<FuelLog>> GetEnrichedFuelLogsAsync(string vehicleId)
    {
        var vehicle = await _vehicleStore.GetByIdAsync(vehicleId);
        if (vehicle == null)
            throw new KeyNotFoundException($"No se encontró el vehículo '{vehicleId}'.");

        var logs = await _fuelLogStore.GetByVehicleIdAsync(vehicleId);
        return _calculationService.EnrichFuelLogs(logs, vehicle);
    }

    public async Task<FuelLog> CreateFuelLogAsync(FuelLog log)
    {
        var vehicle = await _vehicleStore.GetByIdAsync(log.VehicleId);
        if (vehicle == null)
            throw new KeyNotFoundException($"No se encontró el vehículo con ID '{log.VehicleId}'.");

        var existingLogs = await _fuelLogStore.GetByVehicleIdAsync(log.VehicleId);
        var lastLog = existingLogs.OrderByDescending(l => l.Odometer).FirstOrDefault();

        int referenceOdometer = lastLog?.Odometer ?? vehicle.InitialOdometer;
        if (log.Odometer <= referenceOdometer)
        {
            throw new ArgumentException(
                $"El odómetro ingresado ({log.Odometer} km) debe ser estrictamente mayor al anterior registrado ({referenceOdometer} km).");
        }

        if (log.Liters <= 0)
            throw new ArgumentException("Los litros cargados deben ser un número positivo.");

        if (log.TotalCost <= 0)
            throw new ArgumentException("El costo total debe ser mayor a 0.");

        if (string.IsNullOrWhiteSpace(log.Id))
            log.Id = Guid.NewGuid().ToString();

        // Guardar la carga
        var created = await _fuelLogStore.CreateAsync(log);

        // Actualizar odómetro real del vehículo en garaje
        if (log.Odometer > vehicle.CurrentOdometer)
        {
            vehicle.CurrentOdometer = log.Odometer;
            await _vehicleStore.UpdateAsync(vehicle);
        }

        // Recalibrar odómetro virtual de telemetría automáticamente con la lectura de tablero
        var telemetry = await _telemetryStore.GetByVehicleIdAsync(vehicle.Id);
        if (telemetry != null)
        {
            _telemetryService.CalibrateWithDashboardOdometer(telemetry, vehicle, log.Odometer);
            
            // Recalcular ritmo histórico
            var updatedLogs = await _fuelLogStore.GetByVehicleIdAsync(vehicle.Id);
            telemetry.DailyRhythmKm = _calculationService.CalculateDailyRhythm(updatedLogs, vehicle);
            await _telemetryStore.SaveOrUpdateAsync(telemetry);
        }

        return created;
    }

    public async Task<bool> DeleteFuelLogAsync(string id)
    {
        return await _fuelLogStore.DeleteAsync(id);
    }

    public async Task<List<MonthlyMatrixRow>> GetMonthlyMatrixAsync(string vehicleId)
    {
        var enriched = await GetEnrichedFuelLogsAsync(vehicleId);
        return _calculationService.GenerateMonthlyMatrix(enriched);
    }

    public async Task<double> GetDailyRhythmAsync(string vehicleId)
    {
        var vehicle = await _vehicleStore.GetByIdAsync(vehicleId);
        if (vehicle == null) return 42.0;

        var logs = await _fuelLogStore.GetByVehicleIdAsync(vehicleId);
        return _calculationService.CalculateDailyRhythm(logs, vehicle);
    }
}
