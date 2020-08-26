using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.Common.DTO.Repository
{
    public class NewRepositoryDTO
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public bool Private { get; set; }
        public bool CreatedByLink { get; set; }
        public string Owner { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
