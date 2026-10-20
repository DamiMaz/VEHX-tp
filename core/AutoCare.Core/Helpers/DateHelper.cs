namespace AutoCare.Core.Helpers;

public static class DateHelper
{
    private static readonly string[] SpanishMonthNames =
    {
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    };

    public static string GetMonthNameSpanish(int month)
    {
        if (month is < 1 or > 12) return string.Empty;
        return SpanishMonthNames[month - 1];
    }

    public static int GetDaysDifference(DateTime from, DateTime to)
    {
        return Math.Max(0, (int)Math.Round((to.Date - from.Date).TotalDays));
    }

    public static string FormatPeriodKey(DateTime date)
    {
        return $"{date.Year:D4}-{date.Month:D2}";
    }
}
