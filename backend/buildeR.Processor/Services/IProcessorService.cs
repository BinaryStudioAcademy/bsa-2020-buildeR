
using buildeR.Common.DTO.BuildHistory;

using System.Threading.Tasks;

namespace buildeR.Processor.Services
{
    public interface IProcessorService
    {
        Task BuildProjectAsync(ExecutiveBuildDTO build);
    }
}