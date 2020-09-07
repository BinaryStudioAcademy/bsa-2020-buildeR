namespace buildeR.Common.DTO
{
    public class UserLetterUserIdDTO
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public bool IsRespond { get; set; }
        public int UserId { get; set; }
    }
}