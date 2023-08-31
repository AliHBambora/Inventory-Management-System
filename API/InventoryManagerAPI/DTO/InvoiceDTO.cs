using InventoryManagerAPI.Models;

namespace InventoryManagerAPI.DTO
{
    public class InvoiceDTO
    {
        public string InvoiceNumber { get; set; } = null!;
        public DateTime InvoiceDate { get; set; }
        public decimal TotalAmount { get; set; }

        public decimal Discount { get; set; }
        public string Status { get; set; } = null!;
        public string Comments { get; set; } = null!;
        public Customer customer { get; set; }
        public decimal Profit { get; set; }

        public decimal AmountPaid { get; set; }

        public List<ProductDTO> productList { get; set; }
    }

    public enum InvoiceStatus
    {
        Cash,
        Credit
    }
}
