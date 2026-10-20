using AutoCare.DataAccess.Interfaces;
using AutoCare.Entities.Entities;
using Microsoft.EntityFrameworkCore;

namespace AutoCare.DataAccess.Stores;

/// <summary>
/// Implementación de persistencia para ServiceLogRecord.
/// </summary>
public class ServiceLogStore : IServiceLogStore
{
    private readonly AppDbContext _context;

    public ServiceLogStore(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceLogRecord?> GetByIdAsync(string id)
    {
        return await _context.ServiceLogRecords.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<List<ServiceLogRecord>> GetByVehicleIdAsync(string vehicleId)
    {
        return await _context.ServiceLogRecords
            .AsNoTracking()
            .Where(s => s.VehicleId == vehicleId)
            .OrderByDescending(s => s.Date)
            .ToListAsync();
    }

    public async Task<ServiceLogRecord> CreateAsync(ServiceLogRecord record)
    {
        await _context.ServiceLogRecords.AddAsync(record);
        await _context.SaveChangesAsync();
        return record;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var existing = await _context.ServiceLogRecords.FirstOrDefaultAsync(s => s.Id == id);
        if (existing == null) return false;

        _context.ServiceLogRecords.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> DeleteAllByVehicleIdAsync(string vehicleId)
    {
        var records = await _context.ServiceLogRecords.Where(s => s.VehicleId == vehicleId).ToListAsync();
        _context.ServiceLogRecords.RemoveRange(records);
        return await _context.SaveChangesAsync();
    }
}
