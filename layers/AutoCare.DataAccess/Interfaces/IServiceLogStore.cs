using AutoCare.Entities.Entities;

namespace AutoCare.DataAccess.Interfaces;

public interface IServiceLogStore
{
    Task<ServiceLogRecord?> GetByIdAsync(string id);
    Task<List<ServiceLogRecord>> GetByVehicleIdAsync(string vehicleId);
    Task<ServiceLogRecord> CreateAsync(ServiceLogRecord record);
    Task<bool> DeleteAsync(string id);
    Task<int> DeleteAllByVehicleIdAsync(string vehicleId);
}
