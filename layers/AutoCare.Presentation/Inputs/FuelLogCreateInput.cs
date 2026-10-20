using System.ComponentModel.DataAnnotations;
using AutoCare.Entities.Enums;

namespace AutoCare.Presentation.Inputs;

public class FuelLogCreateInput
{
    [Required]
    public string VehicleId { get; set; } = string.Empty;

    public DateTime? Date { get; set; }

    [Required]
    [Range(0, 2000000)]
    public int Odometer { get; set; }

    [Required]
    [Range(0.1, 500.0)]
    public double Liters { get; set; }

    [Required]
    [Range(0.01, 10000000.0)]
    public decimal TotalCost { get; set; }

    public decimal CostPerLiter { get; set; }

    /// <summary>
    /// Switch clave del PRD: ¿Se llenó el tanque al 100%?
    /// </summary>
    public bool IsFullTank { get; set; } = true;

    public RouteType RouteType { get; set; } = RouteType.Ciudad;

    public string? FuelGrade { get; set; } = "Súper";

    public string? TicketPhotoUrl { get; set; }
}
