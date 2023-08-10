using bakis.Controllers;
using bakis.Models;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[TestFixture]
public class WeatherApiTests
{

    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public async Task GetWeatherStationsAsync_ValidResponse_ReturnsWeatherStations()
    {
        // Arrange
        var weatherStationService = new WeatherStationService(new HttpClient(), "https://eismoinfo.lt/weather-conditions-service/");

        // Act
        var weatherStations = await weatherStationService.GetWeatherStationsAsync();

        // Assert
        Assert.NotNull(weatherStations);
    }

}
