using AutoCare.Entities.Enums;

namespace AutoCare.Entities.Entities;

/// <summary>
/// Representa la entidad de dominio de un Vehículo (Modelo anémico según arquitectura N-Layers).
/// </summary>
public class Vehicle
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string LicensePlate { get; set; } = string.Empty;
    public FuelType FuelType { get; set; } = FuelType.NaftaSuper;
    public double TankCapacity { get; set; } // Litros
    public DistributionType DistributionType { get; set; } = DistributionType.Cadena;
    public TransmissionType Transmission { get; set; } = TransmissionType.Manual;
    public int InitialOdometer { get; set; } // km
    public int CurrentOdometer { get; set; } // km de tablero
    public string? Vin { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
