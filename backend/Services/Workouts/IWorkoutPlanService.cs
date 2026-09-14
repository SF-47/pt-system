using backend.DTOs.Workouts;

namespace backend.Services.Workouts;

public interface IWorkoutPlanService
{
    Task<List<WorkoutPlanResponse>> GetAllAsync(int trainerId);

    Task<WorkoutPlanResponse?> GetByIdAsync(int id, int trainerId);

    Task<WorkoutPlanResponse> CreateAsync(CreateWorkoutPlanRequest request, int trainerId);

    Task<WorkoutPlanResponse?> UpdateAsync(int id, UpdateWorkoutPlanRequest request, int trainerId);

    Task<bool> DeleteAsync(int id, int trainerId);

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
}
