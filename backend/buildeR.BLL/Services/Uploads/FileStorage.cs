using buildeR.BLL.Interfaces.Uploads;
using Microsoft.AspNetCore.Http;
using MimeTypes;
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
        private string imageFolder = "images\\";
        private string filesFolder = "files\\";

        public FileStorage()
        { }
        public string GetPath()
        {
            var home = Environment.OSVersion.Platform == PlatformID.Unix ?
                Environment.GetEnvironmentVariable("HOME") :
                Environment.ExpandEnvironmentVariables("%LOCALAPPDATA%");
            return home;
        }
        public async System.Threading.Tasks.Task<string> UploadAsync(IFormFile data)
        {
            var uploadedExtension = MimeTypeMap.GetExtension(data.ContentType);
            if (IsImage(uploadedExtension))
                return await UploadFile(data, imageFolder);
            else return await UploadFile(data, filesFolder);
        }

        public async System.Threading.Tasks.Task<string> UploadFile(IFormFile image, string folderName)
        {
            relativePath += folderName;
            if(folderName == imageFolder)
                RemoveImages(GetPath() + relativePath); //to hold only one user logo

            string newFileName = DateTime.Now.Ticks + "_" + Guid.NewGuid().ToString() + MimeTypeMap.GetExtension(image.ContentType);

            var path = GetPath() + relativePath;
            Directory.CreateDirectory(path);


            var filePath = Path.Combine(path, newFileName);

            using (var stream = new FileStream(filePath , FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            return relativePath + newFileName;
        }

        /*public async System.Threading.Tasks.Task<string> UploadFile(IFormFile file)
        {
            relativePath += "files\\";
            string newFileName = DateTime.Now.Ticks + "_" + Guid.NewGuid().ToString() + MimeTypeMap.GetExtension(file.ContentType);

            var path = GetPath() + relativePath;
            Directory.CreateDirectory(path);

            var filePath = Path.Combine(path, newFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return relativePath + newFileName ;
        }*/

        private bool IsImage(string extension)
        {
            var extensions = new List<string> { ".jpg", ".gif", ".png", ".jpeg" }; 
            return extensions.Contains(extension);
           
        }

        public void RemoveImages(string root)
        {
            if (!Directory.Exists(root))
            {
                return;
            }

            var ext = new List<string> { ".jpg", ".gif", ".png", ".jpeg"}; 
            var files = Directory
                .GetFiles(root, "*.*", SearchOption.AllDirectories)
                .Where(s => ext.Contains(Path.GetExtension(s).ToLowerInvariant()));
            foreach (var file in files)
            {
                File.Delete(file);
            }
        }

        public async Task<byte[]> GetFileBytes(string filePath)
        {
            byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(GetPath() + filePath);
            return fileBytes;
        }
    }
}
