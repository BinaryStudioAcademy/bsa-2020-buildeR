using System.Collections.Generic;
using buildeR.DAL.Entities;

namespace buildeR.BLL.Services
{
    public class GroupComparer :  IEqualityComparer<Group>
    {
        public bool Equals(Group x, Group y)
        {
            if(object.ReferenceEquals(x, y))
            {
                return true;
            }
            //If either one of the object refernce is null, return false
            if (object.ReferenceEquals(x,null) || object.ReferenceEquals(y, null))
            {
                return false;
            }
            
            return x.Id == y.Id;
        }

        public int GetHashCode(Group obj)
        {
            
                //If obj is null then return 0
                if (obj == null)
                {
                    return 0;
                }
                //Get the ID hash code value
                int iDHashCode = obj.Id.GetHashCode();
                //Get the string HashCode Value
                //Check for null refernece exception
                int nameHashCode = obj.Name == null ? 0 : obj.Name.GetHashCode();
                return iDHashCode ^ nameHashCode;
            
        }
    }
}