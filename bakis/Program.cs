using bakis.Models;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Linq;

namespace bakis
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllersWithViews();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddHttpClient();

            builder.Services.AddScoped<WeatherStationService>(sp =>
            {
                // Get HttpClient service from service provider
                var httpClient = sp.GetRequiredService<HttpClient>();

                // Configure HttpClient options
                httpClient.BaseAddress = new Uri("https://eismoinfo.lt/");

                return new WeatherStationService(httpClient, "https://eismoinfo.lt/weather-conditions-service/");
            });
            builder.Services.AddScoped<WeatherStationController>();
            builder.Services.AddScoped<MatchingService>();
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();


            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");


            app.MapFallbackToFile("index.html");
            app.Run();
        }
    }
}
