using AutoCare.Entities.Entities;
using AutoCare.Entities.Enums;

namespace AutoCare.BusinessLogic.Services;

public record ServiceEvaluation(
    ServiceItem Item,
    double WearKmPercent,
    double WearDaysPercent,
    double WearTotalPercent,
    ServiceStatus Status,
    int RemainingKm,
    int RemainingDays,
    int ProjectedDaysByRhythm,
    string StatusMessage
);

public interface IServicePredictorService
{
    ServiceEvaluation EvaluateService(ServiceItem item, int currentOdometer, double dailyRhythmKm, DateTime? currentDate = null);
    List<ServiceEvaluation> EvaluateAllServices(List<ServiceItem> items, int currentOdometer, double dailyRhythmKm, DateTime? currentDate = null);
}
