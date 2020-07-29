# BSA 2020 | buildeR

Binary Studio Academy | 2020 | .NET buildeR is an analog of Jenkins which purpose is to build and deploy user projects.

##  Image for Production: [Docker Hub](https://hub.docker.com/u/bsa2020builder)

## Building sources
By default, apps run on the following ports:

| Application | Port |
|-|-|
| buildeR.**API** | 5050 |
| buildeR.**Processor** | 5060 |
| buildeR.**SignalR** | 5070 |
| buildeR.**Angular** | 80 |

#### Docker:
1. Make sure you have [Docker](https://www.docker.com) and [Docker Compose](https://docs.docker.com/compose/install).
2. Pull this repo to your machine.
3. You can build and run all containers via `docker-compose up` command.
4. Happy coding! :sunglasses: