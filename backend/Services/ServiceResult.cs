namespace backend.Services;

public class ServiceResult<T>
{
    public bool Success { get; set; }

    public T? Data { get; set; }

    public string? ErrorMessage { get; set; }

    public int StatusCode { get; set; }

    public static ServiceResult<T> Ok(T data)
    {
        return new ServiceResult<T>
        {
            Success = true,
            Data = data,
            StatusCode = 200,
        };
    }

    public static ServiceResult<T> BadRequest(string error)
    {
        return new ServiceResult<T>
        {
            Success = false,
            ErrorMessage = error,
            StatusCode = 400,
        };
    }

    public static ServiceResult<T> NotFound(string error)
    {
        return new ServiceResult<T>
        {
            Success = false,
            ErrorMessage = error,
            StatusCode = 404,
        };
    }

    public static ServiceResult<T> Conflict(string error)
    {
        return new ServiceResult<T>
        {
            Success = false,
            ErrorMessage = error,
            StatusCode = 409,
        };
    }

    public static ServiceResult<T> Unauthorized(string error)
    {
        return new ServiceResult<T>
        {
            Success = false,
            ErrorMessage = error,
            StatusCode = 401,
        };
    }
}
