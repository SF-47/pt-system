using backend.DTOs.Common;

namespace backend.Services;

public static class ReorderValidator
{
    // Returns an error message, or null when the request is a valid full
    // reorder of the plan's children: same ids, positions exactly 1..N.
    public static string? Validate(List<ReorderItem> items, List<int> planItemIds)
    {
        if (items.Count != planItemIds.Count)
        {
            return "All items in the plan must be included.";
        }

        if (items.Select(item => item.Id).Distinct().Count() != items.Count)
        {
            return "Duplicate item IDs are not allowed.";
        }

        if (items.Any(item => !planItemIds.Contains(item.Id)))
        {
            return "Every item must belong to this plan.";
        }

        var positions = items.Select(item => item.Position).OrderBy(position => position);

        if (!positions.SequenceEqual(Enumerable.Range(1, items.Count)))
        {
            return "Positions must be exactly 1 to N with no duplicates or gaps.";
        }

        return null;
    }
}
