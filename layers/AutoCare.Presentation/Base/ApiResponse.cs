namespace AutoCare.Presentation.Base;

/// <summary>
/// Envoltorio estándar de respuesta de la API (según especificación N-Layers página 16).
/// </summary>
public class ApiResponse<T>
{
    public int Code { get; set; } = 200;
    public bool Success { get; set; } = true;
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "Operación exitosa")
    {
        return new ApiResponse<T>
        {
            Code = 200,
            Success = true,
            Message = message,
            Data = data
        };
    }

    public static ApiResponse<T> Error(string message, int code = 400)
    {
        return new ApiResponse<T>
        {
            Code = code,
            Success = false,
            Message = message,
            Data = default
        };
    }
}
