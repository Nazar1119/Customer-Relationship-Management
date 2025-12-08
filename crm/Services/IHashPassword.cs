namespace crm.Services
{
    public interface IHashPassword
    {
        string Hash(string password);
    }
}
