using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace buildeR.SignalR.Hubs
{
    public class TestHub : Hub
    {
        public async Task Send(string message)
        {
            await Clients.All.SendAsync("Send", message);
        }
    }
}
