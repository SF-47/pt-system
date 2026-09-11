using backend.Data;
using backend.DTOs.Clients;
using backend.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Clients;

public class ClientService : IClientService
{
    private readonly ApplicationDbContext _db;

    public ClientService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<List<ClientResponse>> GetAllAsync()
    {
        return await _db
            .Clients.Select(client => new ClientResponse
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
    }

    public async Task<ClientResponse?> GetByIdAsync(int id)
    {
        return await _db
            .Clients.Where(client => client.Id == id)
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

    public async Task<ClientResponse> CreateAsync(CreateClientRequest request)
    {
        var client = new Client
        {
            TrainerId = 1,
            FullName = request.FullName,
            Username = request.Username,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            IsActive = true,
        };

        _db.Clients.Add(client);

        await _db.SaveChangesAsync();

        return new ClientResponse
        {
            Id = client.Id,
            TrainerId = client.TrainerId,
            FullName = client.FullName,
            Username = client.Username,
            Email = client.Email,
            PhoneNumber = client.PhoneNumber,
            IsActive = client.IsActive,
            CreatedAt = client.CreatedAt,
        };
    }

    public async Task<ClientResponse?> UpdateAsync(int id, UpdateClientRequest request)
    {
        var client = await _db.Clients.FindAsync(id);

        if (client is null)
        {
            return null;
        }

        client.FullName = request.FullName;
        client.Username = request.Username;
        client.Email = request.Email;
        client.PhoneNumber = request.PhoneNumber;
        client.IsActive = request.IsActive;

        await _db.SaveChangesAsync();

        return new ClientResponse
        {
            Id = client.Id,
            TrainerId = client.TrainerId,
            FullName = client.FullName,
            Username = client.Username,
            Email = client.Email,
            PhoneNumber = client.PhoneNumber,
            IsActive = client.IsActive,
            CreatedAt = client.CreatedAt,
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var client = await _db.Clients.FindAsync(id);

        if (client is null)
        {
            return false;
        }

        _db.Clients.Remove(client);

        return true;
    }

    public async Task<bool> UpdateCredentialsAsync(int id, UpdateClientCredentialsRequest request)
    {
        var client = await _db.Clients.FindAsync(id);

        if (client is null)
        {
            return false;
        }

        client.Username = request.Username;
        client.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        await _db.SaveChangesAsync();

        return true;
    }
}
