using AutoCare.BusinessLogic.Interfaces;
using AutoCare.BusinessLogic.Services;
using AutoCare.DataAccess.Interfaces;
using AutoCare.Entities.Entities;

namespace AutoCare.BusinessLogic.Managers;

/// <summary>
/// Coordinador de negocio para el mantenimiento preventivo y bitácora clínica.
/// </summary>
public class ServiceManager : IServiceManager
{
    private readonly IServiceItemStore _serviceItemStore;
    private readonly IServiceLogStore _serviceLogStore;
    private readonly IVehicleStore _vehicleStore;
    private readonly IFuelLogStore _fuelLogStore;
    private readonly IServicePredictorService _predictorService;
    private readonly IFuelCalculationService _calculationService;

    public ServiceManager(
        IServiceItemStore serviceItemStore,
        IServiceLogStore serviceLogStore,
        IVehicleStore vehicleStore,
        IFuelLogStore fuelLogStore,
        IServicePredictorService predictorService,
        IFuelCalculationService calculationService)
    {
        _serviceItemStore = serviceItemStore;
        _serviceLogStore = serviceLogStore;
        _vehicleStore = vehicleStore;
        _fuelLogStore = fuelLogStore;
        _predictorService = predictorService;
        _calculationService = calculationService;
    }

    public async Task<ServiceItem?> GetServiceItemAsync(string id)
    {
        return await _serviceItemStore.GetByIdAsync(id);
    }

    public async Task<List<ServiceEvaluation>> GetVehicleServiceEvaluationsAsync(string vehicleId)
    {
        var vehicle = await _vehicleStore.GetByIdAsync(vehicleId);
        if (vehicle == null)
            throw new KeyNotFoundException($"No se encontró el vehículo con ID '{vehicleId}'.");

        var items = await _serviceItemStore.GetByVehicleIdAsync(vehicleId);
        var fuelLogs = await _fuelLogStore.GetByVehicleIdAsync(vehicleId);

        double dailyRhythm = _calculationService.CalculateDailyRhythm(fuelLogs, vehicle);

        return _predictorService.EvaluateAllServices(items, vehicle.CurrentOdometer, dailyRhythm);
    }

    public async Task<ServiceItem> CreateServiceItemAsync(ServiceItem item)
    {
        if (string.IsNullOrWhiteSpace(item.Name))
            throw new ArgumentException("El nombre del mantenimiento es requerido.");

        if (item.IntervalKm <= 0 && item.IntervalDays <= 0)
            throw new ArgumentException("Debe especificar al menos un intervalo válido en km o en días.");

        if (string.IsNullOrWhiteSpace(item.Id))
            item.Id = Guid.NewGuid().ToString();

        return await _serviceItemStore.CreateAsync(item);
    }

    public async Task<ServiceItem> UpdateServiceItemAsync(ServiceItem item)
    {
        var existing = await _serviceItemStore.GetByIdAsync(item.Id);
        if (existing == null)
            throw new KeyNotFoundException($"No se encontró el ítem de service con ID '{item.Id}'.");

        return await _serviceItemStore.UpdateAsync(item);
    }

    public async Task<bool> DeleteServiceItemAsync(string id)
    {
        return await _serviceItemStore.DeleteAsync(id);
    }

    public async Task<ServiceLogRecord> PerformServiceAsync(
        string serviceItemId, 
        int currentOdometer, 
        decimal cost, 
        string workshop, 
        string? invoiceNumber = null, 
        string? notes = null, 
        DateTime? date = null)
    {
        var item = await _serviceItemStore.GetByIdAsync(serviceItemId);
        if (item == null)
            throw new KeyNotFoundException($"No se encontró el ítem de service '{serviceItemId}'.");

        var serviceDate = date ?? DateTime.UtcNow;

        // 1. Crear el registro en la bitácora histórica
        var logRecord = new ServiceLogRecord
        {
            Id = Guid.NewGuid().ToString(),
            VehicleId = item.VehicleId,
            ServiceItemId = item.Id,
            ServiceName = item.Name,
            Date = serviceDate,
            Odometer = currentOdometer,
            Cost = cost,
            Workshop = workshop,
            InvoiceNumber = invoiceNumber,
            Notes = notes
        };

        await _serviceLogStore.CreateAsync(logRecord);

        // 2. Reiniciar el estado del plan de service para el próximo ciclo
        item.LastServiceKm = currentOdometer;
        item.LastServiceDate = serviceDate;
        item.Cost = cost;
        item.Workshop = workshop;
        item.Notes = notes;
        await _serviceItemStore.UpdateAsync(item);

        // 3. Sincronizar odómetro del vehículo si el service se realizó a un odómetro mayor
        var vehicle = await _vehicleStore.GetByIdAsync(item.VehicleId);
        if (vehicle != null && currentOdometer > vehicle.CurrentOdometer)
        {
            vehicle.CurrentOdometer = currentOdometer;
            await _vehicleStore.UpdateAsync(vehicle);
        }

        return logRecord;
    }

    public async Task<List<ServiceLogRecord>> GetServiceLogsAsync(string vehicleId)
    {
        return await _serviceLogStore.GetByVehicleIdAsync(vehicleId);
    }
}
