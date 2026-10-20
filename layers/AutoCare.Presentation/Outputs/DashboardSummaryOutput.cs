namespace AutoCare.Presentation.Outputs;

public class DashboardSummaryOutput
{
    public VehicleOutput Vehicle { get; set; } = null!;
    public TelemetryOutput Telemetry { get; set; } = null!;
    public ServiceItemOutput? NextServiceDue { get; set; }
    public double FuelAvgKmPerL { get; set; }
    public double DriveTimeHours { get; set; }
    public int DriveScore { get; set; }
    public int TotalServicesWarningOrOverdue { get; set; }
    public int TotalFuelLogsCount { get; set; }
}
