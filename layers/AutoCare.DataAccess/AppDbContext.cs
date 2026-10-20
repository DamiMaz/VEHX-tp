using AutoCare.Entities.Entities;
using Microsoft.EntityFrameworkCore;

namespace AutoCare.DataAccess;

/// <summary>
/// Representa la sesión con la base de datos mediante Entity Framework Core (según guía N-Layers).
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Vehicle> Vehicles { get; set; } = null!;
    public DbSet<FuelLog> FuelLogs { get; set; } = null!;
    public DbSet<ServiceItem> ServiceItems { get; set; } = null!;
    public DbSet<ServiceLogRecord> ServiceLogRecords { get; set; } = null!;
    public DbSet<TelemetryRecord> TelemetryRecords { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de precisión decimal para SQL Server y compatibilidad SQLite
        modelBuilder.Entity<FuelLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TotalCost).HasPrecision(18, 2);
            entity.Property(e => e.CostPerLiter).HasPrecision(18, 2);
            entity.Property(e => e.CostPerKm).HasPrecision(18, 2);
            entity.HasIndex(e => e.VehicleId);
            entity.HasIndex(e => e.Date);
        });

        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.LicensePlate);
        });

        modelBuilder.Entity<ServiceItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Cost).HasPrecision(18, 2);
            entity.HasIndex(e => e.VehicleId);
        });

        modelBuilder.Entity<ServiceLogRecord>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Cost).HasPrecision(18, 2);
            entity.HasIndex(e => e.VehicleId);
            entity.HasIndex(e => e.ServiceItemId);
        });

        modelBuilder.Entity<TelemetryRecord>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.VehicleId);
        });
    }
}
