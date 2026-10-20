using AutoCare.BusinessLogic.Interfaces;
using AutoCare.DataAccess.Interfaces;
using AutoCare.Entities.Entities;

namespace AutoCare.BusinessLogic.Managers;

/// <summary>
/// Coordinador de negocio para la entidad Vehicle.
/// </summary>
public class VehicleManager : IVehicleManager
{
    private readonly IVehicleStore _vehicleStore;

    public VehicleManager(IVehicleStore vehicleStore)
    {
        _vehicleStore = vehicleStore;
    }

    public async Task<Vehicle?> GetVehicleAsync(string id)
    {
        return await _vehicleStore.GetByIdAsync(id);
    }

    public async Task<List<Vehicle>> GetAllVehiclesAsync()
    {
        return await _vehicleStore.GetAllAsync();
    }

    public async Task<Vehicle> CreateVehicleAsync(Vehicle vehicle)
    {
        if (string.IsNullOrWhiteSpace(vehicle.Brand))
            throw new ArgumentException("La marca del vehículo es requerida.");

        if (string.IsNullOrWhiteSpace(vehicle.Model))
            throw new ArgumentException("El modelo del vehículo es requerido.");

        if (vehicle.InitialOdometer < 0)
            throw new ArgumentException("El odómetro inicial no puede ser negativo.");

        if (vehicle.CurrentOdometer < vehicle.InitialOdometer)
            vehicle.CurrentOdometer = vehicle.InitialOdometer;

        if (string.IsNullOrWhiteSpace(vehicle.Id))
            vehicle.Id = Guid.NewGuid().ToString();

        return await _vehicleStore.CreateAsync(vehicle);
    }

    public async Task<Vehicle> UpdateVehicleAsync(Vehicle vehicle)
    {
        var existing = await _vehicleStore.GetByIdAsync(vehicle.Id);
        if (existing == null)
            throw new KeyNotFoundException($"No se encontró el vehículo con ID '{vehicle.Id}'.");

        if (vehicle.CurrentOdometer < existing.InitialOdometer)
            throw new ArgumentException("El odómetro actual no puede ser menor al odómetro inicial.");

        return await _vehicleStore.UpdateAsync(vehicle);
    }

    public async Task<bool> DeleteVehicleAsync(string id)
    {
        return await _vehicleStore.DeleteAsync(id);
    }
}
