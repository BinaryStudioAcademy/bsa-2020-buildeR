using buildeR.DAL.Entities.Common;

namespace buildeR.DAL.Entities
{
    public class Repository:Entity
    {
        public string Name { get; set; }
        public string Owner { get; set; }
        public bool Private { get; set; }
        public string Url { get; set; }
        public bool CreatedByLink { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }
    }
}
