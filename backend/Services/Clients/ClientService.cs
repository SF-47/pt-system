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
        int pageSize
    )
    {
        var query = _db.Clients.Where(client => client.TrainerId == trainerId);
        var totalCount = await query.CountAsync();
        var clients = await query
            .OrderBy(client => client.Id)
            .Skip((page - 1) * pageSize)
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

        return new PagedResponse<ClientResponse>
        {
            Items = clients,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
        };
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
