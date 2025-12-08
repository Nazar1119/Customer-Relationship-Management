using System.Security.Cryptography;
using System.Text;

namespace crm.Services
{
    public class PasswordGenerator : IPasswordGenerator
    {
        private const string LowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        private const string UppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        private const string DigitChars = "0123456789";

        public string GeneratePassword(int length = 16)
        {
            string allChars = LowercaseChars + UppercaseChars + DigitChars;

            var password = new StringBuilder(length);

     
            password.Append(GetRandomChar(LowercaseChars));
            password.Append(GetRandomChar(UppercaseChars));
            password.Append(GetRandomChar(DigitChars));

            for (int i = 4; i < length; i++)
            {
                password.Append(GetRandomChar(allChars));
            }

            return Shuffle(password.ToString());
        }
        private char GetRandomChar(string charSet)
        {
            return charSet[RandomNumberGenerator.GetInt32(0, charSet.Length)];
        }

        private string Shuffle(string str)
        {
            char[] array = str.ToCharArray();
            for (int n = array.Length - 1; n > 0; n--)
            {
                int k = RandomNumberGenerator.GetInt32(0, n + 1);
                (array[n], array[k]) = (array[k], array[n]);
            }
            return new string(array);
        }
    }
}

