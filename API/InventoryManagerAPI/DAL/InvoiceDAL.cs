using InventoryManagerAPI.Models;

namespace InventoryManagerAPI.DAL
{
    public class InvoiceDAL
    {
        private readonly DataContext _context;

        public InvoiceDAL(DataContext context)
        {
            _context = context;
        }
        public void AddInvoice(Invoice invoice,Guid customerID)
        {
            try
            {
                Invoice inv = new Invoice
                {
                    InvoiceId = invoice.InvoiceId,
                    Comments = invoice.Comments,
                    InvoiceNumber = invoice.InvoiceNumber,
                    InvoiceDate = invoice.InvoiceDate,
                    TotalAmount = invoice.TotalAmount,
                    Status = invoice.Status,
                    CustomerId = customerID
                };
                _context.Invoices.Add(inv);
                _context.SaveChangesAsync();

            }
            catch(Exception e)
            {
                throw e;
            }
        }
    }
}
