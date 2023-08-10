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
        const getImageUrl = () => {
            if (marker.kelioDanga != "")
            { 
                const url = `./images/${marker.kelioDanga}.png`
                return url;
            }
            return `./images/Sausa.png`;
        };
        return (
            <Marker
                key={marker.id}
                position={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
                icon={
                    hoveredMarker && hoveredMarker.lat === marker.lat
                        ? {
                            url:  getImageUrl(),
                            scaledSize: { width: 50, height: 50 },
                        }
                        : {
                            url: getImageUrl(),
                            scaledSize: { width: 40, height: 40 },
                        }
                }
                onClick={() => handleMarkerClick(marker)}
                onMouseOver={() => handleMarkerMouseOver(marker)}
                onMouseOut={handleMarkerMouseOut}
            >
                {selectedMarker === marker && (
                    <InfoWindow onCloseClick={() => handleMarkerClick(null)}>
                        <Box>
                            <Flex justifyContent="space-between">
                                <Text>Pavadinimas:</Text>
                                <Text color={"blue"}>{marker.pavadinimas}</Text>
                            </Flex>
                            <Flex justifyContent="space-between">
                                <Text>Data:</Text>
                                <Text color={"blue"}>{marker.data}</Text>
                            </Flex>
                            <Flex justifyContent="space-between">
                                <Text>Oro temperatūra (℃):</Text>
                                <Text color={"blue"}>{marker.oroTemperatura}</Text>
                            </Flex>
                            <Flex as='b' justifyContent="space-between">
                                <Text>Kelio dangos būklė:</Text>
                                <Text color={"blue"}>{marker.kelioDanga}</Text>
                            </Flex>
                            <Flex justifyContent="space-between">
                                <Text>Krituliu tipas:</Text>
                                <Text color={"blue"}>{marker.krituliuTipas}</Text>
                            </Flex>
                            <Flex justifyContent="space-between">
                                <Text>Krituliu kiekis:</Text>
                                <Text color={"blue"}>{marker.krituliuKiekis}</Text>
                            </Flex>
                            <Flex justifyContent="space-between">
                                <Text>Vidutinis vėjo greitis (m/s):</Text>
                                <Text color={"blue"}>{marker.vejoGreitis}</Text>
                            </Flex>
                            <Flex justifyContent="space-between">
                                <Text>Sukibimo koeficientas:</Text>
                                <Text color={"blue"}>{marker.sukibimoKoficientas}</Text>
                            </Flex>
                            <Flex justifyContent="space-between">
                                <Text>Lat:</Text>
                                <Text color={"blue"}>{marker.lat}</Text>
                            </Flex>
                            <Flex justifyContent="space-between">
                                <Text>Long:</Text>
                                <Text color={"blue"}>{marker.lng}</Text>
                            </Flex>
                        </Box>
                    </InfoWindow>
                )}
            </Marker>
        )
    }
);

const MapComponent = () => {
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [hoveredMarker, setHoveredMarker] = useState(null);

    useEffect(() => {
        const fetchMarkers = async () => {
            const start = Date.now();
            const response = await fetch(
                "/api/weatherstation"
            );

            const data = await response.json();
            const end = Date.now();
            console.log(`Marker Execution time: ${end - start} ms`);
            console.log(data)
            const newMarker = {
                pavadinimas: "Vilnius–Kaunas–Klaipėda",
                lat: "54.671011",
                lng: "25.119685",
                data: "2023-05-07 23:36",
                kelioDanga: "Šlapia",
                sukibimoKoficientas: "0.7",
                krituliuKiekis: "3",
                krituliuTipas: "lietus",
                oroTemperatura: "5",
                vejoGreitis: "0.6"
            };
            const newMarker2 = {
                pavadinimas: "Vilnius–Kaunas–Klaipėda",
                lat: "54.684564",
                lng: "25.054987",
                data: "2023-05-07 23:36",
                kelioDanga: "Drėgna",
                sukibimoKoficientas: "0.8",
                krituliuKiekis: "1",
                krituliuTipas: "",
                oroTemperatura: "5",
                vejoGreitis: "0.6"
            };
            setMarkers([...data, newMarker, newMarker2]);
        };
        fetchMarkers();
    }, []);

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    const handleMarkerMouseOver = (marker) => {
        setHoveredMarker(marker);
    };

    const handleMarkerMouseOut = () => {
        setHoveredMarker(null);
    };

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

export default MapComponent;
