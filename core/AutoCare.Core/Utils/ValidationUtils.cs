using System.Text.RegularExpressions;

namespace AutoCare.Core.Utils;

public static class ValidationUtils
{
    private static readonly Regex LicensePlateRegex = new(
        @"^([A-Z]{3}\s?[0-9]{3}|[A-Z]{2}\s?[0-9]{3}\s?[A-Z]{2})$", 
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public static bool IsValidLicensePlate(string? plate)
    {
        if (string.IsNullOrWhiteSpace(plate)) return false;
        return LicensePlateRegex.IsMatch(plate.Trim());
    }

    public static bool IsStrictlyGreater(int current, int previous)
    {
        return current > previous;
    }

    public static bool IsPositive(double value)
    {
        return value > 0;
    }

    public static bool IsPositive(decimal value)
    {
        return value > 0;
    }
}
