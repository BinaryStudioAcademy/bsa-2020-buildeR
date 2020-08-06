using buildeR.BLL.Interfaces.Uploads;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace buildeR.BLL.Services.Uploads
{
    public class ImageUpload : IImageUpload
    {
        public ImageUpload()
        { }
        public async System.Threading.Tasks.Task UploadAsync(IFormFile data)
        {
            string newFileName = DateTime.Now.Ticks + "_" + Guid.NewGuid().ToString();

            var path = GetPath();
            Directory.CreateDirectory(path);

            var filePath = Path.Combine(path, newFileName + ".png");

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await data.CopyToAsync(stream);
            }
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
    }
}
