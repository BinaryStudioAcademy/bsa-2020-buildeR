using buildeR.BLL.Interfaces;
using buildeR.Common.DTO;
using Nest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class LogService : ILogService
    {
        private readonly IElasticClient _elk;

        public LogService(IElasticClient elk)
        {
            _elk = elk;
        }

        public async Task<List<ProjectLog>> GetLogs(int projectId, int buildHistoryId)
        {
            var res = await _elk.SearchAsync<ProjectLog>(s => s.From(0)
                .Size(10000)
                .Query(q => q
                    .Match(f => f.Field(i => i.ProjectId).Query(projectId.ToString())))
                .Query(qq => qq.Match(m => m.Field(b => b.BuildHistoryId).Query(buildHistoryId.ToString()))));
            return res.Documents.ToList();
        }
    }
}
