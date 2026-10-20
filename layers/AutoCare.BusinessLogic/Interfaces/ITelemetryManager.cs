using AutoCare.BusinessLogic.Services;
using AutoCare.Entities.Entities;

namespace AutoCare.BusinessLogic.Interfaces;

public interface ITelemetryManager
{
    Task<TelemetryRecord> GetTelemetryStateAsync(string vehicleId);
    Task<TelemetrySimulationResult> SimulateMovementAsync(string vehicleId, double distanceKm);
    Task<TelemetryCalibrationResult> CalibrateTelemetryAsync(string vehicleId, int dashboardOdometer);
}
