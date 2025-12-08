namespace crm.Services
{
    public interface IPasswordGenerator
    {
        string GeneratePassword(int length = 8);
    }
}
