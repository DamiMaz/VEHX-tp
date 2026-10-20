using AutoCare.Entities.Entities;

namespace AutoCare.DataAccess.Interfaces;

public interface ITelemetryStore
{
    Task<TelemetryRecord?> GetByVehicleIdAsync(string vehicleId);
    Task<TelemetryRecord> SaveOrUpdateAsync(TelemetryRecord record);
    Task<bool> DeleteByVehicleIdAsync(string vehicleId);
}
