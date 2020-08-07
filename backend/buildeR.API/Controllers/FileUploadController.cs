
using System.Threading.Tasks;
using buildeR.BLL.Interfaces.Uploads;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace buildeR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadController : ControllerBase
    {
        private readonly IFileStorage _fileStorage;
        public FileUploadController(IFileStorage fileStorage , IWebHostEnvironment envn)
        {
            _fileStorage = fileStorage;
        }

        [HttpPost]
        public async Task<ActionResult<string>> ImgUpload(IFormFile file)
        {
            var path = await _fileStorage.UploadAsync(file);
            return Ok(JsonConvert.SerializeObject(path));
        }

        [HttpGet("rootpath")]
        public ActionResult<string> GetRothPath()
        {
            return Ok(JsonConvert.SerializeObject(_fileStorage.GetPath()));
        }

        [HttpGet]
        public ActionResult<string> GetLastPhoto()
        {
            return Ok(JsonConvert.SerializeObject(_fileStorage.GetLastPhoto()));
        }
    }
}
