using System.ComponentModel.DataAnnotations;

namespace AutoCare.Presentation.Inputs;

public class ServicePerformInput
{
    [Required]
    [Range(0, 2000000)]
    public int Odometer { get; set; }

    [Required]
    [Range(0, 10000000)]
    public decimal Cost { get; set; }

    [Required]
    public string Workshop { get; set; } = string.Empty;

    public string? InvoiceNumber { get; set; }

    public string? Notes { get; set; }

    public DateTime? Date { get; set; }
}
