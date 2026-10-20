using AutoCare.DataAccess.Interfaces;
using AutoCare.Entities.Entities;
using Microsoft.EntityFrameworkCore;

namespace AutoCare.DataAccess.Stores;

/// <summary>
/// Implementación de persistencia para FuelLog.
/// </summary>
public class FuelLogStore : IFuelLogStore
{
    private readonly AppDbContext _context;

    public FuelLogStore(AppDbContext context)
    {
        _context = context;
    }

    public async Task<FuelLog?> GetByIdAsync(string id)
    {
        return await _context.FuelLogs.AsNoTracking().FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<List<FuelLog>> GetByVehicleIdAsync(string vehicleId)
    {
        return await _context.FuelLogs
            .AsNoTracking()
            .Where(f => f.VehicleId == vehicleId)
            .OrderBy(f => f.Odometer)
            .ToListAsync();
    }

    public async Task<FuelLog> CreateAsync(FuelLog log)
    {
        await _context.FuelLogs.AddAsync(log);
        await _context.SaveChangesAsync();
        return log;
    }

    public async Task<FuelLog> UpdateAsync(FuelLog log)
    {
        _context.FuelLogs.Update(log);
        await _context.SaveChangesAsync();
        return log;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var existing = await _context.FuelLogs.FirstOrDefaultAsync(f => f.Id == id);
        if (existing == null) return false;

        _context.FuelLogs.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> DeleteAllByVehicleIdAsync(string vehicleId)
    {
        var records = await _context.FuelLogs.Where(f => f.VehicleId == vehicleId).ToListAsync();
        _context.FuelLogs.RemoveRange(records);
        return await _context.SaveChangesAsync();
    }
}
