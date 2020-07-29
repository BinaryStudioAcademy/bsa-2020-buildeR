ARG MS_IMAGE_HUB="mcr.microsoft.com/dotnet/core"

FROM $MS_IMAGE_HUB/sdk:3.1-buster AS build
ARG PROJECT_NAME
WORKDIR /src
COPY ["buildeR.$PROJECT_NAME/buildeR.$PROJECT_NAME.csproj", "buildeR.$PROJECT_NAME/"]
RUN dotnet restore "buildeR.$PROJECT_NAME/buildeR.$PROJECT_NAME.csproj"
COPY . .
WORKDIR "/src/buildeR.$PROJECT_NAME"
RUN dotnet build "buildeR.$PROJECT_NAME.csproj" -c Release -o /app/build

FROM build AS publish
ARG PROJECT_NAME
RUN dotnet publish "buildeR.$PROJECT_NAME.csproj" -c Release -o /app/publish

FROM $MS_IMAGE_HUB/aspnet:3.1-buster-slim AS final
ARG PROJECT_NAME
ARG PROJECT_PORT
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE $PROJECT_PORT
ENV DLL_NAME=$PROJECT_NAME
ENTRYPOINT dotnet "buildeR.$DLL_NAME.dll"