using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class WeatherStationController : ControllerBase
{
    private readonly WeatherStationService _weatherStationService;

    public WeatherStationController(WeatherStationService weatherStationService)
    {
        _weatherStationService = weatherStationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetWeatherStations()
    {
        var weatherStations = await _weatherStationService.GetWeatherStationsAsync();
        return Ok(weatherStations);
    }
}
