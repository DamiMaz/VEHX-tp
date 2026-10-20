using AutoCare.Core.Constants;
using AutoCare.Core.Helpers;
using AutoCare.Core.Utils;
using AutoCare.Entities.Entities;

namespace AutoCare.BusinessLogic.Services;

/// <summary>
/// Servicio especializado en cálculos de consumo, soporte de cargas parciales y matrices analíticas.
/// </summary>
public class FuelCalculationService : IFuelCalculationService
{
    public List<FuelLog> EnrichFuelLogs(List<FuelLog> logs, Vehicle vehicle)
    {
        if (logs == null || logs.Count == 0) return new List<FuelLog>();

        var sorted = logs.OrderBy(l => l.Odometer).ThenBy(l => l.Date).ToList();

        int lastFullTankOdometer = vehicle.InitialOdometer;
        double accumulatedPartialLiters = 0;
        decimal accumulatedPartialCost = 0;

        var result = new List<FuelLog>();

        for (int i = 0; i < sorted.Count; i++)
        {
            var log = sorted[i];
            int prevOdometer = i == 0 ? vehicle.InitialOdometer : sorted[i - 1].Odometer;
            int tripDistance = Math.Max(0, log.Odometer - prevOdometer);

            decimal costPerLiter = log.CostPerLiter > 0
                ? log.CostPerLiter
                : (log.Liters > 0 ? MathUtils.Round2(log.TotalCost / (decimal)log.Liters) : 0m);

            decimal costPerKm = tripDistance > 0 ? MathUtils.Round2(log.TotalCost / tripDistance) : 0m;

            if (!log.IsFullTank)
            {
                // Carga Parcial: Se acumula para la próxima carga completa
                accumulatedPartialLiters += log.Liters;
                accumulatedPartialCost += log.TotalCost;

                log.CostPerLiter = costPerLiter;
                log.TripDistance = tripDistance;
                log.RealEfficiencyKmPerL = null;
                log.ConsumptionLPer100Km = null;
                log.CostPerKm = costPerKm;
                log.CalculationNote = "Acumulando (Carga Parcial)";
            }
            else
            {
                // Carga Tanque Lleno: Computa todo el tramo desde el último tanque lleno
                double totalLitersInSpan = accumulatedPartialLiters + log.Liters;
                decimal totalCostInSpan = accumulatedPartialCost + log.TotalCost;
                int totalSpanDistance = log.Odometer - lastFullTankOdometer;

                double? realEfficiency = null;
                double? consumption100Km = null;
                string note = "Tanque lleno individual";

                if (totalSpanDistance > 0 && totalLitersInSpan > 0)
                {
                    realEfficiency = MathUtils.Round2(totalSpanDistance / totalLitersInSpan);
                    if (realEfficiency > 0)
                    {
                        consumption100Km = MathUtils.Round2(100.0 / realEfficiency.Value);
                    }

                    if (accumulatedPartialLiters > 0)
                    {
                        note = $"Consolidado ({accumulatedPartialLiters:F1} L parciales previos)";
                    }
                }

                // Reiniciar acumuladores para la próxima serie
                lastFullTankOdometer = log.Odometer;
                accumulatedPartialLiters = 0;
                accumulatedPartialCost = 0;

                log.CostPerLiter = costPerLiter;
                log.TripDistance = tripDistance;
                log.RealEfficiencyKmPerL = realEfficiency;
                log.ConsumptionLPer100Km = consumption100Km;
                log.CostPerKm = costPerKm;
                log.CalculationNote = note;
            }

            result.Add(log);
        }

        return result;
    }

    public List<MonthlyMatrixRow> GenerateMonthlyMatrix(List<FuelLog> enrichedLogs)
    {
        if (enrichedLogs == null || enrichedLogs.Count == 0) return new List<MonthlyMatrixRow>();

        var groups = enrichedLogs
            .GroupBy(l => DateHelper.FormatPeriodKey(l.Date))
            .OrderBy(g => g.Key)
            .ToList();

        // Promedio histórico global de referencia
        double grandTotalDistance = enrichedLogs.Sum(l => l.TripDistance);
        double grandTotalLiters = enrichedLogs.Sum(l => l.Liters);
        double historicalAvgEfficiency = grandTotalLiters > 0 ? (grandTotalDistance / grandTotalLiters) : 11.5;

        var result = new List<MonthlyMatrixRow>();
        double? prevEfficiency = null;

        foreach (var group in groups)
        {
            var parts = group.Key.Split('-');
            int year = int.Parse(parts[0]);
            int month = int.Parse(parts[1]);
            int monthIndex = month - 1;

            var logs = group.ToList();
            int totalDistanceKm = logs.Sum(l => l.TripDistance);
            double totalLiters = MathUtils.Round2(logs.Sum(l => l.Liters));
            decimal totalCost = logs.Sum(l => l.TotalCost);
            int logsCount = logs.Count;
            int fullTanksCount = logs.Count(l => l.IsFullTank);
            int partialTanksCount = logs.Count(l => !l.IsFullTank);

            decimal avgCostPerKm = totalDistanceKm > 0 ? MathUtils.Round2(totalCost / totalDistanceKm) : 0m;
            double avgEfficiencyKmPerL = totalLiters > 0 ? MathUtils.Round2(totalDistanceKm / totalLiters) : 0.0;
            double consumptionLPer100Km = avgEfficiencyKmPerL > 0 ? MathUtils.Round2(100.0 / avgEfficiencyKmPerL) : 0.0;

            // Variación vs mes anterior
            double? efficiencyChangePercent = null;
            if (prevEfficiency.HasValue && prevEfficiency.Value > 0)
            {
                efficiencyChangePercent = MathUtils.Round2(((avgEfficiencyKmPerL - prevEfficiency.Value) / prevEfficiency.Value) * 100.0);
            }
            prevEfficiency = avgEfficiencyKmPerL;

            // Detección de Anomalía (> 15% de merma vs histórico)
            double dropVsHistorical = historicalAvgEfficiency > 0
                ? ((historicalAvgEfficiency - avgEfficiencyKmPerL) / historicalAvgEfficiency) * 100.0
                : 0.0;

            bool hasAnomalyAlert = dropVsHistorical > SystemConstants.AnomalyThresholdPercentage;
            string? anomalyMessage = hasAnomalyAlert
                ? $"Anomalía de consumo (-{dropVsHistorical:F1}% vs promedio histórico): Revisar presión de neumáticos, filtro de aire o inyección"
                : null;

            result.Add(new MonthlyMatrixRow(
                PeriodKey: group.Key,
                MonthName: $"{DateHelper.GetMonthNameSpanish(month)} {year}",
                Year: year,
                MonthIndex: monthIndex,
                TotalDistanceKm: totalDistanceKm,
                TotalLiters: totalLiters,
                LogsCount: logsCount,
                FullTanksCount: fullTanksCount,
                PartialTanksCount: partialTanksCount,
                TotalCost: totalCost,
                AvgCostPerKm: avgCostPerKm,
                AvgEfficiencyKmPerL: avgEfficiencyKmPerL,
                ConsumptionLPer100Km: consumptionLPer100Km,
                EfficiencyChangePercent: efficiencyChangePercent,
                HasAnomalyAlert: hasAnomalyAlert,
                AnomalyMessage: anomalyMessage
            ));
        }

        return result;
    }

    public double CalculateDailyRhythm(List<FuelLog> logs, Vehicle vehicle)
    {
        if (logs == null || logs.Count < 2) return SystemConstants.DefaultDailyRhythmKm;

        var sorted = logs.OrderBy(l => l.Date).ToList();
        var firstDate = sorted.First().Date;
        var lastDate = sorted.Last().Date;

        int daysDiff = Math.Max(1, (int)Math.Round((lastDate - firstDate).TotalDays));
        int distanceTraveled = sorted.Last().Odometer - sorted.First().Odometer;

        if (distanceTraveled <= 0 || daysDiff <= 0) return SystemConstants.DefaultDailyRhythmKm;
        return Math.Max(10.0, MathUtils.Round2((double)distanceTraveled / daysDiff));
    }
}
