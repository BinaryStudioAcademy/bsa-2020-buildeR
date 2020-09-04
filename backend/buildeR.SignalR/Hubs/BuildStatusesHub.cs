using System.Threading.Tasks;
using buildeR.Common.DTO;
using Microsoft.AspNetCore.SignalR;

namespace buildeR.SignalR.Hubs
{
    public class BuildStatusesHub : Hub
    {
        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }
    }
}