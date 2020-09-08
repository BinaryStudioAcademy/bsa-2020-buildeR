using buildeR.Common.DTO.Message;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface IChatService
    {
        Task<MessageDTO> SendMessage(MessageDTO messageDTO);
        Task<List<MessageDTO>> GetGroupMessages(int groupId);
    }
}
