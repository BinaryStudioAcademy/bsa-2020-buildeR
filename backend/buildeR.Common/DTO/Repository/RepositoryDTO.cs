using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.Repository
{
    public class RepositoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Private { get; set; }
        public string Url { get; set; }
        public int ProjectId { get; set; }
    }
}
