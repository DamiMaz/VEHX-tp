using AutoCare.BusinessLogic.Services;
using AutoCare.Entities.Entities;

namespace AutoCare.BusinessLogic.Interfaces;

public interface IServiceManager
{
    Task<ServiceItem?> GetServiceItemAsync(string id);
    Task<List<ServiceEvaluation>> GetVehicleServiceEvaluationsAsync(string vehicleId);
    Task<ServiceItem> CreateServiceItemAsync(ServiceItem item);
    Task<ServiceItem> UpdateServiceItemAsync(ServiceItem item);
    Task<bool> DeleteServiceItemAsync(string id);
    Task<ServiceLogRecord> PerformServiceAsync(
        string serviceItemId, 
        int currentOdometer, 
        decimal cost, 
        string workshop, 
        string? invoiceNumber = null, 
        string? notes = null, 
        DateTime? date = null);
    Task<List<ServiceLogRecord>> GetServiceLogsAsync(string vehicleId);
}
