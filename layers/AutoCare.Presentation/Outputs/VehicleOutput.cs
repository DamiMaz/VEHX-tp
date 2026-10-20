using AutoCare.Entities.Entities;
using AutoCare.Entities.Enums;

namespace AutoCare.Presentation.Outputs;

public class VehicleOutput
{
    public string Id { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string LicensePlate { get; set; } = string.Empty;
    public FuelType FuelType { get; set; }
    public string FuelTypeName => FuelType.ToString();
    public double TankCapacity { get; set; }
    public DistributionType DistributionType { get; set; }
    public string DistributionTypeName => DistributionType.ToString();
    public TransmissionType Transmission { get; set; }
    public string TransmissionName => Transmission.ToString();
    public int InitialOdometer { get; set; }
    public int CurrentOdometer { get; set; }
    public string? Vin { get; set; }
    public DateTime CreatedAt { get; set; }

    public static VehicleOutput FromEntity(Vehicle v) => new()
    {
        Id = v.Id,
        Brand = v.Brand,
        Model = v.Model,
        Year = v.Year,
        LicensePlate = v.LicensePlate,
        FuelType = v.FuelType,
        TankCapacity = v.TankCapacity,
        DistributionType = v.DistributionType,
        Transmission = v.Transmission,
        InitialOdometer = v.InitialOdometer,
        CurrentOdometer = v.CurrentOdometer,
        Vin = v.Vin,
        CreatedAt = v.CreatedAt
    };
}
