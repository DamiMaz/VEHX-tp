using System.ComponentModel.DataAnnotations;

namespace AutoCare.Presentation.Inputs;

public class TelemetryCalibrateInput
{
    [Required]
    [Range(0, 2000000)]
    public int DashboardOdometer { get; set; }
}
