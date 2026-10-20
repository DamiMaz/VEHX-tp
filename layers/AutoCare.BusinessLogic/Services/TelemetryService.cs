using AutoCare.Core.Utils;
using AutoCare.Entities.Entities;

namespace AutoCare.BusinessLogic.Services;

/// <summary>
/// Servicio especializado en simulación de telemetría móvil y autocalibración con odómetro de tablero.
/// </summary>
public class TelemetryService : ITelemetryService
{
    public TelemetrySimulationResult SimulateMovement(TelemetryRecord record, Vehicle vehicle, double distanceKm)
    {
        int prevOdometer = record.SimulatedOdometer > 0 ? record.SimulatedOdometer : vehicle.CurrentOdometer;
        double effectiveDelta = distanceKm * (record.CorrectionFactorAlpha > 0 ? record.CorrectionFactorAlpha : 1.0);

        record.AccumulatedTelemetryKm += distanceKm;
        record.SimulatedOdometer = prevOdometer + (int)Math.Round(effectiveDelta);
        record.LastSyncDate = DateTime.UtcNow;

        return new TelemetrySimulationResult(
            Telemetry: record,
            PreviousOdometer: prevOdometer,
            NewSimulatedOdometer: record.SimulatedOdometer,
            AddedKm: distanceKm
        );
    }

    public TelemetryCalibrationResult CalibrateWithDashboardOdometer(
        TelemetryRecord record, 
        Vehicle vehicle, 
        int dashboardOdometer)
    {
        int currentVirtual = record.SimulatedOdometer > 0 ? record.SimulatedOdometer : vehicle.CurrentOdometer;
        double errorDelta = dashboardOdometer - currentVirtual;

        double newAlpha = record.CorrectionFactorAlpha;
        if (record.AccumulatedTelemetryKm > 5.0)
        {
            // Ajustar suavemente factor alfa según error registrado
            double calculatedRatio = (record.AccumulatedTelemetryKm + errorDelta) / record.AccumulatedTelemetryKm;
            newAlpha = Math.Clamp(MathUtils.Round2(calculatedRatio), 0.85, 1.25);
        }

        record.CorrectionFactorAlpha = newAlpha;
        record.CalibrationErrorDeltaKm = MathUtils.Round2(errorDelta);
        record.SimulatedOdometer = dashboardOdometer;
        record.AccumulatedTelemetryKm = 0;
        record.LastSyncDate = DateTime.UtcNow;

        return new TelemetryCalibrationResult(
            Telemetry: record,
            RealDashboardOdometer: dashboardOdometer,
            ErrorDeltaKm: record.CalibrationErrorDeltaKm,
            NewAlphaFactor: newAlpha
        );
    }
}
