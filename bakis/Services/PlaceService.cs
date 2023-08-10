using bakis.Controllers;
using bakis.Models;
using Newtonsoft.Json;

public class PlaceService
{
    private static readonly HttpClient _httpClient = new HttpClient();

    public static async Task<List<PlaceResponse>> GetAllNearbyPlacesAsync(List<WeatherStation> matchedWeatherStations, string radius, string type)
    {
        if (string.IsNullOrEmpty(radius) || string.IsNullOrEmpty(type))
        {
            throw new ArgumentNullException(nameof(radius));
        }

        List<PlaceResponse> places = new List<PlaceResponse>();
        foreach (var station in matchedWeatherStations)
        {
            var nearbyPlaces = await GetNearbyPlacesAsync(
                double.Parse(station.Lat),
                double.Parse(station.Lng),
                int.Parse(radius),
                type
            );

            places.Add(nearbyPlaces);
        }
        return places;
    }

    public static async Task<PlaceResponse> GetNearbyPlacesAsync(double lat, double lng, int radius, string type)
    {
        string api = "APIKEY";
        var apiUrl = $"https://maps.googleapis.com/maps/api/place/nearbysearch/json?key={api}&location={lat},{lng}&radius={radius}&type={type}";
        var response = await _httpClient.GetAsync(apiUrl);
        var content = await response.Content.ReadAsStringAsync();
        var placesResponse = JsonConvert.DeserializeObject<PlaceResponse>(content);
        return placesResponse;
    }
}
