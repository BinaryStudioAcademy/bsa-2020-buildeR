using AutoMapper;
using buildeR.BLL.Interfaces;
using buildeR.BLL.RabbitMQ;
using buildeR.Common.DTO.Message;
using buildeR.Common.DTO.User;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using Elasticsearch.Net;
using Microsoft.EntityFrameworkCore;
using Nest;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Org.BouncyCastle.Math.EC.Rfc7748;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class ChatService : IChatService
    {
        private readonly BuilderContext _context;
        private readonly IMapper _mapper;
        private readonly MessagesProducer _producer;

        public ChatService(BuilderContext context, IMapper mapper, MessagesProducer producer)
        {
            _context = context;
            _mapper = mapper;
            _producer = producer;
        }

        private static readonly JsonSerializerSettings CamelCaseProperties = new JsonSerializerSettings
        {
            ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() }
        };

        public async Task<List<MessageDTO>> GetGroupMessages(int groupId)
        {
            return  _mapper.Map<List<MessageDTO>>(await _context.Messages.Where(x => x.GroupId == groupId)
                .Include(s => s.Sender).ToListAsync());
        }

        public async Task<MessageDTO> SendMessage(MessageDTO messageDTO)
        {
            if (messageDTO == null)
            {
                throw new NullReferenceException();
            }
            
            var entity = _mapper.Map<Message>(messageDTO);
            var result = await _context.Messages.AddAsync(entity);
            await _context.SaveChangesAsync();

            var createdEntity = await _context.Messages.FindAsync(result.Entity.Id);
            var dto = _mapper.Map<MessageDTO>(createdEntity);
            dto.Sender = _mapper.Map<UserDTO>(await _context.Users.FindAsync(dto.SenderId));
            _producer.Send(JsonConvert.SerializeObject(dto, CamelCaseProperties), dto.Text);
            return dto;

        }
    }
}
