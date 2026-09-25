using backend.DTOs.Common;
using backend.DTOs.Workouts;

namespace backend.Services.Workouts;

public interface IWorkoutPlanService
{
    Task<PagedResponse<WorkoutPlanResponse>> GetAllAsync(
        int trainerId,
        int page,
        int pageSize,
        string? search
    );

    Task<WorkoutPlanResponse?> GetByIdAsync(int id, int trainerId);

    Task<ServiceResult<WorkoutPlanResponse>> CreateAsync(
        CreateWorkoutPlanRequest request,
        int trainerId
    );

    Task<WorkoutPlanResponse?> UpdateAsync(int id, UpdateWorkoutPlanRequest request, int trainerId);

    Task<ServiceResult<bool>> DeleteAsync(int id, int trainerId);

    Task<ExerciseResponse?> AddExerciseAsync(
        int workoutPlanId,
        CreateExerciseRequest request,
        int trainerId
    );

    Task<ExerciseResponse?> UpdateExerciseAsync(
        int exerciseId,
        UpdateExerciseRequest request,
        int trainerId
    );

    Task<bool> DeleteExerciseAsync(int exerciseId, int trainerId);

    Task<ServiceResult<bool>> ReorderExercisesAsync(
        int workoutPlanId,
        ReorderRequest request,
        int trainerId
    );
}
