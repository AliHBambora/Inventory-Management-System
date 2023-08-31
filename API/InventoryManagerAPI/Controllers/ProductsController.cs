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

namespace InventoryManagerAPI.Controllers
{

    //Commands for database update
    //dotnet ef migrations add AddNames
    //dotnet ef database update AddNames

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly DataContext _context;

        public ProductsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            try
            {
                var result = _context.Products.ToList();
                return Ok(new { status = "Success", Result = result });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", message = e.Message });
            }
        }

        // GET: api/Products/5
        [HttpGet]
        public async Task<ActionResult<Product>> GetProduct(Guid id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);

                if (product == null)
                {
                    return Ok(new { status = "failed", Message = "Product not found" });
                }
                return Ok(new { status = "Success", result = product });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", message = e.Message });
            }
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> EditProduct(Product product)
        {
            var id = new Guid(HttpContext.Request.Query["ID"]);
            try
            {
                var Existingproduct = await _context.Products.FindAsync(id);
                if (Existingproduct != null)
                {
                    Existingproduct.Name = product.Name;
                    Existingproduct.Description = product.Description;
                    Existingproduct.WholeSalePrice = product.WholeSalePrice;
                    Existingproduct.RetailPrice = product.RetailPrice;
                    Existingproduct.Quantity = product.Quantity;
                    Existingproduct.QuantityUnit = product.QuantityUnit;
                    Existingproduct.CostPrice = product.CostPrice;
                }
                await _context.SaveChangesAsync();
                return Ok(new { status = "Success" });
            }
            catch (Exception e)
            {
                if (!ProductExists(id))
                {
                    return Ok(new { status = "failed", Message = "Product Not found" });
                }
                else
                {
                    return Ok(new { status = "failed", Message = e.Message });
                }
            }
        }

        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Product>> AddProduct(IFormCollection data)
        {
            if (_context.Products == null)
            {
                return Problem("Entity set 'DataContext.Products'  is null.");
            }
            try
            {
                var product = JsonConvert.DeserializeObject<Product>(data["Product"]);
                var newproduct = new Product
                {
                    Id = Guid.NewGuid(),
                    Name = product.Name,
                    Quantity = product.Quantity,
                    Description = product.Description,
                    WholeSalePrice = product.WholeSalePrice,
                    RetailPrice = product.RetailPrice,
                    CostPrice = product.CostPrice,
                    QuantityUnit = product.QuantityUnit,
                };
                _context.Products.Add(newproduct);
                await _context.SaveChangesAsync();
                return Ok(new { status = "Success" });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", Message = e.Message });
            }

        }

        // DELETE: api/Products/5
        [HttpPost]
        public async Task<IActionResult> DeleteProduct()
        {
            try
            {
                var id = new Guid(HttpContext.Request.Query["ID"]);
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return Ok(new { status = "failed", message = "Product not found" });
                }
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                return Ok(new { status = "Success" });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", message = e.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult> GetTopSellingProducts()
        {
            try
            {
                var from = HttpContext.Request.Form["from"];
                var to = HttpContext.Request.Form["to"];
                DateTime start = DateTime.Parse(from);
                DateTime end = DateTime.Parse(to);
                GetTopSellingProductsInDateRange(start, end);
                return Ok(new { status = "Success" });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", message = e.Message });
            }
        }

        private bool ProductExists(Guid id)
        {
            return (_context.Products?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        private void GetTopSellingProductsInDateRange(DateTime start, DateTime end)
        {
            var query = (from inv in _context.Invoices
                         join invp in _context.InvoiceProducts
                         on inv.InvoiceId equals invp.InvoiceId
                         where inv.InvoiceDate >= start && inv.InvoiceDate <= end
                         select new
                         {
                             Product = invp.Product,
                             ProductID = invp.ProductId,
                             ProductQuantity = invp.ProductQuantity,
                             ProductQuantityUnit = invp.ProductQuantityUnit
                         }).GroupBy(x => new
                         {
                             x.ProductID,
                             x.Product
                             //x.ProductQuantity,
                             //x.ProductQuantityUnit
                         }).Select(aa => new { 
                            Product  =aa.Key.Product
                         }).ToList();
            //}).GroupBy(x => new
            //{
            //    x.ProductID,
            //    x.Product,
            //    x.ProductQuantity,
            //    x.ProductQuantityUnit
            //}).Select(aa => new ProductDTO
            //{
            //    name = aa.Key.Product.Name,
            //    qty = (int)aa.Key.Product.Quantity,

            //}).ToList();
            //return query;
        }
    }
}
