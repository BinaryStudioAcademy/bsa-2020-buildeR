using System;

namespace buildeR.BLL.Exceptions
{
    public sealed class ForbiddenExeption : Exception
    {
        public ForbiddenExeption(string operation, string entity, int id)
            : base($"You do not have access to {operation} entity {entity} with id ({id})")
        {
        }
        public ForbiddenExeption(string message) : base(message) { }
        public ForbiddenExeption() : base("You do not have access") { }
    }
}
