using System.ComponentModel.DataAnnotations;

namespace AutoCare.Presentation.Inputs;

public class ServiceItemCreateInput
{
    [Required]
    public string VehicleId { get; set; } = string.Empty;

    [Required]
    public string Name { get; set; } = string.Empty;

    public string Category { get; set; } = "General";

    [Range(0, 500000)]
    public int IntervalKm { get; set; }

    [Range(0, 3650)]
    public int IntervalDays { get; set; }

    [Range(0, 2000000)]
    public int LastServiceKm { get; set; }

    public DateTime? LastServiceDate { get; set; }

    public decimal? Cost { get; set; }

    public string? Workshop { get; set; }

    public string? Notes { get; set; }
}
