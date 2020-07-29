ARG MS_IMAGE_HUB="mcr.microsoft.com/dotnet/core"

FROM $MS_IMAGE_HUB/sdk:3.1-buster AS build
WORKDIR /src
COPY ["buildeR.API/buildeR.API.csproj", "buildeR.API/"]
RUN dotnet restore "buildeR.API/buildeR.API.csproj"
COPY . .
WORKDIR "/src/buildeR.API"
RUN dotnet build "buildeR.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "buildeR.API.csproj" -c Release -o /app/publish

FROM $MS_IMAGE_HUB/aspnet:3.1-buster-slim AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 5050
ENTRYPOINT ["dotnet", "buildeR.API.dll"]