using AutoCare.BusinessLogic.Interfaces;
using AutoCare.BusinessLogic.Managers;
using AutoCare.BusinessLogic.Services;
using AutoCare.DataAccess;
using AutoCare.DataAccess.Interfaces;
using AutoCare.DataAccess.Stores;
using AutoCare.Presentation.Base;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. CONFIGURACIÓN DE BASE DE DATOS (EF CORE)
// ==========================================
var provider = builder.Configuration["DatabaseProvider"] ?? "Sqlite";
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                       ?? "Data Source=autocare.db";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (provider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
    {
        var sqlServerConn = builder.Configuration.GetConnectionString("SqlServerConnection") ?? connectionString;
        options.UseSqlServer(sqlServerConn);
    }
    else
    {
        options.UseSqlite(connectionString);
    }
});

// ==========================================
// 2. DEPENDENCY INJECTION (STORES, MANAGERS, SERVICES)
// ==========================================
// Stores (DataAccess Layer)
builder.Services.AddScoped<IVehicleStore, VehicleStore>();
builder.Services.AddScoped<IFuelLogStore, FuelLogStore>();
builder.Services.AddScoped<IServiceItemStore, ServiceItemStore>();
builder.Services.AddScoped<IServiceLogStore, ServiceLogStore>();
builder.Services.AddScoped<ITelemetryStore, TelemetryStore>();

// Specialized Services (BusinessLogic Layer)
builder.Services.AddScoped<IFuelCalculationService, FuelCalculationService>();
builder.Services.AddScoped<IServicePredictorService, ServicePredictorService>();
builder.Services.AddScoped<ITelemetryService, TelemetryService>();

// Entity Managers (BusinessLogic Layer)
builder.Services.AddScoped<IVehicleManager, VehicleManager>();
builder.Services.AddScoped<IFuelLogManager, FuelLogManager>();
builder.Services.AddScoped<IServiceManager, ServiceManager>();
builder.Services.AddScoped<ITelemetryManager, TelemetryManager>();

// ==========================================
// 3. CONTROLLERS & EXPOSICIÓN (PRESENTATION LAYER)
// ==========================================
builder.Services.AddControllers()
    .AddApplicationPart(typeof(BaseController).Assembly)
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// ==========================================
// 4. CORS PARA FRONTEND (REACT / VITE)
// ==========================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ==========================================
// 5. OPENAPI & SCALAR DOCUMENTATION UI (.NET 9)
// ==========================================
builder.Services.AddOpenApi();

var app = builder.Build();

// ==========================================
// 6. INICIALIZACIÓN DE BASE DE DATOS Y SEED DATA
// ==========================================
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DbInitializer.SeedAsync(context);
}

// ==========================================
// 7. PIPELINE HTTP MIDDLEWARE
// ==========================================
app.MapOpenApi();
app.MapScalarApiReference(); // Disponible en /scalar/v1

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Redirección amigable desde la raíz hacia el visor interactivo de endpoints
app.MapGet("/", () => Results.Redirect("/scalar/v1"));
app.MapGet("/swagger", () => Results.Redirect("/scalar/v1"));

app.Run();
