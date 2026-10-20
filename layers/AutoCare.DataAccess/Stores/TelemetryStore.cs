using AutoCare.DataAccess.Interfaces;
using AutoCare.Entities.Entities;
using Microsoft.EntityFrameworkCore;

namespace AutoCare.DataAccess.Stores;

/// <summary>
/// Implementación de persistencia para TelemetryRecord.
/// </summary>
public class TelemetryStore : ITelemetryStore
{
    private readonly AppDbContext _context;

    public TelemetryStore(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TelemetryRecord?> GetByVehicleIdAsync(string vehicleId)
    {
        return await _context.TelemetryRecords
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.VehicleId == vehicleId);
    }

    public async Task<TelemetryRecord> SaveOrUpdateAsync(TelemetryRecord record)
    {
        var existing = await _context.TelemetryRecords.FirstOrDefaultAsync(t => t.VehicleId == record.VehicleId);
        if (existing == null)
        {
            await _context.TelemetryRecords.AddAsync(record);
        }
        else
        {
            existing.SimulatedOdometer = record.SimulatedOdometer;
            existing.DailyRhythmKm = record.DailyRhythmKm;
            existing.CorrectionFactorAlpha = record.CorrectionFactorAlpha;
            existing.AccumulatedTelemetryKm = record.AccumulatedTelemetryKm;
            existing.LastSyncDate = record.LastSyncDate;
            existing.CalibrationErrorDeltaKm = record.CalibrationErrorDeltaKm;
            _context.TelemetryRecords.Update(existing);
        }

        await _context.SaveChangesAsync();
        return record;
    }

    public async Task<bool> DeleteByVehicleIdAsync(string vehicleId)
    {
        var existing = await _context.TelemetryRecords.FirstOrDefaultAsync(t => t.VehicleId == vehicleId);
        if (existing == null) return false;

        _context.TelemetryRecords.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}
