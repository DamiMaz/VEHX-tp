using AutoCare.Entities.Entities;

namespace AutoCare.Presentation.Outputs;

public class ServiceLogRecordOutput
{
    public string Id { get; set; } = string.Empty;
    public string VehicleId { get; set; } = string.Empty;
    public string ServiceItemId { get; set; } = string.Empty;
    public string ServiceName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int Odometer { get; set; }
    public decimal Cost { get; set; }
    public string Workshop { get; set; } = string.Empty;
    public string? InvoiceNumber { get; set; }
    public string? Notes { get; set; }

    public static ServiceLogRecordOutput FromEntity(ServiceLogRecord log) => new()
    {
        Id = log.Id,
        VehicleId = log.VehicleId,
        ServiceItemId = log.ServiceItemId,
        ServiceName = log.ServiceName,
        Date = log.Date,
        Odometer = log.Odometer,
        Cost = log.Cost,
        Workshop = log.Workshop,
        InvoiceNumber = log.InvoiceNumber,
        Notes = log.Notes
    };
}
