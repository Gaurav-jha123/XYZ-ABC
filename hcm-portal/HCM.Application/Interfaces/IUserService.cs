using HCM.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HCM.Application.Interfaces
{
    public interface IUserService
    {
        Task<User?> ValidateUserAsync(string username, string password);
    }
}
