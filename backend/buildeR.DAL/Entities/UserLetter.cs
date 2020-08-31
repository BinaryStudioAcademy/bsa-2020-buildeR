using buildeR.DAL.Entities.Common;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace buildeR.DAL.Entities
{
    public class UserLetter: Entity
    {
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public bool IsRespond { get; set; }
    }
}