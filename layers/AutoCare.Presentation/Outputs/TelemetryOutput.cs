using AutoCare.Entities.Entities;

namespace AutoCare.Presentation.Outputs;

public class TelemetryOutput
{
    public string Id { get; set; } = string.Empty;
    public string VehicleId { get; set; } = string.Empty;
    public int SimulatedOdometer { get; set; }
    public double DailyRhythmKm { get; set; }
    public double CorrectionFactorAlpha { get; set; }
    public double AccumulatedTelemetryKm { get; set; }
    public DateTime LastSyncDate { get; set; }
    public double CalibrationErrorDeltaKm { get; set; }

    public static TelemetryOutput FromEntity(TelemetryRecord record) => new()
    {
        Id = record.Id,
        VehicleId = record.VehicleId,
        SimulatedOdometer = record.SimulatedOdometer,
        DailyRhythmKm = record.DailyRhythmKm,
        CorrectionFactorAlpha = record.CorrectionFactorAlpha,
        AccumulatedTelemetryKm = record.AccumulatedTelemetryKm,
        LastSyncDate = record.LastSyncDate,
        CalibrationErrorDeltaKm = record.CalibrationErrorDeltaKm
    };
}
