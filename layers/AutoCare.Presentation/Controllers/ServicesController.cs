using AutoCare.BusinessLogic.Interfaces;
using AutoCare.Entities.Entities;
using AutoCare.Presentation.Base;
using AutoCare.Presentation.Inputs;
using AutoCare.Presentation.Outputs;
using Microsoft.AspNetCore.Mvc;

namespace AutoCare.Presentation.Controllers;

[Route("api/services")]
public class ServicesController : BaseController
{
    private readonly IServiceManager _serviceManager;

    public ServicesController(IServiceManager serviceManager)
    {
        _serviceManager = serviceManager;
    }

    [HttpGet("vehicle/{vehicleId}")]
    public async Task<IActionResult> GetVehicleServices(string vehicleId)
    {
        try
        {
            var evaluations = await _serviceManager.GetVehicleServiceEvaluationsAsync(vehicleId);
            var outputs = evaluations.Select(ServiceItemOutput.FromEvaluation).ToList();
            return Success(outputs, "Planes de mantenimiento evaluados bimodalmente con éxito.");
        }
        catch (KeyNotFoundException ex)
        {
            return Fail(ex.Message, 404);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var item = await _serviceManager.GetServiceItemAsync(id);
        if (item == null)
            return Fail($"Ítem de service con ID '{id}' no encontrado.", 404);

        return Success(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ServiceItemCreateInput input)
    {
        if (!ModelState.IsValid)
            return Fail("Datos de entrada inválidos.");

        try
        {
            var entity = new ServiceItem
            {
                VehicleId = input.VehicleId,
                Name = input.Name,
                Category = input.Category,
                IntervalKm = input.IntervalKm,
                IntervalDays = input.IntervalDays,
                LastServiceKm = input.LastServiceKm,
                LastServiceDate = input.LastServiceDate ?? DateTime.UtcNow,
                Cost = input.Cost,
                Workshop = input.Workshop,
                Notes = input.Notes
            };

            var created = await _serviceManager.CreateServiceItemAsync(entity);
            return Success(created, "Plan de mantenimiento creado exitosamente.");
        }
        catch (ArgumentException ex)
        {
            return Fail(ex.Message, 400);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ServiceItemCreateInput input)
    {
        if (!ModelState.IsValid)
            return Fail("Datos de entrada inválidos.");

        try
        {
            var existing = await _serviceManager.GetServiceItemAsync(id);
            if (existing == null)
                return Fail($"Ítem de service con ID '{id}' no encontrado.", 404);

            existing.Name = input.Name;
            existing.Category = input.Category;
            existing.IntervalKm = input.IntervalKm;
            existing.IntervalDays = input.IntervalDays;
            existing.LastServiceKm = input.LastServiceKm;
            if (input.LastServiceDate.HasValue) existing.LastServiceDate = input.LastServiceDate.Value;
            existing.Cost = input.Cost;
            existing.Workshop = input.Workshop;
            existing.Notes = input.Notes;

            var updated = await _serviceManager.UpdateServiceItemAsync(existing);
            return Success(updated, "Plan de mantenimiento actualizado exitosamente.");
        }
        catch (KeyNotFoundException ex)
        {
            return Fail(ex.Message, 404);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _serviceManager.DeleteServiceItemAsync(id);
        if (!deleted)
            return Fail($"No se pudo eliminar el plan de mantenimiento '{id}'.", 404);

        return Success(true, "Plan de mantenimiento eliminado exitosamente.");
    }

    [HttpPost("{id}/perform")]
    public async Task<IActionResult> PerformService(string id, [FromBody] ServicePerformInput input)
    {
        if (!ModelState.IsValid)
            return Fail("Datos de entrada inválidos.");

        try
        {
            var logRecord = await _serviceManager.PerformServiceAsync(
                serviceItemId: id,
                currentOdometer: input.Odometer,
                cost: input.Cost,
                workshop: input.Workshop,
                invoiceNumber: input.InvoiceNumber,
                notes: input.Notes,
                date: input.Date
            );

            return Success(
                ServiceLogRecordOutput.FromEntity(logRecord), 
                "Service asentado en la bitácora clínica y ciclo reseteado.");
        }
        catch (KeyNotFoundException ex)
        {
            return Fail(ex.Message, 404);
        }
    }

    [HttpGet("logs/{vehicleId}")]
    public async Task<IActionResult> GetServiceLogs(string vehicleId)
    {
        var records = await _serviceManager.GetServiceLogsAsync(vehicleId);
        var outputs = records.Select(ServiceLogRecordOutput.FromEntity).ToList();
        return Success(outputs, "Bitácora histórica de services recuperada.");
    }
}
