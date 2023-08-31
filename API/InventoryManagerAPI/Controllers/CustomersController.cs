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
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly DataContext _context;

        public CustomersController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Customers/GetAllCustomers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetAllCustomers()
        {
            if (_context.Customers == null)
            {
                return NotFound();
            }
            try
            {
                var result = _context.Customers.ToList();
                return Ok(new { status = "Success", Result = result });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", message = e.Message });
            }

        }

        // GET: api/Customers/GetAllCustomers
        [HttpGet]
        public async Task<ActionResult<int>> GetCustomersCount()
        {
            if (_context.Customers == null)
            {
                return NotFound();
            }
            try
            {
                var result = _context.Customers.ToList();
                return Ok(new { status = "success", data = result.Count });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", message = e.Message });
            }

        }

        // GET: api/Customers/5
        [HttpGet]
        public async Task<ActionResult<Customer>> GetCustomer(Guid id)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(id);

                if (customer == null)
                {
                    return Ok(new { status = "failed", Message = "Customer not found" });
                }
                return Ok(new { status = "Success", result = new CustomerDTO { ID=customer.CustomerId,Name = customer.Name, Address = customer.Address, Contact = customer.PhoneNo, Description = customer.Description } });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", message = e.Message });
            }
        }

        // PUT: api/Customers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> EditCustomer(IFormCollection fc)
        {
            var id = new Guid(HttpContext.Request.Query["ID"]);
            try
            {
                var customer = await _context.Customers.FindAsync(id);
                if (customer != null)
                {
                    customer.Name = fc["Name"];
                    customer.Description = fc["Description"];
                    customer.Address = fc["Address"];
                    customer.PhoneNo = fc["PhoneNo"];
                }
                await _context.SaveChangesAsync();
                return Ok(new { status = "Success" });
            }
            catch (Exception e)
            {
                if (!CustomerExists(id))
                {
                    return Ok(new { status = "failed", Message = "Customer Not found" });
                }
                else
                {
                    return Ok(new { status = "failed", Message = e.Message });
                }
            }
        }

        // POST: api/Customers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Customer>> AddCustomer(IFormCollection data)
        {
            if (_context.Customers == null)
            {
                return Problem("Entity set 'DataContext.Customers'  is null.");
            }
            try
            {
                var customer = new Customer
                {
                    CustomerId = Guid.NewGuid(),
                    Name = data["Name"],
                    Address = data["Address"],
                    Description = data["Description"],
                    PhoneNo = data["Contact"]
                };
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
                return Ok(new { status = "Success" });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", Message = e.Message });
            }

        }

        // DELETE: api/Customers/5
        [HttpPost]
        public async Task<IActionResult> DeleteCustomer()
        {
            try
            {
                var id = new Guid(HttpContext.Request.Query["ID"]);
                var customer = await _context.Customers.FindAsync(id);
                if (customer == null)
                {
                    return Ok(new { status = "failed", message = "Customer not found" });
                }
                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();
                return Ok(new { status = "Success" });
            }
            catch (Exception e)
            {
                return Ok(new { status = "failed", message = e.Message });
            }
        }

        private bool CustomerExists(Guid id)
        {
            return (_context.Customers?.Any(e => e.CustomerId == id)).GetValueOrDefault();
        }
    }
}
