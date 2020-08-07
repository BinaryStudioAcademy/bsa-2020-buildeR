using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.User;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace buildeR.BLL.Services
{
    public class UserService : IUserService
    {
        private readonly BuilderContext _context;
        private readonly IMapper _mapper;

        public UserService(BuilderContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<UserDTO> GetUserById(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                throw new NotFoundException("user", id);
            }
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<ICollection<UserDTO>> GetAll()
        {
            var users = await _context.Users.ToListAsync();
            return _mapper.Map<ICollection<UserDTO>>(users);
        }

        public async Task<UserDTO> Create(UserDTO creatingUser)
        {
            var user = _mapper.Map<User>(creatingUser);
            _context.Add(user);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserDTO>(user);
        }

        public async Task Delete(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
            {
                throw new NotFoundException("user", id);
            }
            _context.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task<UserDTO> Update(UserDTO userDTO)
        {
            var user = _mapper.Map<User>(userDTO);
            var existing = await _context.Users.FirstOrDefaultAsync(x => x.Id == userDTO.Id);
            if (existing == null)
            {
                throw new NotFoundException("user", userDTO.Id);
            }
            _context.Entry(existing).CurrentValues.SetValues(user);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserDTO>(existing);
        }


    }
}