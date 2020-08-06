using buildeR.BLL.Interfaces.Uploads;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Services.Uploads
{
    public class ImageStorage : IImageStorage
    {
        public ImageStorage()
        { }
        public async System.Threading.Tasks.Task<string> UploadAsync(IFormFile data)
        {
            string newFileName = DateTime.Now.Ticks + "_" + Guid.NewGuid().ToString();

            var path = GetPath();
            Directory.CreateDirectory(path);

            var filePath = Path.Combine(path, newFileName + ".png");

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await data.CopyToAsync(stream);
            }

            return await GetBase64(data);
        }

        private string GetPath()
        {
            string home;
            if(Environment.OSVersion.Platform == PlatformID.Unix)
            {
                home = Environment.GetEnvironmentVariable("HOME");
            }
            else
            {
                home = Environment.ExpandEnvironmentVariables("%LOCALAPPDATA%");
            }
            
            return home + "\\buildeR";
        }

        private async Task<string> GetBase64(IFormFile file)
        {
            string base64;
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                var fileBytes = ms.ToArray();
                base64 = Convert.ToBase64String(fileBytes);
            }

            return base64;
        }

        public async Task<string> GetLastPhotoAsync()
        {
            string root = GetPath();  
            if (!Directory.Exists(root))
            {
                throw new InvalidOperationException("Users do not have any pics");
            }
            var lastFile = Directory.GetFiles(root, "*.png", SearchOption.AllDirectories).ToList().LastOrDefault();
            if(lastFile == null)
                throw new InvalidOperationException("There are no pics");

            byte[] imageArray = await System.IO.File.ReadAllBytesAsync(lastFile);
            string base64ImageRepresentation = Convert.ToBase64String(imageArray);

            return base64ImageRepresentation;
        }
    }
}
