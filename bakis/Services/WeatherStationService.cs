using bakis.Models;
using Newtonsoft.Json.Linq;

public class WeatherStationService
{
    public readonly HttpClient _httpClient;
    public readonly string _apiUrl;

    public WeatherStationService()
    {

    }

    public WeatherStationService(HttpClient httpClient, string apiUrl)
    {
        _httpClient = httpClient;
        _apiUrl = apiUrl;
    }

    public async Task<List<WeatherStation>> GetWeatherStationsAsync()
    {
        var response = await _httpClient.GetAsync("https://eismoinfo.lt/weather-conditions-service/");
        response.EnsureSuccessStatusCode();
        var responseBody = await response.Content.ReadAsStringAsync();

        var weatherStations = ParseWeatherStations(responseBody);

        return weatherStations;
    }

    public static List<WeatherStation> ParseWeatherStations(string responseBody)
    {
        var weatherStations = new List<WeatherStation>();
        var jsonArray = JArray.Parse(responseBody);

        foreach (var station in jsonArray)
        {
            var weatherStation = new WeatherStation
            {
                Pavadinimas = station["pavadinimas"].ToString(),
                Data = station["surinkimo_data"].ToString(),
                Lat = station["lat"].ToString(),
                Lng = station["lng"].ToString(),
                OroTemperatura = station["oro_temperatura"].ToString(),
                VejoGreitis = station["vejo_greitis_vidut"].ToString(),
                VejoKryptis = station["vejo_kryptis"].ToString(),
                KelioDanga = station["kelio_danga"].ToString(),
                KrituliuTipas = station["krituliu_tipas"].ToString(),
                KrituliuKiekis = station["krituliu_kiekis"].ToString(),
                SukibimoKoficientas = station["sukibimo_koeficientas"].ToString(),
            };

            weatherStations.Add(weatherStation);
        }

        return weatherStations;
    }

    public static WeatherSummary GetWeatherSummary(List<WeatherStation> matchedWeatherStations)
    {
        var temperatures = new List<double>();
        var precipitation = new List<double>();
        var roadKoficient = new List<double>();
        foreach (var station in matchedWeatherStations)
        {
            if (double.TryParse(station.OroTemperatura, out double temp))
            {
                temperatures.Add(temp);
            }

            if (double.TryParse(station.KrituliuKiekis, out double prec))
            {
                precipitation.Add(prec);
            }

            if (double.TryParse(station.SukibimoKoficientas, out double koef))
            {
                roadKoficient.Add(koef);
            }
        }

        var avgTemp = Math.Round(temperatures.Average(), 2);
        var avgPrecip = Math.Round(precipitation.Average(), 2);
        var avgKoef = Math.Round(roadKoficient.Average(), 2);
        return new WeatherSummary { AverageTemperature = avgTemp, AveragePrecipitation = avgPrecip, AverageRoadKoef = avgKoef };
    }
}
