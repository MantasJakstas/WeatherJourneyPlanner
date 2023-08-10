using bakis.Controllers;
using bakis.Models;

public class MatchingService
{
    public readonly WeatherStationService _weatherStationService;

    public MatchingService(WeatherStationService weatherStationService)
    {
        _weatherStationService = weatherStationService;
    }


    public async Task<List<WeatherStation>> GetMatchingStations(List<Coordinate> coordinates)
    {
        var weatherStations = await _weatherStationService.GetWeatherStationsAsync();

        var matchingStations = new List<WeatherStation>();

        foreach (var coord in coordinates)
        {
            var stations = weatherStations.Where(station =>
                Math.Abs(coord.Latitude - double.Parse(station.Lat)) < 0.008 &&
                Math.Abs(coord.Longitude - double.Parse(station.Lng)) < 0.008
            );

            matchingStations.AddRange(stations);
        }

        var distinctMatchingStations = matchingStations.Distinct().ToList();

        return distinctMatchingStations;
    }
}
