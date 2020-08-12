using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.User;
using buildeR.Common.DTO.UserSocialNetwork;
using buildeR.Common.Enums;
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

        public async Task<UserDTO> GetUserByUId(string UId)
        {
            var user = await _context.Users
                .Include(u => u.UserSocialNetworks)
                .FirstOrDefaultAsync(u => u.UserSocialNetworks.Any(sn => sn.UId == UId));
            if (user != null)
            {
                return _mapper.Map<UserDTO>(user);
            }
            else
            {
                return null;
            }
        }

        public async Task<ICollection<UserDTO>> GetAll()
        {
            var users = await _context.Users.ToListAsync();
            return _mapper.Map<ICollection<UserDTO>>(users);
        }

        public async Task<UserDTO> Create(NewUserDTO creatingUser)
        {
            var userSN = new NewUserSocialNetworkDTO()
            {
                UId = creatingUser.UId,
                SocialNetworkId = (int)creatingUser.ProviderId+1,
                SocialNetworkUrl = creatingUser.ProviderUrl
            };

            var user = _mapper.Map<User>(creatingUser);
            user.CreatedAt = DateTime.Now;
            _context.Add(user);
            await _context.SaveChangesAsync();

            var userDto = _mapper.Map<UserDTO>(user);

            userSN.UserId = userDto.Id;
            var userSNEntity = _mapper.Map<UserSocialNetwork>(userSN);
            _context.Add(userSNEntity);
            await _context.SaveChangesAsync();

            return userDto;
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