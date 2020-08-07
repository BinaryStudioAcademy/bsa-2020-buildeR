
using System.Threading.Tasks;
using buildeR.BLL.Interfaces.Uploads;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace buildeR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageUploadController : ControllerBase
    {
        private readonly IImageStorage _imageStorage;
        public ImageUploadController(IImageStorage imageStorage)
        {
            _imageStorage = imageStorage;
        }

        [HttpPost]
        public async Task<ActionResult<string>> ImgUpload(IFormFile file)
        {
            var base64Img = await _imageStorage.UploadAsync(file);
            return Ok(JsonConvert.SerializeObject(base64Img));
        }

        [HttpGet]
        public async Task<ActionResult<string>> GetLastPhoto()
        {
            return Ok(JsonConvert.SerializeObject(await _imageStorage.GetLastPhotoAsync()));
        }
    }
}
