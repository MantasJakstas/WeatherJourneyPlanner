using GoogleMaps.LocationServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using PolylineEncoder.Net.Utility;
using System.Drawing;
using System.Net;
using System.Linq;
using bakis.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Newtonsoft.Json;
using System.Text.Json;

namespace bakis.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RouteController : ControllerBase
    {
        private readonly MatchingService _matchingService;
        //private readonly WeatherStationService _weatherStationService;
        public RouteController(MatchingService matchingService, WeatherStationService weatherStationService)
        {
            _matchingService = matchingService;
            //_weatherStationService = weatherStationService;
        }

        [HttpPost]
        [ActionName("places")]
        public async Task<IActionResult> PostPlaces([FromBody] RequestResponse requestData)
        {
            RequestResponse data = requestData;

            var weatherStationsCoords = RouteService.GetRouteCoordinates(data.Polyline);

            var matchingStations = await _matchingService.GetMatchingStations(weatherStationsCoords);

            var nearbyPlaces = await PlaceService.GetAllNearbyPlacesAsync(matchingStations, data.Radius, data.Type);

            return Ok(nearbyPlaces);
        }

        [HttpPost]
        [ActionName("weatherSummary")]
        public async Task<IActionResult> PostWeatherSummary([FromBody] Polyline requestData)
        {
            Polyline data = requestData;

            var weatherStationsCoords = RouteService.GetRouteCoordinates(data.PolylineString);

            var MatchinStations = await _matchingService.GetMatchingStations(weatherStationsCoords);

            var weatherSummary = WeatherStationService.GetWeatherSummary(MatchinStations);

            return Ok(weatherSummary);
        }
    }

    public class PlaceResponse
    {
        public List<Place> Results { get; set; }
    }

    public class RequestResponse
    {
        public string Polyline { get; set; }
        public string Type { get; set; }
        public string Rating { get; set; }
        public string Radius { get; set; }
    }
    public class Polyline
    {
        public string PolylineString { get; set; }
    }
}
