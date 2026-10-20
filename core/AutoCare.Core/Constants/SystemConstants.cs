namespace AutoCare.Core.Constants;

public static class SystemConstants
{
    public const double DefaultDailyRhythmKm = 42.0;
    public const double AnomalyThresholdPercentage = 15.0; // Caída > 15% vs histórico dispara alerta
    public const int AlertRemainingKmThreshold = 800; // km
    public const int AlertRemainingDaysThreshold = 30; // días
    public const double AlertWearPercentThreshold = 80.0; // %
    public const double OverdueWearPercentThreshold = 100.0; // %
    public const double EarthRadiusKm = 6371.0; // Para fórmula Haversine
}
