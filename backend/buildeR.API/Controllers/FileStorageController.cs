
using System.IO;
using System;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces.Uploads;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;

namespace buildeR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileStorageController : ControllerBase
    {
        private readonly IFileStorage _fileStorage;
        public FileStorageController(IFileStorage fileStorage , IWebHostEnvironment envn)
        {
            _fileStorage = fileStorage;
        }

        [HttpPost]
        public async Task<ActionResult<string>> ImgUpload(IFormFile file)
        {
            var path = await _fileStorage.UploadAsync(file);
            return Ok(JsonConvert.SerializeObject(path));
        }

        [HttpGet("download")]
        public async Task<IActionResult> Download([FromQuery] string filePath)
        {
            var fileBytes = await _fileStorage.GetFileBytes(filePath);
            FileContentResult  image = File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, "userlogo.png");
            return image;
        }
    }
}
