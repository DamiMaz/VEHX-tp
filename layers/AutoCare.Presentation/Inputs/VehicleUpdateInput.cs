using System.ComponentModel.DataAnnotations;
using AutoCare.Entities.Enums;

namespace AutoCare.Presentation.Inputs;

public class VehicleUpdateInput
{
    [Required]
    public string Brand { get; set; } = string.Empty;

    [Required]
    public string Model { get; set; } = string.Empty;

    [Range(1900, 2100)]
    public int Year { get; set; }

    [Required]
    public string LicensePlate { get; set; } = string.Empty;

    public FuelType FuelType { get; set; }

    [Range(10, 500)]
    public double TankCapacity { get; set; }

    public DistributionType DistributionType { get; set; }

    public TransmissionType Transmission { get; set; }

    [Range(0, 2000000)]
    public int CurrentOdometer { get; set; }

    public string? Vin { get; set; }
}
