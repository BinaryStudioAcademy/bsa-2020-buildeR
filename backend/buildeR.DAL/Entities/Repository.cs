using buildeR.DAL.Entities.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.DAL.Entities
{
    public class Repository:Entity
    {
        public string Name { get; set; }
        public bool Privte { get; set; }
        public string Url { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }
    }
}
