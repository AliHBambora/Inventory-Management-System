using System;
using System.Collections.Generic;

namespace InventoryManagerAPI.Models
{
    public partial class InvoiceProduct
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public Guid InvoiceId { get; set; }
        public int ProductQuantity { get; set; }
        public string ProductQuantityUnit { get; set; } = null!;
        public decimal ProductUnitPrice { get; set; }
        public decimal ProductTotalPrice { get; set; }

        public virtual Invoice Invoice { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;
    }
}
