using AutoMapper;
using buildeR.Common.DTO.NotificationSetting;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class NotificationSettingProfile : Profile
    {
        public NotificationSettingProfile()
        {
            CreateMap<NotificationSetting, NotificationSettingDTO>();

            CreateMap<NotificationSettingDTO, NotificationSetting>();
            CreateMap<NewNotificationSettingDTO, Notification>();
        }
    }
}
