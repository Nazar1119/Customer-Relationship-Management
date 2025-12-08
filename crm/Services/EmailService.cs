using crm.Services;
using System.Net;
using System.Net.Mail;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmail(string to, string subject, string body)
    {
        var emailConfig = _config.GetSection("Email");
        string from = emailConfig["From"];
        string password = emailConfig["Password"];
        string host = emailConfig["Host"];
        int port = int.Parse(emailConfig["Port"]);

        var client = new SmtpClient(host, port)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(from, password)
        };

        var mail = new MailMessage(from, to, subject, body);
        mail.IsBodyHtml = false;

        await client.SendMailAsync(mail);
    }
}
