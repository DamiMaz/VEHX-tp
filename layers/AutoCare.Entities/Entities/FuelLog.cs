using AutoCare.Entities.Enums;

namespace AutoCare.Entities.Entities;

/// <summary>
/// Representa la carga de combustible de un vehículo (Modelo anémico).
/// </summary>
public class FuelLog
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string VehicleId { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public int Odometer { get; set; }
    public double Liters { get; set; }
    public decimal TotalCost { get; set; }
    public decimal CostPerLiter { get; set; }
    public bool IsFullTank { get; set; }
    public RouteType RouteType { get; set; } = RouteType.Ciudad;
    public string? FuelGrade { get; set; }
    public string? TicketPhotoUrl { get; set; }

    // Campos enriquecidos por el motor de cálculo de negocio
    public int TripDistance { get; set; }
    public double? RealEfficiencyKmPerL { get; set; }
    public double? ConsumptionLPer100Km { get; set; }
    public decimal CostPerKm { get; set; }
    public string? CalculationNote { get; set; }
}
