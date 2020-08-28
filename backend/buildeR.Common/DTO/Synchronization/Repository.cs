using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.Synchronization
{
    public class Repository
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Private { get; set; }
        public string Owner { get; set; }
    }
}
