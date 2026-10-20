using AutoCare.Entities.Entities;

namespace AutoCare.DataAccess.Interfaces;

public interface IVehicleStore
{
    Task<Vehicle?> GetByIdAsync(string id);
    Task<List<Vehicle>> GetAllAsync();
    Task<Vehicle> CreateAsync(Vehicle vehicle);
    Task<Vehicle> UpdateAsync(Vehicle vehicle);
    Task<bool> DeleteAsync(string id);
}
