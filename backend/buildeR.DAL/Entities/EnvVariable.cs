using buildeR.DAL.Entities.Common;

namespace buildeR.DAL.Entities
{
    public class EnvVariable : Entity
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
