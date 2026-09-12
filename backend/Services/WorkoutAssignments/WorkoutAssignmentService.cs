using backend.Data;
using backend.DTOs.WorkoutAssignments;
using backend.Enums;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.WorkoutAssignments;

public class WorkoutAssignmentService : IWorkoutAssignmentService
{
    private readonly ApplicationDbContext _context;

    public WorkoutAssignmentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<WorkoutAssignmentResponse>> GetByClientIdAsync(int clientId)
    {
        return await _context
            .ClientWorkoutAssignments.Where(assignment => assignment.ClientId == clientId)
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
    }

    public async Task<WorkoutAssignmentResponse?> AssignAsync(
        int clientId,
        AssignWorkoutPlanRequest request
    )
    {
        var clientExists = await _context.Clients.AnyAsync(client => client.Id == clientId);

        if (!clientExists)
        {
            return null;
        }

        var workoutPlanExists = await _context.WorkoutPlans.AnyAsync(plan =>
            plan.Id == request.WorkoutPlanId
        );

        if (!workoutPlanExists)
        {
            return null;
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

        return new WorkoutAssignmentResponse
        {
            Id = assignment.Id,
            ClientId = assignment.ClientId,
            WorkoutPlanId = assignment.WorkoutPlanId,
            WorkoutPlanName = workoutPlanName,
            AssignedDate = assignment.AssignedDate,
            Status = assignment.Status,
            CompletedAt = assignment.CompletedAt,
        };
    }

    public async Task<WorkoutAssignmentResponse?> UpdateAsync(
        int assignmentId,
        UpdateWorkoutAssignmentRequest request
    )
    {
        var assignment = await _context.ClientWorkoutAssignments.FirstOrDefaultAsync(assignment =>
            assignment.Id == assignmentId
        );

        if (assignment is null)
        {
            return null;
        }

        var workoutPlanExists = await _context.WorkoutPlans.AnyAsync(plan =>
            plan.Id == request.WorkoutPlanId
        );

        if (!workoutPlanExists)
        {
            return null;
        }

        assignment.WorkoutPlanId = request.WorkoutPlanId;
        assignment.AssignedDate = request.AssignedDate;

        await _context.SaveChangesAsync();

        var workoutPlanName = await _context
            .WorkoutPlans.Where(plan => plan.Id == assignment.WorkoutPlanId)
            .Select(plan => plan.Name)
            .FirstAsync();

        return new WorkoutAssignmentResponse
        {
            Id = assignment.Id,
            ClientId = assignment.ClientId,
            WorkoutPlanId = assignment.WorkoutPlanId,
            WorkoutPlanName = workoutPlanName,
            AssignedDate = assignment.AssignedDate,
            Status = assignment.Status,
            CompletedAt = assignment.CompletedAt,
        };
    }

    public async Task<WorkoutAssignmentResponse?> UpdateStatusAsync(
        int assignmentId,
        UpdateWorkoutStatusRequest request
    )
    {
        var assignment = await _context
            .ClientWorkoutAssignments.Include(assignment => assignment.WorkoutPlan)
            .FirstOrDefaultAsync(assignment => assignment.Id == assignmentId);

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
