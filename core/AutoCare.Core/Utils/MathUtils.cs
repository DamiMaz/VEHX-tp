using AutoCare.Core.Constants;

namespace AutoCare.Core.Utils;

public static class MathUtils
{
    public static double Round2(double value) => Math.Round(value, 2, MidpointRounding.AwayFromZero);
    public static decimal Round2(decimal value) => Math.Round(value, 2, MidpointRounding.AwayFromZero);

    public static double CalculateHaversineDistanceKm(double lat1, double lon1, double lat2, double lon2)
    {
        double dLat = ToRadians(lat2 - lat1);
        double dLon = ToRadians(lon2 - lon1);

        double rLat1 = ToRadians(lat1);
        double rLat2 = ToRadians(lat2);

        double a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                   Math.Cos(rLat1) * Math.Cos(rLat2) *
                   Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return Round2(SystemConstants.EarthRadiusKm * c);
    }

    private static double ToRadians(double angleDegrees)
    {
        return angleDegrees * Math.PI / 180.0;
    }
}
