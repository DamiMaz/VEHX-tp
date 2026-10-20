using System.ComponentModel.DataAnnotations;

namespace AutoCare.Presentation.Inputs;

public class TelemetrySimulateInput
{
    [Required]
    [Range(0.1, 5000.0)]
    public double DistanceKm { get; set; }
}
