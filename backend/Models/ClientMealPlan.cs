namespace backend.Models;

public class ClientMealPlan
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public int MealPlanId { get; set; }

    public DateTime AssignedDate { get; set; }

    public Client Client { get; set; } = null!;

    public MealPlan MealPlan { get; set; } = null!;

    public ICollection<ClientMealStatus> MealStatuses { get; set; } = new List<ClientMealStatus>();
}
