using AutoCare.Entities.Entities;

namespace AutoCare.BusinessLogic.Services;

public record TelemetrySimulationResult(
    TelemetryRecord Telemetry,
    int PreviousOdometer,
    int NewSimulatedOdometer,
    double AddedKm
);

public record TelemetryCalibrationResult(
    TelemetryRecord Telemetry,
    int RealDashboardOdometer,
    double ErrorDeltaKm,
    double NewAlphaFactor
);

public interface ITelemetryService
{
    TelemetrySimulationResult SimulateMovement(TelemetryRecord record, Vehicle vehicle, double distanceKm);
    TelemetryCalibrationResult CalibrateWithDashboardOdometer(TelemetryRecord record, Vehicle vehicle, int dashboardOdometer);
}
