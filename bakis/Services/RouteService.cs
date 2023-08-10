using bakis.Controllers;
using bakis.Models;
using PolylineEncoder.Net.Utility;

public class RouteService
{
    public static List<Coordinate> GetRouteCoordinates(string polylineString)
    {
        var utility = new PolylineUtility();
        var coordinates = new List<Coordinate>();
        var decodedPoints = utility.Decode(polylineString);

        foreach (var point in decodedPoints)
        {
            coordinates.Add(new Coordinate(point.Latitude, point.Longitude));
        }

        return coordinates;
    }
}
