using Microsoft.AspNetCore.Mvc;

namespace AutoCare.Presentation.Base;

/// <summary>
/// Controlador base para centralizar respuestas y manejo de estados HTTP (según N-Layers páginas 16 y 17).
/// </summary>
[ApiController]
public abstract class BaseController : ControllerBase
{
    protected IActionResult Success<T>(T data, string message = "Operación realizada con éxito")
    {
        return Ok(ApiResponse<T>.Ok(data, message));
    }

    protected IActionResult Success(object data, string message = "Operación realizada con éxito")
    {
        return Ok(new
        {
            code = 200,
            success = true,
            data,
            message
        });
    }

    protected IActionResult Fail(string message, int statusCode = 400)
    {
        return StatusCode(statusCode, ApiResponse<object>.Error(message, statusCode));
    }
}
