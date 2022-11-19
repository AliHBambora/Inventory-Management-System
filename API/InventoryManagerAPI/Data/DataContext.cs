//using InventoryManagerAPI.Models;
//using Microsoft.Extensions.Hosting;

//namespace InventoryManagerAPI.Data
//{
//    public class DataContext:DbContext
//    {
//        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
//        public DbSet<Product> Products { get; set; }
//        public DbSet<Customer> Customers { get; set; }

//        public DbSet<Invoice> Invoices { get; set; }

//        protected override void OnModelCreating(ModelBuilder modelBuilder)
//        {
//            modelBuilder.Entity<Invoice>()
//                .HasOne(p => p.Customer)
//                .WithMany(b => b.Invoices);
//        }

//    }
//}
