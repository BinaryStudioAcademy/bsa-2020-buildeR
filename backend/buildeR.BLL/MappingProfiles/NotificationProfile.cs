using AutoMapper;

using buildeR.Common.DTO.Notification;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class NotificationProfile : Profile
    {
        public NotificationProfile()
        {
            CreateMap<Notification, NotificationDTO>();

            CreateMap<NotificationDTO, Notification>();
            CreateMap<NewNotificationDTO, Notification>();
        }
    }
}
