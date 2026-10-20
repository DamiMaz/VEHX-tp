using AutoCare.BusinessLogic.Services;
using AutoCare.Entities.Entities;

namespace AutoCare.BusinessLogic.Interfaces;

public interface IFuelLogManager
{
    Task<FuelLog?> GetFuelLogAsync(string id);
    Task<List<FuelLog>> GetEnrichedFuelLogsAsync(string vehicleId);
    Task<FuelLog> CreateFuelLogAsync(FuelLog log);
    Task<bool> DeleteFuelLogAsync(string id);
    Task<List<MonthlyMatrixRow>> GetMonthlyMatrixAsync(string vehicleId);
    Task<double> GetDailyRhythmAsync(string vehicleId);
}
