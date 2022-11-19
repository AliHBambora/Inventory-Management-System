using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;

namespace InventoryManagerAPI
{
    public class JwtAuthenticationManager : IJwtAuthenticationManager
    {
        
        private readonly string key;

        public IConfiguration Configuration { get; }

        public JwtAuthenticationManager(string key)
        {
            this.key = key;
        }

        public string[] Authenticate(string user, string password)
        {
            var builder = WebApplication.CreateBuilder();
            var username = builder.Configuration.GetSection("Credentials").GetSection("username").Value;
            var pass = builder.Configuration.GetSection("Credentials").GetSection("password").Value;
            List<string> list = new List<string>();
            if (user == username && password == pass)
            {
                var tokenhandler = new JwtSecurityTokenHandler();
                var tokenkey = Encoding.ASCII.GetBytes(key);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                    new Claim(ClaimTypes.Name, user),
                    new Claim("Pass", password)
                    }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenkey), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenhandler.CreateToken(tokenDescriptor);
                list.Add("success");
                list.Add(tokenhandler.WriteToken(token));
                return list.ToArray();
            }
            else
            {
                list.Add("fail");
                list.Add("Authentication failed");
                return list.ToArray();
            }
            
        }
    }
}
