namespace AutoCare.Entities.Entities;

/// <summary>
/// Representa un ítem o plan de mantenimiento preventivo bimodal programado para un vehículo.
/// </summary>
public class ServiceItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string VehicleId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = "General"; // Aceite, Distribución, Frenos, Neumáticos, General
    public int IntervalKm { get; set; }
    public int IntervalDays { get; set; }
    public int LastServiceKm { get; set; }
    public DateTime LastServiceDate { get; set; } = DateTime.UtcNow;
    public decimal? Cost { get; set; }
    public string? Workshop { get; set; }
    public string? Notes { get; set; }
}
