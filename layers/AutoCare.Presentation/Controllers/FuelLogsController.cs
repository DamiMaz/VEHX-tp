using AutoCare.BusinessLogic.Interfaces;
using AutoCare.Entities.Entities;
using AutoCare.Presentation.Base;
using AutoCare.Presentation.Inputs;
using AutoCare.Presentation.Outputs;
using Microsoft.AspNetCore.Mvc;

namespace AutoCare.Presentation.Controllers;

[Route("api/fuel")]
public class FuelLogsController : BaseController
{
    private readonly IFuelLogManager _fuelLogManager;

    public FuelLogsController(IFuelLogManager fuelLogManager)
    {
        _fuelLogManager = fuelLogManager;
    }

    [HttpGet("vehicle/{vehicleId}")]
    public async Task<IActionResult> GetByVehicle(string vehicleId)
    {
        try
        {
            var logs = await _fuelLogManager.GetEnrichedFuelLogsAsync(vehicleId);
            var outputs = logs.Select(FuelLogOutput.FromEntity).ToList();
            return Success(outputs, "Historial de cargas de combustible obtenido exitosamente.");
        }
        catch (KeyNotFoundException ex)
        {
            return Fail(ex.Message, 404);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var log = await _fuelLogManager.GetFuelLogAsync(id);
        if (log == null)
            return Fail($"Carga con ID '{id}' no encontrada.", 404);

        return Success(FuelLogOutput.FromEntity(log));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] FuelLogCreateInput input)
    {
        if (!ModelState.IsValid)
            return Fail("Datos de entrada inválidos.");

        try
        {
            var entity = new FuelLog
            {
                VehicleId = input.VehicleId,
                Date = input.Date ?? DateTime.UtcNow,
                Odometer = input.Odometer,
                Liters = input.Liters,
                TotalCost = input.TotalCost,
                CostPerLiter = input.CostPerLiter,
                IsFullTank = input.IsFullTank,
                RouteType = input.RouteType,
                FuelGrade = input.FuelGrade,
                TicketPhotoUrl = input.TicketPhotoUrl
            };

            var created = await _fuelLogManager.CreateFuelLogAsync(entity);
            return Success(FuelLogOutput.FromEntity(created), "Carga de combustible registrada exitosamente.");
        }
        catch (ArgumentException ex)
        {
            return Fail(ex.Message, 400);
        }
        catch (KeyNotFoundException ex)
        {
            return Fail(ex.Message, 404);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _fuelLogManager.DeleteFuelLogAsync(id);
        if (!deleted)
            return Fail($"No se pudo eliminar la carga con ID '{id}'.", 404);

        return Success(true, "Carga de combustible eliminada exitosamente.");
    }

    [HttpGet("matrix/{vehicleId}")]
    public async Task<IActionResult> GetMonthlyMatrix(string vehicleId)
    {
        try
        {
            var matrix = await _fuelLogManager.GetMonthlyMatrixAsync(vehicleId);
            var outputs = matrix.Select(MonthlyMatrixRowOutput.FromDomain).ToList();
            return Success(outputs, "Matriz mensual de combustible generada exitosamente.");
        }
        catch (KeyNotFoundException ex)
        {
            return Fail(ex.Message, 404);
        }
    }

    [HttpGet("daily-rhythm/{vehicleId}")]
    public async Task<IActionResult> GetDailyRhythm(string vehicleId)
    {
        double rhythm = await _fuelLogManager.GetDailyRhythmAsync(vehicleId);
        return Success(new { vehicleId, dailyRhythmKm = rhythm }, "Ritmo diario calculado.");
    }
}
