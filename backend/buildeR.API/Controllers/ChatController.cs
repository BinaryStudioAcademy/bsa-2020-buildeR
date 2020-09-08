using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.Message;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace buildeR.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        IChatService _chat;

        public ChatController(IChatService chat)
        {
            _chat = chat;
        }

        [HttpGet("{groupId}")]
        public async Task<List<MessageDTO>> GetGroupMessages(int groupId)
        {
            return await _chat.GetGroupMessages(groupId);
        }

        [HttpPost]
        public async Task<MessageDTO> SendMessage(MessageDTO message)
        {
            try
            {
                return await _chat.SendMessage(message);
            }
            catch (Exception e)
            {

                throw;
            }
        }
    }
}
