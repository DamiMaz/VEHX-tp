using AutoCare.Entities.Entities;

namespace AutoCare.BusinessLogic.Interfaces;

public interface IVehicleManager
{
    Task<Vehicle?> GetVehicleAsync(string id);
    Task<List<Vehicle>> GetAllVehiclesAsync();
    Task<Vehicle> CreateVehicleAsync(Vehicle vehicle);
    Task<Vehicle> UpdateVehicleAsync(Vehicle vehicle);
    Task<bool> DeleteVehicleAsync(string id);
}
