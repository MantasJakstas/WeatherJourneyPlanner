using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace bakisTests.Services
{
    [TestClass()]
    public class RouteServiceTests
    {
        [TestMethod()]
        public void GetRouteCoordinates_ValidPolylineString_ReturnsCoordinates()
        {
            var polylineString = "qfj`HkjbuJpAlD|FfCnC";

            // Act
            var coordinates = RouteService.GetRouteCoordinates(polylineString);

            // Assert
            Assert.IsNotNull(coordinates);
            Assert.AreEqual(3, coordinates.Count());

            Assert.AreEqual(47.40729, coordinates[0].Latitude, 0.00001);
            Assert.AreEqual(61.29334, coordinates[0].Longitude, 0.00001);

            Assert.AreEqual(47.40688, coordinates[1].Latitude, 0.00001);
            Assert.AreEqual(61.29247, coordinates[1].Longitude, 0.00001);

            Assert.AreEqual(47.40561, coordinates[2].Latitude, 0.00001);
            Assert.AreEqual(61.29179, coordinates[2].Longitude, 0.00001);

        }
    }
}