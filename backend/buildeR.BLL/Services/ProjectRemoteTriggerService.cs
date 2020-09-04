using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.ProjectRemoteTrigger;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace buildeR.BLL.Services
{
    public class ProjectRemoteTriggerService : IProjectRemoteTriggerService
    {
        private readonly BuilderContext _context;
        private readonly IMapper _mapper;
        public ProjectRemoteTriggerService(BuilderContext context,
                                           IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<IEnumerable<ProjectRemoteTriggerDTO>> GetProjectTriggers(int projectId)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == projectId);

            if(project == null)
            {
                throw new NotFoundException("Project", projectId);
            }

            var triggers = await _context.ProjectRemoteTriggers.Where(t => t.ProjectId == projectId).ToListAsync();

            return _mapper.Map<IEnumerable<ProjectRemoteTriggerDTO>>(triggers);
        }
        public async Task<ProjectRemoteTriggerDTO> CreateProejectTrigger(NewProjectRemoteTriggerDTO triggerDTO)
        {
            if(triggerDTO == null)
            {
                throw new NullDTOException(typeof(NewProjectRemoteTriggerDTO));
            }

            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == triggerDTO.ProjectId);

            if (project == null)
            {
                throw new NotFoundException("Project", triggerDTO.ProjectId);
            }

            var trigger = _mapper.Map<ProjectRemoteTrigger>(triggerDTO);

            _context.Add(trigger);
            await _context.SaveChangesAsync();

            return _mapper.Map<ProjectRemoteTriggerDTO>(trigger);
        }
        public async Task<ProjectRemoteTriggerDTO> UpdateProjectTrigger(ProjectRemoteTriggerDTO triggerDTO)
        {
            if(triggerDTO == null)
            {
                throw new NullDTOException(typeof(ProjectRemoteTriggerDTO));
            }

            var trigger = await _context.ProjectRemoteTriggers.FirstOrDefaultAsync(t => t.Id == triggerDTO.Id);

            if(trigger == null)
            {
                throw new NotFoundException("RemoteTrigger", triggerDTO.Id);
            }

            _mapper.Map(triggerDTO, trigger);

            _context.Entry(trigger).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return _mapper.Map<ProjectRemoteTriggerDTO>(trigger);
        }
        public async Task DeleteProjectTrigger(int triggerId)
        {
            var trigger = await _context.ProjectRemoteTriggers.FirstOrDefaultAsync(t => t.Id == triggerId);

            if (trigger == null)
            {
                throw new NotFoundException("ProjectRemoteTrigger", triggerId);
            }

            _context.ProjectRemoteTriggers.Remove(trigger);
            await _context.SaveChangesAsync();
        }
    }
}
