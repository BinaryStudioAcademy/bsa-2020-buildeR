# BSA 2020 | buildeR

Binary Studio Academy | 2020 | .NET buildeR is an analog of Jenkins which purpose is to build and deploy user projects.

## Production:
- [bsa-builder.xyz](https://bsa-builder.xyz)
- [Docker Images](https://hub.docker.com/u/bsa2020builder)

## Building sources
By default, apps run on the following ports:

| Application | Port |
|-|-|
| buildeR.**API** | 5050 |
| buildeR.**Processor** | 5060 |
| buildeR.**SignalR** | 5070 |
| buildeR.**Angular** | 80 or 4200 |
| RabbitMQ | 5672 |
| Vault | 8200 |
| Elasticsearch | 9200 |
| Kibana | 5601 |

#### Docker:
1. Make sure you have [Docker](https://www.docker.com) and [Docker Compose](https://docs.docker.com/compose/install).
2. Pull this repo to your machine.
3. You can build and run all application containers via `docker-compose up` command.
4. You can pull and run all 3rd-party services (Vault,ELK,RabbitMQ) via `docker-compose -f docker-compose.services.yml up -d` command.
5. Happy coding! :sunglasses:

## Environment variables
This is a list of the required environment variables:

#### Vault:
1. KV Secrets Engine **v2** is used.
2. Class SecretService use two environment variables: **VAULT_TOKEN_ID** and **VAULT_ADDRESS**. 
VAULT_TOKEN_ID is an authentication token, given by vault server. VAULT_ADDRESS is an address of vault server (example: http://localhost:8200).

#### RabbitMQ:
1. **RABBIT_MQ_HOST_NAME** - for hostname, **RABBIT_MQ_USERNAME** - for username, **RABBIT_MQ_PASSWORD** - for user password

## SendGrid
1. Environment variables: SENDGRID_API_KEY, SENDGRID_EMAIL, SENDGRID_Name