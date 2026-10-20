using AutoCare.DataAccess.Interfaces;
using AutoCare.Entities.Entities;
using Microsoft.EntityFrameworkCore;

namespace AutoCare.DataAccess.Stores;

/// <summary>
/// Implementación concreta de persistencia para la entidad Vehicle (según guía N-Layers).
/// </summary>
public class VehicleStore : IVehicleStore
{
    private readonly AppDbContext _context;

    public VehicleStore(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Vehicle?> GetByIdAsync(string id)
    {
        return await _context.Vehicles.AsNoTracking().FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task<List<Vehicle>> GetAllAsync()
    {
        return await _context.Vehicles.AsNoTracking().OrderBy(v => v.Brand).ThenBy(v => v.Model).ToListAsync();
    }

    public async Task<Vehicle> CreateAsync(Vehicle vehicle)
    {
        await _context.Vehicles.AddAsync(vehicle);
        await _context.SaveChangesAsync();
        return vehicle;
    }

    public async Task<Vehicle> UpdateAsync(Vehicle vehicle)
    {
        _context.Vehicles.Update(vehicle);
        await _context.SaveChangesAsync();
        return vehicle;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var existing = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == id);
        if (existing == null) return false;

        _context.Vehicles.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}
