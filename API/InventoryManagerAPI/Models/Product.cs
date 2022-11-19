using System;
using System.Collections.Generic;

namespace InventoryManagerAPI.Models
{
    public partial class Product
    {
        public Product()
        {
            InvoiceProducts = new HashSet<InvoiceProduct>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public long WholeSalePrice { get; set; }
        public long? CostPrice { get; set; }
        public int Quantity { get; set; }
        public string QuantityUnit { get; set; } = null!;
        public long RetailPrice { get; set; }

        public virtual ICollection<InvoiceProduct> InvoiceProducts { get; set; }
    }
}
