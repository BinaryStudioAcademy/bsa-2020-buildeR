using buildeR.Common.DTO.User;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IFileProvider
    {
        Task<string> UploadUserPhoto(IFormFile file);
    }
}
