using buildeR.BLL.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using VaultSharp;
using VaultSharp.Core;
using VaultSharp.V1.AuthMethods.Token;
using VaultSharp.V1.Commons;

namespace buildeR.BLL.Services
{
    public class SecretService: ISecretService
    {
        private readonly IConfiguration _configuration;

        private IVaultClient Client => _lazyClient.Value;
        private readonly Lazy<IVaultClient> _lazyClient;

        private string path;

        public SecretService(IConfiguration configuration)
        {
            _lazyClient = new Lazy<IVaultClient>(() => CreateVaultClient());
            _configuration = configuration;
        }

        public async Task<Dictionary<string, string>> CreateSecretsAsync(Dictionary<string, string> secrets, string path = null)
        {
            path = ValidatePath(path);

            var result = await Client.V1.Secrets.KeyValue.V2.WriteSecretAsync(path, secrets, null, "secret/");

            return result.Data;
        }

        public async Task<Dictionary<string, string>> ReadSecretsAsync(string path = null)
        {
            path = ValidatePath(path);

            Secret<SecretData<Dictionary<string, string>>> result = default;

            try
            {
                result = await Client.V1.Secrets.KeyValue.V2.ReadSecretAsync<Dictionary<string, string>>(path, null, "secret");
            }
            catch (VaultApiException ex)
            {
                throw new Exception("Something went wrong with Vault. Probably secrets does not exist by this path", ex);
            }

            return result.Data.Data;
        }

        

        public async Task<Dictionary<string, string>> UpdateSecretsAsync(Dictionary<string, string> secrets, string path = null)
        {
            path = ValidatePath(path);

            var result = await Client.V1.Secrets.KeyValue.V2.WriteSecretAsync(path, secrets, null, "secret/");

            return result.Data;
        }

        public async Task DeleteSecretsAsync(string path = null)
        {
            path = ValidatePath(path);
            await Client.V1.Secrets.KeyValue.V2.DeleteSecretAsync(path, "secret");
        }

        public void SetSecretsPath(string path)
        {
            if (string.IsNullOrEmpty(path))
                throw new ArgumentException("Path is invalid (null or empty)");

            this.path = path;
        }

        private IVaultClient CreateVaultClient()
        {
            var authMethod = new TokenAuthMethodInfo(_configuration["VAULT_TOKEN_ID"]);
            var vaultClientSettings = new VaultClientSettings(_configuration["VAULT_ADDRESS"], authMethod);

            return new VaultClient(vaultClientSettings);
        }

        private string ValidatePath(string path)
        {
            var result = path ?? this.path;

            if (string.IsNullOrEmpty(result))
                throw new InvalidOperationException("Cannot work with null or empty 'path'. Call 'SetSecretsPath' " +
                                                    "method, or pass 'path' directly to method.");

            return result;
        }
    }
}
