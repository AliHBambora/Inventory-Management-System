using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerAPI
{
    public interface IJwtAuthenticationManager
    {
        public string[] Authenticate(string user, string password);
    }
}
