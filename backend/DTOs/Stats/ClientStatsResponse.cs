namespace backend.DTOs.Stats;

public class ClientStatsResponse
{
    public int TotalClients { get; set; }
    public int ActiveClients { get; set; }
    public int InactiveClients { get; set; }
}