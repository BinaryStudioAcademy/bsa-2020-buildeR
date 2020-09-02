using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using buildeR.BLL.Interfaces;
using buildeR.BLL.RabbitMQ;
using buildeR.Common.DTO.Notification;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace buildeR.BLL.Services
{
    public class NotificationsService : INotificationsService
    {
        private readonly BuilderContext _context;
        private readonly IMapper _mapper;
        private readonly NotificationsProducer _producer;

        private static JsonSerializerSettings _camelCaseProperties = new JsonSerializerSettings
        {
            ContractResolver = new DefaultContractResolver {NamingStrategy = new CamelCaseNamingStrategy()}
        };

        public NotificationsService(BuilderContext context, IMapper mapper, NotificationsProducer producer)
        {
            _context = context;
            _mapper = mapper;
            _producer = producer;
        }

        public async Task MarkAsRead(int notificationId)
        {
            (await _context.Notifications.FindAsync(notificationId)).IsRead = true;
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<NotificationDTO>> GetNotificationsByUserId(int id)
        {
            return _mapper.Map<IEnumerable<NotificationDTO>>(
                (await _context.Users.AsNoTracking().Include(u => u.Notifications)
                    .FirstOrDefaultAsync(u => u.Id == id)).Notifications.ToList());
        }

        public async Task<NotificationDTO> Create(NewNotificationDTO notification)
        {
            if (notification == null)
            {
                throw new ArgumentNullException(nameof(notification));
            }

            var entity = _mapper.Map<Notification>(notification);

            var additionResult = await _context.Notifications.AddAsync(entity);
            await _context.SaveChangesAsync();

            var createdEntity = await _context.Notifications.FindAsync(additionResult.Entity.Id);

            var dto = _mapper.Map<NotificationDTO>(createdEntity);

            _producer.Send(JsonConvert.SerializeObject(dto, _camelCaseProperties), createdEntity.GetType().Name);

            return dto;
        }
    }
}