using AutoCare.BusinessLogic.Interfaces;
using AutoCare.Presentation.Base;
using AutoCare.Presentation.Inputs;
using AutoCare.Presentation.Outputs;
using Microsoft.AspNetCore.Mvc;

namespace AutoCare.Presentation.Controllers;

[Route("api/telemetry")]
public class TelemetryController : BaseController
{
    private readonly ITelemetryManager _telemetryManager;

    public TelemetryController(ITelemetryManager telemetryManager)
    {
        _telemetryManager = telemetryManager;
    }

    [HttpGet("{vehicleId}")]
    public async Task<IActionResult> GetState(string vehicleId)
    {
        try
        {
            var telemetry = await _telemetryManager.GetTelemetryStateAsync(vehicleId);
            return Success(TelemetryOutput.FromEntity(telemetry), "Estado de telemetría obtenido.");
        }
        catch (KeyNotFoundException ex)
        {
            return Fail(ex.Message, 404);
        }
    }

    [HttpPost("{vehicleId}/simulate")]
    public async Task<IActionResult> SimulateMovement(string vehicleId, [FromBody] TelemetrySimulateInput input)
    {
        if (!ModelState.IsValid)
            return Fail("Datos de entrada inválidos.");

        try
        {
            var result = await _telemetryManager.SimulateMovementAsync(vehicleId, input.DistanceKm);
            return Success(new
            {
                telemetry = TelemetryOutput.FromEntity(result.Telemetry),
                result.PreviousOdometer,
                result.NewSimulatedOdometer,
                result.AddedKm
            }, $"Se simularon exitosamente {input.DistanceKm} km en el odómetro virtual.");
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

    [HttpPost("{vehicleId}/calibrate")]
    public async Task<IActionResult> Calibrate(string vehicleId, [FromBody] TelemetryCalibrateInput input)
    {
        if (!ModelState.IsValid)
            return Fail("Datos de entrada inválidos.");

        try
        {
            var result = await _telemetryManager.CalibrateTelemetryAsync(vehicleId, input.DashboardOdometer);
            return Success(new
            {
                telemetry = TelemetryOutput.FromEntity(result.Telemetry),
                result.RealDashboardOdometer,
                result.ErrorDeltaKm,
                result.NewAlphaFactor
            }, "Odómetro virtual calibrado y factor alfa recalculado.");
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
}
