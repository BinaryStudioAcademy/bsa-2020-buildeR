using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace buildeR.SignalR.Hubs
{
    public class NotificationsHub : Hub
    {
        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }
    }
}