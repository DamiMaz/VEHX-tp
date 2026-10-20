using AutoCare.Entities.Entities;

namespace AutoCare.DataAccess.Interfaces;

public interface IServiceItemStore
{
    Task<ServiceItem?> GetByIdAsync(string id);
    Task<List<ServiceItem>> GetByVehicleIdAsync(string vehicleId);
    Task<ServiceItem> CreateAsync(ServiceItem item);
    Task<ServiceItem> UpdateAsync(ServiceItem item);
    Task<bool> DeleteAsync(string id);
    Task<int> DeleteAllByVehicleIdAsync(string vehicleId);
}
