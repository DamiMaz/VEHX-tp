using AutoCare.BusinessLogic.Services;

namespace AutoCare.Presentation.Outputs;

public class MonthlyMatrixRowOutput
{
    public string PeriodKey { get; set; } = string.Empty;
    public string MonthName { get; set; } = string.Empty;
    public int Year { get; set; }
    public int MonthIndex { get; set; }
    public int TotalDistanceKm { get; set; }
    public double TotalLiters { get; set; }
    public int LogsCount { get; set; }
    public int FullTanksCount { get; set; }
    public int PartialTanksCount { get; set; }
    public decimal TotalCost { get; set; }
    public decimal AvgCostPerKm { get; set; }
    public double AvgEfficiencyKmPerL { get; set; }
    public double ConsumptionLPer100Km { get; set; }
    public double? EfficiencyChangePercent { get; set; }
    public bool HasAnomalyAlert { get; set; }
    public string? AnomalyMessage { get; set; }

    public static MonthlyMatrixRowOutput FromDomain(MonthlyMatrixRow row) => new()
    {
        PeriodKey = row.PeriodKey,
        MonthName = row.MonthName,
        Year = row.Year,
        MonthIndex = row.MonthIndex,
        TotalDistanceKm = row.TotalDistanceKm,
        TotalLiters = row.TotalLiters,
        LogsCount = row.LogsCount,
        FullTanksCount = row.FullTanksCount,
        PartialTanksCount = row.PartialTanksCount,
        TotalCost = row.TotalCost,
        AvgCostPerKm = row.AvgCostPerKm,
        AvgEfficiencyKmPerL = row.AvgEfficiencyKmPerL,
        ConsumptionLPer100Km = row.ConsumptionLPer100Km,
        EfficiencyChangePercent = row.EfficiencyChangePercent,
        HasAnomalyAlert = row.HasAnomalyAlert,
        AnomalyMessage = row.AnomalyMessage
    };
}
