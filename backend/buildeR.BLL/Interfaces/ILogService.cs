using buildeR.Common.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface ILogService
    {
        Task<List<ProjectLog>> GetLogs(int projectId, int buildHistoryId);
    }
}
