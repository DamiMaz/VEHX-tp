using AutoCare.DataAccess.Interfaces;
using AutoCare.Entities.Entities;
using Microsoft.EntityFrameworkCore;

namespace AutoCare.DataAccess.Stores;

/// <summary>
/// Implementación de persistencia para ServiceItem.
/// </summary>
public class ServiceItemStore : IServiceItemStore
{
    private readonly AppDbContext _context;

    public ServiceItemStore(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceItem?> GetByIdAsync(string id)
    {
        return await _context.ServiceItems.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<List<ServiceItem>> GetByVehicleIdAsync(string vehicleId)
    {
        return await _context.ServiceItems
            .AsNoTracking()
            .Where(s => s.VehicleId == vehicleId)
            .OrderBy(s => s.Category)
            .ThenBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<ServiceItem> CreateAsync(ServiceItem item)
    {
        await _context.ServiceItems.AddAsync(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<ServiceItem> UpdateAsync(ServiceItem item)
    {
        _context.ServiceItems.Update(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var existing = await _context.ServiceItems.FirstOrDefaultAsync(s => s.Id == id);
        if (existing == null) return false;

        _context.ServiceItems.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<int> DeleteAllByVehicleIdAsync(string vehicleId)
    {
        var items = await _context.ServiceItems.Where(s => s.VehicleId == vehicleId).ToListAsync();
        _context.ServiceItems.RemoveRange(items);
        return await _context.SaveChangesAsync();
    }
}
