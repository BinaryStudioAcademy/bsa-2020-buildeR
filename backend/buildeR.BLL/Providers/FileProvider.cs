using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.User;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Providers
{
    public class FileProvider : IFileProvider
    {
        private readonly string BaseUrl = Environment.GetEnvironmentVariable(nameof(BaseUrl));

        public async Task<string> UploadUserPhoto(IFormFile file)
        {
            var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            var folderName = Path.Combine("Resources", "Avatars");
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

            var fullPath = Path.Combine(pathToSave, fileName);
            var dbPath = Path.Combine(BaseUrl, folderName, fileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return dbPath;
            
        }
    }
}
