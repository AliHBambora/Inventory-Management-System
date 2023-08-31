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
        public decimal TotalAmount { get; set; }
        public decimal Discount { get; set; }
        public string Status { get; set; } = null!;
        public string Comments { get; set; } = null!;
        public Guid CustomerId { get; set; }
        public decimal Profit { get; set; }
        public decimal? AmountPaid { get; set; }
        public decimal? AmountDue { get; set; }

        public virtual Customer Customer { get; set; } = null!;
        public virtual ICollection<InvoiceProduct> InvoiceProducts { get; set; }
    }
}
