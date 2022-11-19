using InventoryManagerAPI.Enum;

namespace InventoryManagerAPI.DTO
{
    public class ProductDTO
    {
        public Guid id { get; set; }
        public string name { get; set; }

        public string description { get; set; }

        public long price { get; set; }

        public int qty { get; set; }

        public QuantityUnit unit { get; set; }

        public long total { get; set; }
    }
}
