using buildeR.BLL.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.BLL.Services
{
    public class SynchronizationHelper : ISynchronizationHelper
    {
        public string GetRepositoryNameFromUrl(string repoUrl)
        {
            if (repoUrl.StartsWith("https://github.com"))
            {
                var name = repoUrl.Substring(19).Split('/')[1];
                return name;
            }

            throw new Exception("Unknown repository provider");
        }

        public string GetRepositoryOwnerFromUrl(string repoUrl)
        {
            if (repoUrl.StartsWith("https://github.com"))
            {
                var owner = repoUrl.Substring(19).Split('/')[0];
                return owner;
            }

            throw new Exception("Unknown repository provider");
        }
    }
}
