using HCM.Application.Interfaces;
using HCM.Domain.Entities;
using HCM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCM.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly HCMDbContext _context;

        public UserService(HCMDbContext context)
        {
            _context = context;
        }

        public async Task<User?> ValidateUserAsync(string username, string password)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == password);
        }
    }
}
