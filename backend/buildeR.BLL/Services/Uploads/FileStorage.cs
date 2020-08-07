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
    public class FileStorage : IFileStorage
    {
        private string relativePath = @"\buildeR\";
        public FileStorage()
        { }
        public async System.Threading.Tasks.Task<string> UploadAsync(IFormFile data)
        {
            RemoveFiles(GetPath()); 
            string newFileName = DateTime.Now.Ticks + "_" + Guid.NewGuid().ToString();

            var path = GetPath();
            Directory.CreateDirectory(path);

            var filePath = Path.Combine(path, newFileName + ".png");

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await data.CopyToAsync(stream);
            }

            return filePath;
        }
        public string GetPath()
        {
            var home = Environment.OSVersion.Platform == PlatformID.Unix ?
                Environment.GetEnvironmentVariable("HOME") :
                Environment.ExpandEnvironmentVariables("%LOCALAPPDATA%");
            return home + relativePath;
        }

        public void RemoveFiles(string root)
        {
            if (!Directory.Exists(root))
            {
                return;
            }
            var files = Directory.GetFiles(root, "*.png", SearchOption.AllDirectories).ToList();
            foreach (var file in files)
            {
                File.Delete(file);
            }
        }

        public string GetLastPhoto()
        {
            string root = GetPath();
            if (!Directory.Exists(root))
            {
                throw new InvalidOperationException("You do not have any pics.\n Use default or upload your.");
            }
            var lastFile = Directory.GetFiles(root, "*.png", SearchOption.AllDirectories).ToList().LastOrDefault();
            if (lastFile == null)
                throw new InvalidOperationException("You do not have any pics.\n Use default or upload your.");

            return lastFile;
        }
    }
}
