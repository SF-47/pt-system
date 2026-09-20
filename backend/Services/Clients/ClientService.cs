using backend.Data;
using backend.DTOs.Clients;
using backend.DTOs.Common;
using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Clients;

public class ClientService : IClientService
{
    private readonly ApplicationDbContext _db;

    public ClientService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResponse<ClientResponse>> GetAllAsync(
        int trainerId,
        int page,
        int pageSize,
        string? search,
        string? status
    )
    {
        var query = _db.Clients.Where(client => client.TrainerId == trainerId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();

            query = query.Where(client =>
                client.FullName.Contains(search)
                || (client.Email != null && client.Email.Contains(search))
                || client.PhoneNumber.Contains(search)
            );
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            status = status.Trim().ToLower();

            if (status == "active")
            {
                query = query.Where(client => client.IsActive);
            }
            else if (status == "inactive")
            {
                query = query.Where(client => !client.IsActive);
            }
        }

        var totalCount = await query.CountAsync();

        var response = new PagedResponse<ClientResponse>
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
        };

        var offset = ((long)page - 1) * pageSize;

        if (offset >= totalCount)
        {
            return response;
        }

        response.Items = await query
            .OrderBy(client => client.Id)
            .Skip((int)offset)
            .Take(pageSize)
            .Select(client => new ClientResponse
            {
                Id = client.Id,
                TrainerId = client.TrainerId,
                FullName = client.FullName,
                Username = client.Username,
                Email = client.Email,
                PhoneNumber = client.PhoneNumber,
                IsActive = client.IsActive,
                CreatedAt = client.CreatedAt,
            })
            .ToListAsync();

        return response;
    }

    public async Task<ClientResponse?> GetByIdAsync(int id, int trainerId)
    {
        return await _db
            .Clients.Where(client => client.Id == id && client.TrainerId == trainerId)
            .Select(client => new ClientResponse
            {
                Id = client.Id,
                TrainerId = client.TrainerId,
                FullName = client.FullName,
                Username = client.Username,
                Email = client.Email,
                PhoneNumber = client.PhoneNumber,
                IsActive = client.IsActive,
                CreatedAt = client.CreatedAt,
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ServiceResult<ClientResponse>> CreateAsync(
        CreateClientRequest request,
        int trainerId
    )
    {
        var usernameExists = await _db.Clients.AnyAsync(client =>
            client.Username == request.Username
        );

        if (usernameExists)
        {
            return ServiceResult<ClientResponse>.Conflict("Username already exists.");
        }
        var client = new Client
        {
            TrainerId = trainerId,
            FullName = request.FullName,
            Username = request.Username,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            IsActive = true,
        };

        _db.Clients.Add(client);

        await _db.SaveChangesAsync();

        return ServiceResult<ClientResponse>.Ok(
            new ClientResponse
            {
                Id = client.Id,
                TrainerId = client.TrainerId,
                FullName = client.FullName,
                Username = client.Username,
                Email = client.Email,
                PhoneNumber = client.PhoneNumber,
                IsActive = client.IsActive,
                CreatedAt = client.CreatedAt,
            }
        );
    }

    public async Task<ServiceResult<ClientResponse>> UpdateAsync(
        int id,
        UpdateClientRequest request,
        int trainerId
    )
    {
        var client = await _db.Clients.FirstOrDefaultAsync(client =>
            client.Id == id && client.TrainerId == trainerId
        );

        if (client is null)
        {
            return ServiceResult<ClientResponse>.NotFound("Client not found.");
        }

        var usernameExists = await _db.Clients.AnyAsync(otherClient =>
            otherClient.Username == request.Username && otherClient.Id != id
        );

        if (usernameExists)
        {
            return ServiceResult<ClientResponse>.Conflict("Username already exists.");
        }

        client.FullName = request.FullName;
        client.Username = request.Username;
        client.Email = request.Email;
        client.PhoneNumber = request.PhoneNumber;
        client.IsActive = request.IsActive;

        await _db.SaveChangesAsync();

        return ServiceResult<ClientResponse>.Ok(
            new ClientResponse
            {
                Id = client.Id,
                TrainerId = client.TrainerId,
                FullName = client.FullName,
                Username = client.Username,
                Email = client.Email,
                PhoneNumber = client.PhoneNumber,
                IsActive = client.IsActive,
                CreatedAt = client.CreatedAt,
            }
        );
    }

    public async Task<bool> DeleteAsync(int id, int trainerId)
    {
        var client = await _db.Clients.FirstOrDefaultAsync(client =>
            client.Id == id && client.TrainerId == trainerId
        );

        if (client is null)
        {
            return false;
        }

        _db.Clients.Remove(client);
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<ServiceResult<bool>> UpdateCredentialsAsync(
        int id,
        UpdateClientCredentialsRequest request,
        int trainerId
    )
    {
        var client = await _db.Clients.FirstOrDefaultAsync(client =>
            client.Id == id && client.TrainerId == trainerId
        );

        if (client is null)
        {
            return ServiceResult<bool>.NotFound("Client not found.");
        }

        var usernameExists = await _db.Clients.AnyAsync(otherClient =>
            otherClient.Username == request.Username && otherClient.Id != id
        );

        if (usernameExists)
        {
            return ServiceResult<bool>.Conflict("Username already exists.");
        }

        client.Username = request.Username;
        client.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        await _db.SaveChangesAsync();

        return ServiceResult<bool>.Ok(true);
    }
}
