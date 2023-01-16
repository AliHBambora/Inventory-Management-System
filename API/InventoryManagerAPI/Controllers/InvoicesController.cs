using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryManagerAPI.Models;
using Newtonsoft.Json;
using InventoryManagerAPI.DTO;
using System.Xml.Schema;
using InventoryManagerAPI.DAL;
using System.Xml.Linq;
using InventoryManagerAPI.Enum;

namespace InventoryManagerAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly DataContext _context;

        public InvoicesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetAllInvoices()
        {
            if (_context.Invoices == null)
            {
                return NotFound();
            }
            try
            {
                var result = from a in _context.Invoices
                             join b in _context.Customers on a.CustomerId equals b.CustomerId
                             select new
                             {
                                 InvoiceId = a.InvoiceId,
                                 InvoiceNumber = a.InvoiceNumber,
                                 InvoiceDate = a.InvoiceDate,
                                 TotalAmount = a.TotalAmount,
                                 Status = a.Status,
                                 CustomerName = b.Name,
                                 AmountPaid = a.AmountPaid,
                                 AmountDue = a.AmountDue
                             };
                return Ok(new { status = "Success", Result = result });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", message = e.Message });
            }

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetAllPendingInvoices()
        {
            if (_context.Invoices == null)
            {
                return NotFound();
            }
            try
            {
                var result = from a in _context.Invoices
                             join b in _context.Customers on a.CustomerId equals b.CustomerId
                             where a.Status == InvoiceStatus.Credit.ToString()
                             select new
                             {
                                 InvoiceId = a.InvoiceId,
                                 InvoiceNumber = a.InvoiceNumber,
                                 InvoiceDate = a.InvoiceDate,
                                 TotalAmount = a.TotalAmount,
                                 Status = a.Status,
                                 CustomerName = b.Name,
                                 AmountPaid = a.AmountPaid,
                                 AmountDue = a.AmountDue
                             };
                return Ok(new { status = "Success", Result = result });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", message = e.Message });
            }

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetAllPaidInvoices()
        {
            if (_context.Invoices == null)
            {
                return NotFound();
            }
            try
            {
                var result = from a in _context.Invoices
                             join b in _context.Customers on a.CustomerId equals b.CustomerId
                             where a.Status == InvoiceStatus.Cash.ToString()
                             select new
                             {
                                 InvoiceId = a.InvoiceId,
                                 InvoiceNumber = a.InvoiceNumber,
                                 InvoiceDate = a.InvoiceDate,
                                 TotalAmount = a.TotalAmount,
                                 Status = a.Status,
                                 CustomerName = b.Name,
                                 AmountPaid = a.AmountPaid,
                                 AmountDue = a.AmountDue
                             };
                return Ok(new { status = "Success", Result = result });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", message = e.Message });
            }

        }

        // GET: api/Invoices/5
        [HttpPost]
        public async Task<ActionResult<InvoiceDTO>> GetInvoice()
        {
            if (_context.Invoices == null)
            {
                return NotFound();
            }
            var id = new Guid(HttpContext.Request.Form["ID"]);
            try
            {
                var query = (from c in _context.Customers
                             join i in _context.Invoices on c.CustomerId equals i.CustomerId
                             join ip in _context.InvoiceProducts
                             on i.InvoiceId equals ip.InvoiceId
                             join p in _context.Products
                             on ip.ProductId equals p.Id
                             where ip.InvoiceId == id
                             select new
                             {
                                 InvoiceId = i.InvoiceId,
                                 InvoiceNumber = i.InvoiceNumber,
                                 InvoiceDate = i.InvoiceDate,
                                 TotalAmount = i.TotalAmount,
                                 Discount = i.Discount,
                                 Status = i.Status,
                                 Comments = i.Comments,
                                 Profit = i.Profit,
                                 AmountPaid = i.AmountPaid,
                                 AmountDue = i.AmountDue,
                                 ProductID = ip.ProductId,
                                 ProductName = p.Name,
                                 ProductDescription = p.Description,
                                 ProductQuantity = ip.ProductQuantity,
                                 ProductQuantityUnit = ip.ProductQuantityUnit,
                                 ProductPrice = ip.ProductUnitPrice,
                                 ProductTotal = ip.ProductTotalPrice,
                                 Customer = new Customer
                                 {
                                     CustomerId = c.CustomerId,
                                     Address = c.Address,
                                     Description = c.Description,
                                     Email = c.Email,
                                     Name = c.Name,
                                     PhoneNo = c.PhoneNo
                                 }
                             })
                            .GroupBy(x => new
                            {
                                x.InvoiceId,
                                x.InvoiceNumber,
                                x.InvoiceDate,
                                x.TotalAmount,
                                x.Status,
                                x.Comments,
                                x.Profit,
                                x.AmountPaid,
                                x.AmountDue,
                                x.Discount,
                                x.Customer
                            }).
                            Select(aa => new InvoiceDTO
                            {
                                InvoiceNumber = aa.Key.InvoiceNumber,
                                InvoiceDate = aa.Key.InvoiceDate,
                                TotalAmount = aa.Key.TotalAmount,
                                Discount = aa.Key.Discount,
                                Status = aa.Key.Status,
                                Comments = aa.Key.Comments,
                                customer = aa.Key.Customer,
                                AmountPaid = aa.Key.AmountPaid == null ? aa.Key.TotalAmount : (long)aa.Key.AmountPaid,
                                productList = aa.Select(bb => new ProductDTO
                                {
                                    name = bb.ProductName,
                                    description = bb.ProductDescription,
                                    id = bb.ProductID,
                                    price = (long)bb.ProductPrice,
                                    qty = bb.ProductQuantity,
                                    unit = bb.ProductQuantityUnit == "doz" ? QuantityUnit.doz : QuantityUnit.pcs,
                                    total = (long)bb.ProductTotal
                                }).ToList()
                            });
                return Ok(new { status = "success", data = query });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", Message = e.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Product>> AddInvoice(InvoiceDTO invoiceDTO)
        {
            if (_context.Invoices == null)
            {
                return Problem("Entity set 'DataContext.Products'  is null.");
            }
            try
            {
                var newInvoice = new Invoice
                {
                    InvoiceId = Guid.NewGuid(),
                    InvoiceDate = invoiceDTO.InvoiceDate,
                    Comments = invoiceDTO.Comments,
                    InvoiceNumber = invoiceDTO.InvoiceNumber,
                    CustomerId = invoiceDTO.customer.CustomerId,
                    Status = invoiceDTO.Status,
                    Profit = invoiceDTO.Profit,
                    TotalAmount = invoiceDTO.TotalAmount,
                    Discount = invoiceDTO.Discount,
                    AmountPaid = invoiceDTO.AmountPaid,
                    AmountDue = invoiceDTO.TotalAmount - invoiceDTO.AmountPaid
                };
                _context.Invoices.Add(newInvoice);

                foreach (var item in invoiceDTO.productList)
                {
                    var invoiceProduct = new InvoiceProduct
                    {
                        Id = Guid.NewGuid(),
                        InvoiceId = newInvoice.InvoiceId,
                        ProductId = item.id,
                        ProductQuantity = item.qty,
                        ProductQuantityUnit = item.unit.ToString(),
                        ProductUnitPrice = item.price,
                        ProductTotalPrice = item.total
                    };
                    _context.InvoiceProducts.Add(invoiceProduct);
                }
                await _context.SaveChangesAsync();
                return Ok(new { status = "success" });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", Message = e.Message });
            }

        }

        [HttpPost]
        public async Task<ActionResult<Product>> EditInvoice(Guid id,InvoiceDTO invoiceDTO)
        {
            if (_context.Invoices == null)
            {
                return Problem("Entity set 'DataContext.Products'  is null.");
            }
            try
            {
                //var id = new Guid(HttpContext.Request.Query["ID"]);
                var inv = _context.Invoices.FirstOrDefault(x => x.InvoiceId == id);

                inv.InvoiceDate = invoiceDTO.InvoiceDate;
                inv.Comments = invoiceDTO.Comments;
                inv.InvoiceNumber = invoiceDTO.InvoiceNumber;
                inv.CustomerId = invoiceDTO.customer.CustomerId;
                inv.Status = invoiceDTO.Status;
                inv.Profit = invoiceDTO.Profit;
                inv.TotalAmount = invoiceDTO.TotalAmount;
                inv.Discount = invoiceDTO.Discount;
                inv.AmountPaid = invoiceDTO.AmountPaid;
                inv.AmountDue = invoiceDTO.TotalAmount - invoiceDTO.AmountPaid;

                var invProducts = _context.InvoiceProducts.Where(x => x.InvoiceId == id).ToList();
                foreach (var item in invProducts)
                {
                    _context.InvoiceProducts.Remove(item);
                }

                foreach (var item in invoiceDTO.productList)
                {
                    var invoiceProduct = new InvoiceProduct
                    {
                        Id = Guid.NewGuid(),
                        InvoiceId = id,
                        ProductId = item.id,
                        ProductQuantity = item.qty,
                        ProductQuantityUnit = item.unit.ToString(),
                        ProductUnitPrice = item.price,
                        ProductTotalPrice = item.total
                    };
                    _context.InvoiceProducts.Add(invoiceProduct);
                }
                await _context.SaveChangesAsync();
                return Ok(new { status = "success" });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", Message = e.Message });
            }

        }

        // DELETE: api/Invoices/5
        [HttpPost]
        public async Task<IActionResult> DeleteInvoice(Guid id)
        {
            if (_context.Invoices == null)
            {
                return NotFound();
            }
            try
            {
                var invoice = await _context.Invoices.FindAsync(id);
                if (invoice == null)
                {
                    return NotFound();
                }

                _context.Invoices.Remove(invoice);
                await _context.SaveChangesAsync();

                return Ok(new { status = "success" });
            }
            catch(Exception e)
            {
                return Ok(new { status = "failed", Message = e.Message });
            }
            
        }

        private bool InvoiceExists(Guid id)
        {
            return (_context.Invoices?.Any(e => e.InvoiceId == id)).GetValueOrDefault();
        }
    }
}
