using System;
using System.Collections.Generic;

namespace InventoryManagerAPI.Models
{
    public partial class Customer
    {
        public Customer()
        {
            Invoices = new HashSet<Invoice>();
        }

        public Guid CustomerId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
        public string? PhoneNo { get; set; }

        public virtual ICollection<Invoice> Invoices { get; set; }
    }
}
