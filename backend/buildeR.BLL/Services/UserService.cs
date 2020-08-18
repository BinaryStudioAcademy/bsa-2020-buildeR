using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using buildeR.BLL.Exceptions;
using buildeR.BLL.Interfaces;
using buildeR.Common.DTO.User;
using buildeR.Common.DTO.UserSocialNetwork;
using buildeR.DAL.Context;
using buildeR.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace buildeR.BLL.Services
{
    public class UserService : IUserService
    {
        private readonly BuilderContext _context;
        private readonly IMapper _mapper;
        private readonly IEmailBuilder _emailBuilder;
        private readonly IEmailService _emailService;

        public UserService(BuilderContext context, IMapper mapper, IEmailService emailService, IEmailBuilder emailBuilder)
        {
            _context = context;
            _mapper = mapper;
            _emailService = emailService;
            _emailBuilder = emailBuilder;
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

        public async Task<UserDTO> Login(string UId)
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

        public async Task<UserDTO> Register(NewUserDTO creatingUser)
        {
            var userSN = new NewUserSocialNetworkDTO()
            {
                UId = creatingUser.UId,
                SocialNetworkId = (int)creatingUser.ProviderId+1,
                SocialNetworkUrl = creatingUser.ProviderUrl,
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

            var emailModel = _emailBuilder.GetSignUpLetter(creatingUser.Email, creatingUser.FirstName);
            await _emailService.SendEmailAsync(new List<string> { emailModel.Email }, emailModel.Subject, emailModel.Title, emailModel.Body);

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

        public async Task<bool> ValidateUsername(ValidateUserDTO user)
        {
            if (user.Id != 0)
            {
                return await _context.Users.AnyAsync(x => x.Username.ToLower() == user.Username.ToLower() && x.Id != user.Id);
            }
            else
            {
                return await _context.Users.AnyAsync(x => x.Username.ToLower() == user.Username.ToLower());
            }
        }

        public async Task<UserDTO> LinkProvider(LinkProviderDTO userLink)
        {
            var isUserExist = await _context.Users.AnyAsync(u => u.Id == userLink.UserId);

            if (isUserExist)
            {
                var userSN = new NewUserSocialNetworkDTO()
                {
                    UId = userLink.UId,
                    SocialNetworkId = (int)userLink.ProviderId + 1,
                    SocialNetworkUrl = userLink.ProviderUrl,
                };

                userSN.UserId = userLink.UserId;
                var userSNEntity = _mapper.Map<UserSocialNetwork>(userSN);
                _context.Add(userSNEntity);
                await _context.SaveChangesAsync();

                var updatedUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == userLink.UserId);
                return _mapper.Map<UserDTO>(updatedUser);
            }
            else
            {
                throw new NotFoundException("user", userLink.UserId);
            }
        }
    }
}