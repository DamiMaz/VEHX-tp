using AutoCare.BusinessLogic.Services;
using AutoCare.Entities.Enums;

namespace AutoCare.Presentation.Outputs;

public class ServiceItemOutput
{
    public string Id { get; set; } = string.Empty;
    public string VehicleId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int IntervalKm { get; set; }
    public int IntervalDays { get; set; }
    public int LastServiceKm { get; set; }
    public DateTime LastServiceDate { get; set; }
    public decimal? Cost { get; set; }
    public string? Workshop { get; set; }
    public string? Notes { get; set; }

    // Evaluados por el motor predictivo bimodal
    public double WearKmPercent { get; set; }
    public double WearDaysPercent { get; set; }
    public double WearTotalPercent { get; set; }
    public ServiceStatus Status { get; set; }
    public string StatusName => Status.ToString().ToLowerInvariant();
    public int RemainingKm { get; set; }
    public int RemainingDays { get; set; }
    public int ProjectedDaysByRhythm { get; set; }
    public string StatusMessage { get; set; } = string.Empty;

    public static ServiceItemOutput FromEvaluation(ServiceEvaluation eval) => new()
    {
        Id = eval.Item.Id,
        VehicleId = eval.Item.VehicleId,
        Name = eval.Item.Name,
        Category = eval.Item.Category,
        IntervalKm = eval.Item.IntervalKm,
        IntervalDays = eval.Item.IntervalDays,
        LastServiceKm = eval.Item.LastServiceKm,
        LastServiceDate = eval.Item.LastServiceDate,
        Cost = eval.Item.Cost,
        Workshop = eval.Item.Workshop,
        Notes = eval.Item.Notes,
        WearKmPercent = eval.WearKmPercent,
        WearDaysPercent = eval.WearDaysPercent,
        WearTotalPercent = eval.WearTotalPercent,
        Status = eval.Status,
        RemainingKm = eval.RemainingKm,
        RemainingDays = eval.RemainingDays,
        ProjectedDaysByRhythm = eval.ProjectedDaysByRhythm,
        StatusMessage = eval.StatusMessage
    };
}
