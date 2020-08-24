using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.BLL.Interfaces
{
    public interface ISynchronizationHelper
    {
        string GetRepositoryOwnerFromUrl(string repoUrl);
        string GetRepositoryNameFromUrl(string repoUrl);
    }
}
