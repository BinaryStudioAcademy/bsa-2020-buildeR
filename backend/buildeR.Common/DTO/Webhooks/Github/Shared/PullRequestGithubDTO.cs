using System;

namespace buildeR.Common.DTO.Webhooks.Github.Shared
{
    public class PullRequestGithubDTO
    {
        public DateTime? Merged_At { get; set; }
        /// <summary>
        /// Source branch
        /// </summary>
        public BranchGithubDTO Head { get; set; }
        /// <summary>
        /// Target branch
        /// </summary>
        public BranchGithubDTO Base { get; set; }
    }
}
