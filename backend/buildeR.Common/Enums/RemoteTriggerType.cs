using System;

namespace buildeR.Common.Enums
{
    [Flags]
    public enum RemoteTriggerType
    {
        Undefined = 0,
        Push = 1,
        PullRequest = 2,
        All = Push | PullRequest,
    }
}
