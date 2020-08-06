using buildeR.BLL.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VaultSharp;
using VaultSharp.Core;
using VaultSharp.V1.AuthMethods.Token;
using VaultSharp.V1.Commons;

namespace buildeR.BLL.Services
{
    public class SecretService: ISecretService
    {
        private readonly IVaultClient vaultClient;
        private string path;

        public SecretService()
        {
            vaultClient = CreateVaultClient();
        }

        public async Task<Dictionary<string, string>> CreateSecretsAsync(Dictionary<string, string> secrets, string path = null)
        {
            path = ValidatePath(path);

            var result = await vaultClient.V1.Secrets.KeyValue.V2.WriteSecretAsync(path, secrets, null, "secret/");

            return result.Data;
        }

        public async Task<Dictionary<string, string>> ReadSecretsAsync(string path = null)
        {
            path = ValidatePath(path);

            Secret<SecretData<Dictionary<string, string>>> result = default;

            try
            {
                result = await vaultClient.V1.Secrets.KeyValue.V2.ReadSecretAsync<Dictionary<string, string>>(path, null, "secret");
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

            var result = await vaultClient.V1.Secrets.KeyValue.V2.WriteSecretAsync(path, secrets, null, "secret/");

            return result.Data;
        }

        public async Task DeleteSecretsAsync(string path = null)
        {
            path = ValidatePath(path);

            await vaultClient.V1.Secrets.KeyValue.V2.DeleteSecretAsync(path, "secret");
        }

        public void SetSecretsPath(string path)
        {
            if (String.IsNullOrEmpty(path))
                throw new ArgumentException("Path is invalid (null or empty)");

            this.path = path;
        }

        private IVaultClient CreateVaultClient()
        {
            var vaultToken = Environment.GetEnvironmentVariable("VAULT_TOKEN_ID");
            var vaultAddress = Environment.GetEnvironmentVariable("VAULT_ADDRESS");

            var authMethod = new TokenAuthMethodInfo(vaultToken);
            var vaultClientSettings = new VaultClientSettings(vaultAddress, authMethod);

            var vaultClient = new VaultClient(vaultClientSettings);

            return vaultClient;
        }

        private string ValidatePath(string path)
        {
            var result = path ?? this.path;

            if(string.IsNullOrEmpty(result))
                throw new InvalidOperationException("Cannot work with null or empty 'path'. Call 'SetSecretsPath' " +
                                                    "method, or pass 'path' directly to method.");

            return result;
        }
    }
}
