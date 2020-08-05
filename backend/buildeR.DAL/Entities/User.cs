using buildeR.DAL.Entities.Common;

namespace buildeR.DAL.Entities
{
    public class User : Entity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
    }
}