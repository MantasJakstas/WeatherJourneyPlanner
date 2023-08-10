using bakis.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tests
{
    [TestClass()]
    public class WeatherStationServiceTests
    {

        [TestMethod()]
        public void ParseWeatherStations_ValidResponseBody_ReturnsWeatherStations()
        {
            var responseBody = "[{\"pavadinimas\":\"Station 1\",\"surinkimo_data\":\"2023-05-08\",\"lat\":\"1.234\",\"lng\":\"5.678\",\"oro_temperatura\":\"25.5\",\"vejo_greitis_vidut\":\"10.2\",\"vejo_kryptis\":\"N\",\"kelio_danga\":\"Dry\",\"krituliu_tipas\":\"Rain\",\"krituliu_kiekis\":\"5.6\",\"sukibimo_koeficientas\":\"0.9\"}]";

            // Act
            var weatherStations = WeatherStationService.ParseWeatherStations(responseBody);

            // Assert
            Assert.IsNotNull(weatherStations);
            Assert.AreEqual(1, weatherStations.Count());

            var station = weatherStations[0];
            Assert.AreEqual("Station 1", station.Pavadinimas);
            Assert.AreEqual("2023-05-08", station.Data);
            Assert.AreEqual("1.234", station.Lat);
            Assert.AreEqual("5.678", station.Lng);
            Assert.AreEqual("25.5", station.OroTemperatura);
            Assert.AreEqual("10.2", station.VejoGreitis);
            Assert.AreEqual("N", station.VejoKryptis);
            Assert.AreEqual("Dry", station.KelioDanga);
            Assert.AreEqual("Rain", station.KrituliuTipas);
            Assert.AreEqual("5.6", station.KrituliuKiekis);
            Assert.AreEqual("0.9", station.SukibimoKoficientas);
        }

        [TestMethod()]
        public async Task GetWeatherStationsAsync_ReturnsNotNull()
        {
            var weatherStationService = new WeatherStationService(new HttpClient(), "https://eismoinfo.lt/weather-conditions-service/");

            // Act
            var weatherStations = await weatherStationService.GetWeatherStationsAsync();

            // Assert
            Assert.IsNotNull(weatherStations);
        }

        [TestMethod()]
        public void GetWeatherSummary_ValidWeatherStations_ReturnsWeather()
        {
            // Arrange
            var weatherStations = new List<WeatherStation>
            {
                new WeatherStation { OroTemperatura = "20", KrituliuKiekis = "5", SukibimoKoficientas = "0.8" },
                new WeatherStation { OroTemperatura = "25", KrituliuKiekis = "10", SukibimoKoficientas = "0.9" },
                new WeatherStation { OroTemperatura = "30", KrituliuKiekis = "2", SukibimoKoficientas = "0.7" }
            };

            // Act
            var weatherSummary = WeatherStationService.GetWeatherSummary(weatherStations);

            // Assert
            Assert.AreEqual(25, weatherSummary.AverageTemperature);
            Assert.AreEqual(5.67, weatherSummary.AveragePrecipitation);
            Assert.AreEqual(0.80, weatherSummary.AverageRoadKoef);
        }
    }
}