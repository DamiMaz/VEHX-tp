using AutoCare.Entities.Entities;

namespace AutoCare.BusinessLogic.Services;

public record MonthlyMatrixRow(
    string PeriodKey,
    string MonthName,
    int Year,
    int MonthIndex,
    int TotalDistanceKm,
    double TotalLiters,
    int LogsCount,
    int FullTanksCount,
    int PartialTanksCount,
    decimal TotalCost,
    decimal AvgCostPerKm,
    double AvgEfficiencyKmPerL,
    double ConsumptionLPer100Km,
    double? EfficiencyChangePercent,
    bool HasAnomalyAlert,
    string? AnomalyMessage
);

public interface IFuelCalculationService
{
    List<FuelLog> EnrichFuelLogs(List<FuelLog> logs, Vehicle vehicle);
    List<MonthlyMatrixRow> GenerateMonthlyMatrix(List<FuelLog> enrichedLogs);
    double CalculateDailyRhythm(List<FuelLog> logs, Vehicle vehicle);
}
