using System;
using System.Collections.Generic;
using System.Text;
using AutoMapper;
using buildeR.Common.DTO.Message;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public class MessageProfile : Profile
    {
        public MessageProfile()
        {
            CreateMap<Message, MessageDTO>();
            CreateMap<MessageDTO, Message>();
        }
    }
}
