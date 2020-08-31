using buildeR.BLL.Services.Abstract;
using buildeR.Common.DTO.TeamMember;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace buildeR.BLL.Interfaces
{
    public interface ITeamMemberService : ICrudService<TeamMemberDTO, NewTeamMemberDTO, int>
    {
        Task<TeamMemberDTO> GetById(int id);
        Task<IEnumerable<TeamMemberDTO>> GetAll();
        Task<TeamMemberDTO> Create(NewTeamMemberDTO teamMember);
        Task Update(TeamMemberDTO teamMember);
        Task Delete(int id);
    }
}
