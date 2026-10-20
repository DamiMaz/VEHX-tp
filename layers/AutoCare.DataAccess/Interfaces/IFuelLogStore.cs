using AutoCare.Entities.Entities;

namespace AutoCare.DataAccess.Interfaces;

public interface IFuelLogStore
{
    Task<FuelLog?> GetByIdAsync(string id);
    Task<List<FuelLog>> GetByVehicleIdAsync(string vehicleId);
    Task<FuelLog> CreateAsync(FuelLog log);
    Task<FuelLog> UpdateAsync(FuelLog log);
    Task<bool> DeleteAsync(string id);
    Task<int> DeleteAllByVehicleIdAsync(string vehicleId);
}
