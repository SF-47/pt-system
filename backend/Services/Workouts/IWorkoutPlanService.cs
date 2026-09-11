using backend.DTOs.Workouts;

namespace backend.Services.Workouts;

public interface IWorkoutPlanService
{
    Task<List<WorkoutPlanResponse>> GetAllAsync();

    Task<WorkoutPlanResponse?> GetByIdAsync(int id);

    Task<WorkoutPlanResponse> CreateAsync(CreateWorkoutPlanRequest request);

    Task<WorkoutPlanResponse?> UpdateAsync(int id, UpdateWorkoutPlanRequest request);

    Task<bool> DeleteAsync(int id);

    Task<ExerciseResponse?> AddExerciseAsync(int workoutPlanId, CreateExerciseRequest request);

    Task<ExerciseResponse?> UpdateExerciseAsync(int workoutPlanId, UpdateExerciseRequest request);

    Task<bool> DeleteExerciseAsync(int exerciseId);
}
