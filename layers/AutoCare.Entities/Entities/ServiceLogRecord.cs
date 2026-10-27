namespace AutoCare.Entities.Entities;

/// <summary>
/// Bitácora clínica de un service efectivamente realizado en taller.
/// </summary>
public class ServiceLogRecord
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string VehicleId { get; set; } = string.Empty;
    public string ServiceItemId { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public int Odometer { get; set; }
    public decimal Cost { get; set; }
    public string Workshop { get; set; } = string.Empty;
    public string? InvoiceNumber { get; set; }
    public string? Notes { get; set; }
    public string? ReceiptFileUrl { get; set; }
    public string? PartsDetail { get; set; }
}
