using AutoCare.BusinessLogic.Interfaces;
using AutoCare.BusinessLogic.Services;
using AutoCare.DataAccess.Interfaces;
using AutoCare.Entities.Entities;

namespace AutoCare.BusinessLogic.Managers;

/// <summary>
/// Coordinador de negocio para la telemetría vehicular y odómetro virtual.
/// </summary>
public class TelemetryManager : ITelemetryManager
{
    private readonly ITelemetryStore _telemetryStore;
    private readonly IVehicleStore _vehicleStore;
    private readonly IFuelLogStore _fuelLogStore;
    private readonly ITelemetryService _telemetryService;
    private readonly IFuelCalculationService _calculationService;

    public TelemetryManager(
        ITelemetryStore telemetryStore,
        IVehicleStore vehicleStore,
        IFuelLogStore fuelLogStore,
        ITelemetryService telemetryService,
        IFuelCalculationService calculationService)
    {
        _telemetryStore = telemetryStore;
        _vehicleStore = vehicleStore;
        _fuelLogStore = fuelLogStore;
        _telemetryService = telemetryService;
        _calculationService = calculationService;
    }

    public async Task<TelemetryRecord> GetTelemetryStateAsync(string vehicleId)
    {
        var vehicle = await _vehicleStore.GetByIdAsync(vehicleId);
        if (vehicle == null)
            throw new KeyNotFoundException($"No se encontró el vehículo '{vehicleId}'.");

        var record = await _telemetryStore.GetByVehicleIdAsync(vehicleId);
        if (record == null)
        {
            var fuelLogs = await _fuelLogStore.GetByVehicleIdAsync(vehicleId);
            double dailyRhythm = _calculationService.CalculateDailyRhythm(fuelLogs, vehicle);

            record = new TelemetryRecord
            {
                Id = Guid.NewGuid().ToString(),
                VehicleId = vehicleId,
                SimulatedOdometer = vehicle.CurrentOdometer,
                DailyRhythmKm = dailyRhythm,
                CorrectionFactorAlpha = 1.0,
                AccumulatedTelemetryKm = 0,
                LastSyncDate = DateTime.UtcNow,
                CalibrationErrorDeltaKm = 0
            };
            await _telemetryStore.SaveOrUpdateAsync(record);
        }

        return record;
    }

    public async Task<TelemetrySimulationResult> SimulateMovementAsync(string vehicleId, double distanceKm)
    {
        if (distanceKm <= 0)
            throw new ArgumentException("La distancia a simular debe ser mayor a 0 km.");

        var vehicle = await _vehicleStore.GetByIdAsync(vehicleId);
        if (vehicle == null)
            throw new KeyNotFoundException($"No se encontró el vehículo '{vehicleId}'.");

        var telemetry = await GetTelemetryStateAsync(vehicleId);
        var result = _telemetryService.SimulateMovement(telemetry, vehicle, distanceKm);

        await _telemetryStore.SaveOrUpdateAsync(telemetry);
        return result;
    }

    public async Task<TelemetryCalibrationResult> CalibrateTelemetryAsync(string vehicleId, int dashboardOdometer)
    {
        var vehicle = await _vehicleStore.GetByIdAsync(vehicleId);
        if (vehicle == null)
            throw new KeyNotFoundException($"No se encontró el vehículo '{vehicleId}'.");

        if (dashboardOdometer < vehicle.InitialOdometer)
            throw new ArgumentException("El odómetro del tablero no puede ser menor al odómetro inicial del rodado.");

        var telemetry = await GetTelemetryStateAsync(vehicleId);
        var result = _telemetryService.CalibrateWithDashboardOdometer(telemetry, vehicle, dashboardOdometer);

        // Actualizar vehículo
        vehicle.CurrentOdometer = dashboardOdometer;
        await _vehicleStore.UpdateAsync(vehicle);

        // Recalcular ritmo histórico
        var fuelLogs = await _fuelLogStore.GetByVehicleIdAsync(vehicleId);
        telemetry.DailyRhythmKm = _calculationService.CalculateDailyRhythm(fuelLogs, vehicle);

        await _telemetryStore.SaveOrUpdateAsync(telemetry);
        return result;
    }
}
