using System.ComponentModel.DataAnnotations;
using AutoCare.Entities.Enums;

namespace AutoCare.Presentation.Inputs;

public class VehicleCreateInput
{
    [Required]
    public string Brand { get; set; } = string.Empty;

    [Required]
    public string Model { get; set; } = string.Empty;

    [Range(1900, 2100)]
    public int Year { get; set; }

    [Required]
    public string LicensePlate { get; set; } = string.Empty;

    public FuelType FuelType { get; set; } = FuelType.NaftaSuper;

    [Range(10, 500)]
    public double TankCapacity { get; set; } = 50;

    public DistributionType DistributionType { get; set; } = DistributionType.Cadena;

    public TransmissionType Transmission { get; set; } = TransmissionType.Manual;

    [Range(0, 2000000)]
    public int InitialOdometer { get; set; }

    [Range(0, 2000000)]
    public int CurrentOdometer { get; set; }

    public string? Vin { get; set; }
}
