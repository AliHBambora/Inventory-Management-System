using System;
using System.Collections.Generic;

namespace InventoryManagerAPI.Models
{
    public partial class Invoice
    {
        public Invoice()
        {
            InvoiceProducts = new HashSet<InvoiceProduct>();
        }

        public Guid InvoiceId { get; set; }
        public string InvoiceNumber { get; set; } = null!;
        public DateTime InvoiceDate { get; set; }
        public long TotalAmount { get; set; }
        public long Discount { get; set; }
        public string Status { get; set; } = null!;
        public string Comments { get; set; } = null!;
        public Guid CustomerId { get; set; }
        public long Profit { get; set; }
        public long? AmountPaid { get; set; }
        public long? AmountDue { get; set; }

        public virtual Customer Customer { get; set; } = null!;
        public virtual ICollection<InvoiceProduct> InvoiceProducts { get; set; }
    }
}
