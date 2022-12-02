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
        public decimal? WholeSalePrice { get; set; }
        public decimal? CostPrice { get; set; }
        public int? Quantity { get; set; }
        public string? QuantityUnit { get; set; }
        public decimal RetailPrice { get; set; }

        public virtual ICollection<InvoiceProduct> InvoiceProducts { get; set; }
    }
}
