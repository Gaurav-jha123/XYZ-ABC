using HCM.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace HCM.Infrastructure.Data
{
    public class HCMDbContext : DbContext
    {
        public HCMDbContext(DbContextOptions<HCMDbContext> options) : base(options) { }

        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasData(
                new User { Id = new Guid("a3c6e53c-881a-4993-9b9d-210d0bf237f8"), Username = "admin", PasswordHash = "admin123", Role = "Admin" },
                new User { Id = new Guid("a7ca5d8e-5c99-43c6-ad72-c10d476ee3c4"), Username = "manager", PasswordHash = "manager123", Role = "Manager" }
            );
        }
    }

}
