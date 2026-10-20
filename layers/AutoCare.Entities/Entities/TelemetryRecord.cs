namespace AutoCare.Entities.Entities;

/// <summary>
/// Estado y parámetros de telemetría de un vehículo (odómetro virtual, factor alfa, etc.).
/// </summary>
public class TelemetryRecord
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string VehicleId { get; set; } = string.Empty;
    public int SimulatedOdometer { get; set; }
    public double DailyRhythmKm { get; set; } = 42.0;
    public double CorrectionFactorAlpha { get; set; } = 1.0;
    public double AccumulatedTelemetryKm { get; set; }
    public DateTime LastSyncDate { get; set; } = DateTime.UtcNow;
    public double CalibrationErrorDeltaKm { get; set; }
}
