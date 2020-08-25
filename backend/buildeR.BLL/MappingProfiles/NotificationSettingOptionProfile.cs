using AutoMapper;
using buildeR.Common.DTO.NotificationSettingOption;
using buildeR.DAL.Entities;

namespace buildeR.BLL.MappingProfiles
{
    public sealed class NotificationSettingOptionProfile : Profile
    {
        public NotificationSettingOptionProfile()
        {
            CreateMap<NotificationSettingOption, NotificationSettingOptionDTO>();
            CreateMap<NotificationSettingOptionDTO, NotificationSettingOption>();
        }
    }
}
