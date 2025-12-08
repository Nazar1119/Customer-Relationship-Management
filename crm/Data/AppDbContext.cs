using crm.Models;
using Microsoft.EntityFrameworkCore;

namespace crm.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Device> Devices { get; set; }

    }
}
