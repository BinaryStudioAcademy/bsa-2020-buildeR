namespace buildeR.Common.DTO.BuildHistory
{
    public sealed class NewBuildHistoryDTO
    {
        public int ProjectId { get; set; }
        public int PerformerId { get; set; }
        public string BranchHash { get; set; }
        public string CommitHash { get; set; }
    }
}
