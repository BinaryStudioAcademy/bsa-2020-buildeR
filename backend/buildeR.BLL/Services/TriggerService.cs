using AutoMapper;
using buildeR.BLL.Interfaces;
using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.ProjectTrigger;
using buildeR.Common.DTO.Quartz;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class TriggerService : BaseCrudService<ProjectTrigger, ProjectTriggerDTO, NewProjectTriggerDTO>, ITriggerService
    {
        private readonly IQuartzService _quartzService;
        public TriggerService(BuilderContext context, IMapper mapper, IQuartzService quartzService) : base(context, mapper) 
        {
            _quartzService = quartzService;
        }
        public async Task<IEnumerable<ProjectTriggerInfoDTO>> GetAllByProjectId(int projectId)
        {
            var listQuartzInfoDTO = await _quartzService.GetAllTriggersByProjectId(projectId.ToString());

            var triggersByProject = Mapper.Map<IEnumerable<ProjectTriggerInfoDTO>>(listQuartzInfoDTO);
            return triggersByProject.OrderBy(i => i.Id);
        }
        public async Task<ProjectTriggerInfoDTO> GetTriggerInfoById(int id)
        {
            var triggerDTO = await base.GetAsync(id);
            var quartzInfoDTO = await _quartzService
                .GetByTriggerIdAndProjectId(triggerDTO.Id.ToString(), triggerDTO.ProjectId.ToString());
            var triggerInfoDTO = Mapper.Map<ProjectTriggerInfoDTO>(quartzInfoDTO);
            return triggerInfoDTO;
        }
        public async Task<ProjectTriggerInfoDTO> GetTriggerInfoById(int triggerId, int projectId)
        {
            var quartzInfoDTO = await _quartzService
                .GetByTriggerIdAndProjectId(triggerId.ToString(), projectId.ToString());
            var triggerInfoDTO = Mapper.Map<ProjectTriggerInfoDTO>(quartzInfoDTO);
            return triggerInfoDTO;
        }
        public async Task<ProjectTriggerInfoDTO> CreateTrigger(NewProjectTriggerDTO trigger)
        {
            var cronExpression = trigger.CronExpression; // because entity ProjectTrigger don't have field "CronExpression"

            var createdTriggerDTO = await base.AddAsync(trigger);
            if(createdTriggerDTO != null)
            {
                createdTriggerDTO.CronExpression = cronExpression; // set CronExpression 
                var quartzDTO = Mapper.Map<QuartzDTO>(createdTriggerDTO);

                var quartzInfo = await _quartzService.AddScheduleJob(quartzDTO);
                
                return Mapper.Map<ProjectTriggerInfoDTO>(quartzInfo);
            }
            throw new ArgumentNullException();
        }
        public async Task<ProjectTriggerInfoDTO> UpdateTrigger(ProjectTriggerDTO trigger)
        {
            var cronExpression = trigger.CronExpression;
            await base.UpdateAsync(trigger);
            var updatedTrigger = await base.GetAsync(trigger.Id);
            updatedTrigger.CronExpression = cronExpression;

            var quartzDTO = Mapper.Map<QuartzDTO>(updatedTrigger);
            var quartzInfo =  await _quartzService.UpdateScheduleJob(quartzDTO);
            return Mapper.Map<ProjectTriggerInfoDTO>(quartzInfo);
        }
        public async Task DeleteTrigger(int id)
        {
            var trigger = await base.GetAsync(id);
            var quartzDTO = Mapper.Map<QuartzDTO>(trigger);
            await _quartzService.DeletScheduleJob(quartzDTO);
            await base.RemoveAsync(id);
        }
    }
}
