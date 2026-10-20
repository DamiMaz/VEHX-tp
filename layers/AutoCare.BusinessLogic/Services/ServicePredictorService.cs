using AutoCare.Core.Constants;
using AutoCare.Core.Utils;
using AutoCare.Entities.Entities;
using AutoCare.Entities.Enums;

namespace AutoCare.BusinessLogic.Services;

/// <summary>
/// Motor predictivo de mantenimiento con lógica bimodal (Desgaste por Odómetro vs Tiempo Calendario).
/// </summary>
public class ServicePredictorService : IServicePredictorService
{
    public ServiceEvaluation EvaluateService(
        ServiceItem item, 
        int currentOdometer, 
        double dailyRhythmKm, 
        DateTime? currentDate = null)
    {
        var now = currentDate ?? DateTime.UtcNow;

        int kmPassed = Math.Max(0, currentOdometer - item.LastServiceKm);
        double wearKmPercent = item.IntervalKm > 0 
            ? MathUtils.Round2(((double)kmPassed / item.IntervalKm) * 100.0) 
            : 0;

        int daysPassed = Math.Max(0, (int)Math.Round((now.Date - item.LastServiceDate.Date).TotalDays));
        double wearDaysPercent = item.IntervalDays > 0 
            ? MathUtils.Round2(((double)daysPassed / item.IntervalDays) * 100.0) 
            : 0;

        double wearTotalPercent = Math.Max(wearKmPercent, wearDaysPercent);
        int remainingKm = Math.Max(0, item.IntervalKm - kmPassed);
        int remainingDays = Math.Max(0, item.IntervalDays - daysPassed);

        double effectiveRhythm = dailyRhythmKm > 0 ? dailyRhythmKm : SystemConstants.DefaultDailyRhythmKm;
        int projectedDaysByRhythm = (int)Math.Round(remainingKm / effectiveRhythm);

        ServiceStatus status;
        string statusMessage;

        if (wearTotalPercent >= SystemConstants.OverdueWearPercentThreshold || remainingKm == 0 || remainingDays == 0)
        {
            status = ServiceStatus.Overdue;
            statusMessage = wearKmPercent >= 100
                ? $"Vencido por kilometraje (+{kmPassed - item.IntervalKm} km)"
                : $"Vencido por tiempo (+{daysPassed - item.IntervalDays} días)";
        }
        else if (wearTotalPercent >= SystemConstants.AlertWearPercentThreshold 
                 || remainingKm <= SystemConstants.AlertRemainingKmThreshold 
                 || remainingDays <= SystemConstants.AlertRemainingDaysThreshold)
        {
            status = ServiceStatus.Warning;
            statusMessage = $"Próximo a vencer en {remainingKm} km (~{projectedDaysByRhythm} días al ritmo actual)";
        }
        else
        {
            status = ServiceStatus.Ok;
            statusMessage = $"Válido por {remainingKm} km más o {remainingDays} días";
        }

        return new ServiceEvaluation(
            Item: item,
            WearKmPercent: wearKmPercent,
            WearDaysPercent: wearDaysPercent,
            WearTotalPercent: wearTotalPercent,
            Status: status,
            RemainingKm: remainingKm,
            RemainingDays: remainingDays,
            ProjectedDaysByRhythm: projectedDaysByRhythm,
            StatusMessage: statusMessage
        );
    }

    public List<ServiceEvaluation> EvaluateAllServices(
        List<ServiceItem> items, 
        int currentOdometer, 
        double dailyRhythmKm, 
        DateTime? currentDate = null)
    {
        if (items == null || items.Count == 0) return new List<ServiceEvaluation>();

        return items
            .Select(item => EvaluateService(item, currentOdometer, dailyRhythmKm, currentDate))
            .OrderByDescending(s => s.WearTotalPercent)
            .ToList();
    }
}
