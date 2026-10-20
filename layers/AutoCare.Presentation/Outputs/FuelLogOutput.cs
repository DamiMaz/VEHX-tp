using AutoCare.Entities.Entities;
using AutoCare.Entities.Enums;

namespace AutoCare.Presentation.Outputs;

public class FuelLogOutput
{
    public string Id { get; set; } = string.Empty;
    public string VehicleId { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int Odometer { get; set; }
    public double Liters { get; set; }
    public decimal TotalCost { get; set; }
    public decimal CostPerLiter { get; set; }
    public bool IsFullTank { get; set; }
    public RouteType RouteType { get; set; }
    public string RouteTypeName => RouteType.ToString();
    public string? FuelGrade { get; set; }
    public string? TicketPhotoUrl { get; set; }

    public int TripDistance { get; set; }
    public double? RealEfficiencyKmPerL { get; set; }
    public double? ConsumptionLPer100Km { get; set; }
    public decimal CostPerKm { get; set; }
    public string? CalculationNote { get; set; }

    public static FuelLogOutput FromEntity(FuelLog log) => new()
    {
        Id = log.Id,
        VehicleId = log.VehicleId,
        Date = log.Date,
        Odometer = log.Odometer,
        Liters = log.Liters,
        TotalCost = log.TotalCost,
        CostPerLiter = log.CostPerLiter,
        IsFullTank = log.IsFullTank,
        RouteType = log.RouteType,
        FuelGrade = log.FuelGrade,
        TicketPhotoUrl = log.TicketPhotoUrl,
        TripDistance = log.TripDistance,
        RealEfficiencyKmPerL = log.RealEfficiencyKmPerL,
        ConsumptionLPer100Km = log.ConsumptionLPer100Km,
        CostPerKm = log.CostPerKm,
        CalculationNote = log.CalculationNote
    };
}
