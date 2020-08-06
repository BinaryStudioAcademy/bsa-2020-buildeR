using buildeR.BLL.Services.Uploads;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces.Uploads
{
    public interface IImageUpload
    {
        Task UploadAsync(IFormFile data);
    }
}
