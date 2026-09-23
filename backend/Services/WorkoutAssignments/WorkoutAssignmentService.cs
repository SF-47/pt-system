using backend.Data;
using backend.DTOs.Common;
using backend.DTOs.WorkoutAssignments;
using backend.Enums;
using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.WorkoutAssignments;

public class WorkoutAssignmentService : IWorkoutAssignmentService
{
    private readonly ApplicationDbContext _context;

    public WorkoutAssignmentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResponse<WorkoutAssignmentResponse>> GetByClientIdAsync(
        int clientId,
        int trainerId,
        int page,
        int pageSize,
        DateTime? startDate = null,
        DateTime? endDate = null
    )
    {
        var query = _context
            .ClientWorkoutAssignments.Where(assignment =>
                assignment.ClientId == clientId && assignment.Client.TrainerId == trainerId
            );

        if (startDate is not null)
        {
            query = query.Where(assignment => assignment.AssignedDate >= startDate.Value);
        }

        if (endDate is not null)
        {
            query = query.Where(assignment => assignment.AssignedDate <= endDate.Value);
        }

        var totalCount = await query.CountAsync();
        var response = new PagedResponse<WorkoutAssignmentResponse>
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
        };

        // Calculate in long so large page numbers cannot overflow the offset.
        var offset = ((long)page - 1) * pageSize;
        if (offset >= totalCount)
        {
            return response;
        }

        var items = await query
            .OrderByDescending(assignment => assignment.AssignedDate)
            .ThenByDescending(assignment => assignment.Id)
            .Skip((int)offset)
            .Take(pageSize)
            .Select(assignment => new WorkoutAssignmentResponse
            {
                Id = assignment.Id,
                ClientId = assignment.ClientId,
                WorkoutPlanId = assignment.WorkoutPlanId,
                WorkoutPlanName = assignment.WorkoutPlan.Name,
                AssignedDate = assignment.AssignedDate,
                Status = assignment.Status,
                CompletedAt = assignment.CompletedAt,
            })
            .ToListAsync();

        response.Items = items;
        return response;
    }

    public async Task<ServiceResult<WorkoutAssignmentResponse>> AssignAsync(
        int clientId,
        AssignWorkoutPlanRequest request,
        int trainerId
    )
    {
        var clientExists = await _context.Clients.AnyAsync(client =>
            client.Id == clientId && client.TrainerId == trainerId
        );

        if (!clientExists)
        {
            return ServiceResult<WorkoutAssignmentResponse>.NotFound("Client not found.");
        }

        var workoutPlanExists = await _context.WorkoutPlans.AnyAsync(plan =>
            plan.Id == request.WorkoutPlanId && plan.TrainerId == trainerId
        );

        if (!workoutPlanExists)
        {
            return ServiceResult<WorkoutAssignmentResponse>.NotFound("Workout plan not found.");
        }

        var assignment = new ClientWorkoutAssignment
        {
            ClientId = clientId,
            WorkoutPlanId = request.WorkoutPlanId,
            AssignedDate = request.AssignedDate,
            Status = CompletionStatus.Pending,
            CompletedAt = null,
        };

        _context.ClientWorkoutAssignments.Add(assignment);

        await _context.SaveChangesAsync();

        var workoutPlanName = await _context
            .WorkoutPlans.Where(plan => plan.Id == assignment.WorkoutPlanId)
            .Select(plan => plan.Name)
            .FirstAsync();

        return ServiceResult<WorkoutAssignmentResponse>.Ok(
            new WorkoutAssignmentResponse
            {
                Id = assignment.Id,
                ClientId = assignment.ClientId,
                WorkoutPlanId = assignment.WorkoutPlanId,
                WorkoutPlanName = workoutPlanName,
                AssignedDate = assignment.AssignedDate,
                Status = assignment.Status,
                CompletedAt = assignment.CompletedAt,
            }
        );
    }

    public async Task<ServiceResult<WorkoutAssignmentResponse>> UpdateAsync(
        int assignmentId,
        UpdateWorkoutAssignmentRequest request,
        int trainerId
    )
    {
        var assignment = await _context.ClientWorkoutAssignments.FirstOrDefaultAsync(assignment =>
            assignment.Id == assignmentId && assignment.Client.TrainerId == trainerId
        );

        if (assignment is null)
        {
            return ServiceResult<WorkoutAssignmentResponse>.NotFound(
                "Workout assignment not found."
            );
        }

        var workoutPlanExists = await _context.WorkoutPlans.AnyAsync(plan =>
            plan.Id == request.WorkoutPlanId && plan.TrainerId == trainerId
        );

        if (!workoutPlanExists)
        {
            return ServiceResult<WorkoutAssignmentResponse>.NotFound("Workout plan not found.");
        }

        assignment.WorkoutPlanId = request.WorkoutPlanId;
        assignment.AssignedDate = request.AssignedDate;

        await _context.SaveChangesAsync();

        var workoutPlanName = await _context
            .WorkoutPlans.Where(plan => plan.Id == assignment.WorkoutPlanId)
            .Select(plan => plan.Name)
            .FirstAsync();

        return ServiceResult<WorkoutAssignmentResponse>.Ok(
            new WorkoutAssignmentResponse
            {
                Id = assignment.Id,
                ClientId = assignment.ClientId,
                WorkoutPlanId = assignment.WorkoutPlanId,
                WorkoutPlanName = workoutPlanName,
                AssignedDate = assignment.AssignedDate,
                Status = assignment.Status,
                CompletedAt = assignment.CompletedAt,
            }
        );
    }

    public async Task<WorkoutAssignmentResponse?> UpdateStatusAsync(
        int assignmentId,
        UpdateWorkoutStatusRequest request,
        int trainerId
    )
    {
        var assignment = await _context
            .ClientWorkoutAssignments.Include(assignment => assignment.WorkoutPlan)
            .FirstOrDefaultAsync(assignment =>
                assignment.Id == assignmentId && assignment.Client.TrainerId == trainerId
            );

        if (assignment is null)
        {
            return null;
        }

        assignment.Status = request.Status;

        if (request.Status == CompletionStatus.Completed)
        {
            assignment.CompletedAt = DateTime.UtcNow;
        }
        else
        {
            assignment.CompletedAt = null;
        }

        await _context.SaveChangesAsync();

        return new WorkoutAssignmentResponse
        {
            Id = assignment.Id,
            ClientId = assignment.ClientId,
            WorkoutPlanId = assignment.WorkoutPlanId,
            WorkoutPlanName = assignment.WorkoutPlan.Name,
            AssignedDate = assignment.AssignedDate,
            Status = assignment.Status,
            CompletedAt = assignment.CompletedAt,
        };
    }
}
