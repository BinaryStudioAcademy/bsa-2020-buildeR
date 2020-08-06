
using System.Threading.Tasks;
using buildeR.BLL.Interfaces.Uploads;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageUploadController : ControllerBase
    {
        private readonly IImageUpload _imageUpload;
        public ImageUploadController(IImageUpload imageUpload)
        {
            _imageUpload = imageUpload;
        }

        [HttpPost]
        public async Task<IActionResult> ImgUpload(IFormFile file)
        {
            await _imageUpload.UploadAsync(file);
            return Ok();
        }
    }
}
