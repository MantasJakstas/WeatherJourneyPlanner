using bakis.Controllers;
using bakis.Models;
using Microsoft.AspNetCore.Routing;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bakisTests.Services
{
    [TestClass()]
    public class PlaceServiceTests
    {
        [TestMethod()]
        public async Task GetAllNearbyPlacesAsync_ValidInput_ReturnsListOfPlaceResponses()
        {
            // Arrange
            var matchedWeatherStations = new List<WeatherStation>
            {
            new WeatherStation { Lat = "12.345", Lng = "67.890" },
            new WeatherStation { Lat = "23.456", Lng = "78.901" }
            };
            var radius = "500";
            var type = "restaurant";

            // Act
            var places = await PlaceService.GetAllNearbyPlacesAsync(matchedWeatherStations, radius, type);

            // Assert
            Assert.IsNotNull(places);
            Assert.AreEqual(2, places.Count);
            Assert.IsTrue(places.All(p => p is PlaceResponse));
        }

        [TestMethod()]
        public async Task GetNearbyPlacesAsync_ValidInput_ReturnsPlaceResponse()
        {
            var lat = 12.345;
            var lng = 67.890;
            var radius = 500;
            var type = "restaurant";

            // Act
            var place = await PlaceService.GetNearbyPlacesAsync(lat, lng, radius, type);

            // Assert
            Assert.IsNotNull(place);
            Assert.IsTrue(place is PlaceResponse);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public async Task GetAllNearbyPlacesAsync_NullRadiusAndType_ThrowsArgumentNullException()
        {
            // Arrange
            var matchedWeatherStations = new List<WeatherStation>
    {
        new WeatherStation { Lat = "12.345", Lng = "67.890" }
    };

            string radius = null;
            var type = "restaurant";

            // Act
            await PlaceService.GetAllNearbyPlacesAsync(matchedWeatherStations, radius, type);
        }
    }
}