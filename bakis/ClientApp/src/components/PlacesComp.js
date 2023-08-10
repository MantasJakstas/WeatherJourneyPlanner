import React, { useState, useEffect } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { Text, Flex, Box } from "@chakra-ui/react";

const MarkerComponent = React.memo(
    ({
        marker,
        hoveredMarker,
        selectedMarker,
        handleMarkerClick,
        handleMarkerMouseOver,
        handleMarkerMouseOut,
    }) => {
        const getPhotoReferenceHref = () => {
            if (
                marker.photos != null
            ) {
                const htmlString = marker.photos[0].html_attributions[0];
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');
                const href = doc.querySelector('a').getAttribute('href');
                return href;
            }
            return null;
        };

        return (
            <Marker
                position={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
                onClick={() => handleMarkerClick(marker)}
                onMouseOver={() => handleMarkerMouseOver(marker)}
                onMouseOut={handleMarkerMouseOut}
                icon={
                    hoveredMarker && hoveredMarker.lat === marker.lat
                        ? {
                            url: marker.icon,
                            scaledSize: { width: 50, height: 50 },
                        }
                        : {
                            url: marker.icon,
                            scaledSize: { width: 40, height: 40 },
                        }
                }
            >
                {selectedMarker === marker && (
                    <InfoWindow onCloseClick={() => handleMarkerClick(null)}>
                        <Box>
                            <Flex justifyContent="space-between">
                                <Text>Name: </Text>
                                <Text as="b" ml={10} color="blue">
                                    {marker.name}
                                </Text>
                            </Flex>
                            <Flex justifyContent="space-between">
                                <Text>Rating: </Text>
                                <Text ml={10} color="blue">
                                    {marker.rating}
                                </Text>
                            </Flex>
                            <Flex justifyContent="space-between">
                                <Text>User total ratings: </Text>
                                <Text ml={10} color="blue">
                                    {marker.user_ratings_total}
                                </Text>
                            </Flex>
                            {marker.opening_hours && (
                                <Flex justifyContent="space-between">
                                    <Text>Is open: </Text>
                                    <Text ml={10} color="blue">
                                        {marker.opening_hours.open_now ? 'Open' : 'Closed'}
                                    </Text>
                                </Flex>
                            )}
                            <Flex justifyContent="space-between">
                                <Text>Photo: </Text>
                                <Text ml={10} color="blue">
                                    <a href={getPhotoReferenceHref()}> Link</a>
                                </Text>
                            </Flex>
                        </Box>
                    </InfoWindow>
                )}
            </Marker>
        );
    }
);


const PlaceMarkerComp = (props) => {
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [hoveredMarker, setHoveredMarker] = useState(null);
    const data = props.data;

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    const handleMarkerMouseOver = (marker) => {
        setHoveredMarker(marker);
    };

    const handleMarkerMouseOut = () => {
        setHoveredMarker(null);
    };

    useEffect(() => {
        const mappedData = [];
        data.forEach((item) => {
            item.results.forEach((result) => {
                const {
                    business_status,
                    geometry: {
                        location: { lat, lng },
                    },
                    name,
                    price_level,
                    rating,
                    types,
                    user_ratings_total,
                    vicinity,
                    icon,
                    photos,
                    opening_hours,
                } = result;

                mappedData.push({
                    business_status,
                    lat,
                    lng,
                    name,
                    price_level,
                    rating,
                    types,
                    user_ratings_total,
                    icon,
                    vicinity,
                    photos,
                    opening_hours,
                });
            });
        });
        setMarkers(mappedData);
    }, [data]);

    const renderMarkers = () => {
        return markers.map((marker, index) => (
            <MarkerComponent
                key={index}
                marker={marker}
                hoveredMarker={hoveredMarker}
                selectedMarker={selectedMarker}
                handleMarkerClick={handleMarkerClick}
                handleMarkerMouseOver={handleMarkerMouseOver}
                handleMarkerMouseOut={handleMarkerMouseOut}
            />
        ));
    };

    return <div>{renderMarkers()}</div>;
};

export default PlaceMarkerComp;
