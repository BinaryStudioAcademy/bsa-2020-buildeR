using System;
using System.Collections.Generic;
using System.Text;

namespace buildeR.RabbitMq.Interfaces
{
    public interface IProducer
    {
        void Send(string message, string type = null);
    }
}
