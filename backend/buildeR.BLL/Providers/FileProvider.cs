using buildeR.BLL.Interfaces;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace buildeR.BLL.Providers
{
    public class FileProvider : IFileProvider
    {
        public async Task<string> UploadUserPhoto(IFormFile file)
        {
            var folderName = Path.Combine("Resources", "Avatars");
            return await SaveFile(folderName, file);
        }

        private async Task<string> SaveFile(string relativePath, IFormFile file)
        {
            var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), relativePath);

            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            var filePath = Path.Combine(directoryPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return Path.Combine(relativePath, fileName);
        }
    }
}
