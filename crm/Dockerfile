
FROM mcr.microsoft.com/dotnet/aspnet:8.0-nanoserver-1809 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081



FROM mcr.microsoft.com/dotnet/sdk:8.0-nanoserver-1809 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["crm/crm.csproj", "crm/"]
RUN dotnet restore "./crm/crm.csproj"
COPY . .
WORKDIR "/src/crm"
RUN dotnet build "./crm.csproj" -c %BUILD_CONFIGURATION% -o /app/build


FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./crm.csproj" -c %BUILD_CONFIGURATION% -o /app/publish /p:UseAppHost=false


FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "crm.dll"]