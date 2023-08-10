import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    IconButton,
    Input,
    SkeletonText,
    Text,
    Switch,
    VStack,
    SimpleGrid,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Select,
    Divider,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import MapComponent from "./RoadWeatherData";
import PlaceMarkerComp from "./PlacesComp";
import { FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
    Polygon,
} from "@react-google-maps/api";
import SlidingPanel from "react-sliding-side-panel";
import "react-sliding-side-panel/lib/index.css";
import { useRef, useState, useEffect } from "react";
import { saveAs } from "file-saver";

const { buildGPX, GarminBuilder } = require('gpx-builder');
const { Point } = GarminBuilder.MODELS;

const libraries = ["places"];
const center = { lat: 55.19, lng: 23.54 };
const { env } = require('process');

const mapOptions = {
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
};

let directionsServiceNew;
let directionsRendererNew;
let polylineString = "";
let route = "";


function MapComp() {
    const { isLoaded } = useJsApiLoader({
            googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            libraries,
        });
    

    const [map, setMap] = useState(/** @type google.maps.Map */(null));
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState("");
    const [places, setPlaces] = useState("");
    const [duration, setDuration] = useState("");
    const [hideBox, setHideBox] = useState(true);
    const [openPanel, setOpenPanel] = useState(true);
    const [selectedOption, setSelectedOption] = useState("");
    const [value, setValue] = useState("");
    const [radius, setRadius] = useState("");
    const [temperature, setTemperature] = useState("");
    const [krituliai, setKrituliai] = useState("");
    const [kof, setKof] = useState("");
    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef();
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef();

    if (!isLoaded) {
        return <SkeletonText />;
    }

    function saveRouteAsGPX(route) {
        if (route === "") {
            alert("No route to save");
            return
        }
        let points = [];
        // Loop through each leg and each step in the route and add it to the GPX file
        const legs = route.legs;
        for (let i = 0; i < legs.length; i++) {
            const steps = legs[i].steps;
            for (let j = 0; j < steps.length; j++) {
                const step = steps[j];
                const lat = step.start_location.lat();
                const lon = step.start_location.lng();
                const ele = step.elevation;
                const time = step.duration.text;
                points.push(new Point(lat, lon, { ele: ele, time: time }));
            }
        }
        console.log(points);
        const gpxData = new GarminBuilder();

        gpxData.setSegmentPoints(points);

        console.log(buildGPX(gpxData.toObject()));

        const blob = new Blob([buildGPX(gpxData.toObject())], { type: "text/xml;charset=utf-8" });
        saveAs(blob, "route.gpx");
    }

    const onMapLoad = (map) => {
        setMap(map);
        // eslint-disable-next-line no-undef
        directionsServiceNew = new google.maps.DirectionsService();
        // eslint-disable-next-line no-undef
        directionsRendererNew = new google.maps.DirectionsRenderer({
            draggable: true,
            map,
        });
        console.log(directionsRendererNew);
    };

    function calculateRouteNew() {
        if (originRef.current.value === "" || destiantionRef.current.value === "") {
            alert("No route to calculate");
            return;
        }

        console.log(directionsRendererNew);
        if (radius == "") {
            alert("No radius chosen");
        }
        directionsRendererNew.addListener("directions_changed", () => {
            const directions = directionsRendererNew.getDirections();
            if (directions) {
                computeTotalDistance(directions);
            }
        });

        displayRoute(
            originRef.current.value,
            destiantionRef.current.value,
            directionsServiceNew,
            directionsRendererNew
        );
    }

    function displayRoute(origin, destination, service, display) {
        service
            .route({
                origin: origin,
                destination: destination,
                // eslint-disable-next-line no-undef
                travelMode: google.maps.TravelMode.DRIVING,
                avoidTolls: true,
            })
            .then((result) => {
                display.setDirections(result);
                route = result.routes[0];
                polylineString = result.routes[0].overview_polyline;
                sendPolylineString(result.routes[0].overview_polyline);
            })
            .catch((e) => {
                alert("Could not display directions due to: " + e);
            });
    }

    function computeTotalDistance(result) {
        let total = 0;
        const myroute = result.routes[0];

        if (!myroute) {
            return;
        }

        for (let i = 0; i < myroute.legs.length; i++) {
            total += myroute.legs[i].distance.value;
        }

        total = total / 1000;
        setDuration(myroute.legs[0].duration.text);
        setDistance(total);
    }

    const sendPolylineString = async (polylineString) => {
        const start = Date.now();
        try {
            if (!setPlaces) {
                return <SkeletonText />;
            }
            const response = await fetch("/api/route/places", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    polyline: polylineString,
                    type: selectedOption,
                    rating: value,
                    radius: radius,
                }),
            });

            const data = await response.json();
            const end = Date.now();
            console.log(`Execution time: ${end - start} ms`);

            setPlaces(data);
        } catch (error) {
            console.error(error);
        }
    };

    function clearRoute(directionsRenderer) {
        setDistance("");
        setDuration("");
        originRef.current.value = "";
        destiantionRef.current.value = "";
        console.log("Clear");
        setPlaces("")
        setTemperature("")
        setKrituliai("")
        route = "";
        directionsRenderer.setDirections({ routes: [] });
    }

    function hide() {
        setHideBox(!hideBox);
    }

    const handleOptionSelect = (option) => {
        if (option !== selectedOption) {
            setSelectedOption(option);
        }
    };

    const handleChange = (event) => {
        if (event.target.value > 5) {
            console.log("BLOGAII");
        }
        setValue(event.target.value);
    };

    function handleRadiusChange(event) {
        console.log(event.target.value);
        setRadius(event.target.value);
    }

    const getWeatherSummary = async () => {
        if (polylineString === "" || polylineString === null) {
            return;
        }
        try {
            const response = await fetch("/api/route/weatherSummary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    polylineString: polylineString,
                }),
            });
            const data = await response.json();
            console.log(data)
            setTemperature(data.averageTemperature);
            setKrituliai(data.averagePrecipitation);
            setKof(data.averageRoadKoef);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Flex
            position="relative"
            flexDirection="column"
            alignItems="center"
            h="93vh"
            w="100vw"
        >
            <Box position="absolute" left={0} top={0} h="100%" w="100%">
                <SlidingPanel
                    type={"right"}
                    isOpen={openPanel}
                    size={29}
                    noBackdrop={true}
                    backdropClicked={() => setOpenPanel(false)}
                    panelContainerClassName="panel-container"
                >
                    <Box mt={10} ml={10}>
                        <IconButton
                            icon={<FaAngleDoubleRight />}
                            colorScheme="red"
                            onClick={() => setOpenPanel(false)}
                        />
                    </Box>
                    <Divider orientation="horizontal" height="1vh" width="55vh" mx={5} />
                    <Box mt={5} ml={10}>
                        <Button
                            colorScheme="blue"
                            onClick={() => getWeatherSummary()}
                        >
                            Get weather summary
                        </Button>
                    </Box>
                    <Box mt={5} ml={10}>
                        <Text color="blue">Average temperature: {temperature}</Text>
                        <Text mt={3} color="blue">
                            Average Precipitation: {krituliai}
                        </Text>
                        <Text mt={3} color="blue">
                            Average road traction : {kof}
                        </Text>
                    </Box>
                    <Divider orientation="horizontal" height="3vh" width="55vh" mx={5} />
                    <VStack mt={30} mr="16vh">
                        <Text mr={40} fontSize="lg">
                            Preferences:
                        </Text>
                        <Grid templateColumns="repeat(2, 10fr)" gap={5}>
                            <GridItem colSpan={1} pl={40}>
                                <Flex justifyContent="space-between">
                                    <FormLabel mt={1}>Restaurant:</FormLabel>
                                    <Switch
                                        size="lg"
                                        onChange={() => handleOptionSelect("restaurant")}
                                        isChecked={selectedOption === "restaurant"}
                                    />
                                </Flex>
                                <Flex justifyContent="space-between">
                                    <FormLabel mt={1}>Museum:</FormLabel>
                                    <Switch
                                        size="lg"
                                        onChange={() => handleOptionSelect("museum")}
                                        isChecked={selectedOption === "museum"}
                                    />
                                </Flex>
                                <Flex justifyContent="space-between">
                                    <FormLabel mt={1}>Park:</FormLabel>
                                    <Switch
                                        size="lg"
                                        onChange={() => handleOptionSelect("park")}
                                        isChecked={selectedOption === "park"}
                                    />
                                </Flex>
                                <Flex justifyContent="space-between">
                                    <FormLabel mt={1}>Tourist attraction:</FormLabel>
                                    <Switch
                                        mt={3}
                                        size="lg"
                                        onChange={() => handleOptionSelect("tourist_attraction")}
                                        isChecked={selectedOption === "tourist_attraction"}
                                    />
                                </Flex>
                                <Flex justifyContent="space-between">
                                    <FormLabel mt={1}>Campground:</FormLabel>
                                    <Switch
                                        size="lg"
                                        onChange={() => handleOptionSelect("campground")}
                                        isChecked={selectedOption === "campground"}
                                    />
                                </Flex>
                                <Flex justifyContent="space-between">
                                    <FormLabel mt={1}>Lodging:</FormLabel>
                                    <Switch
                                        size="lg"
                                        onChange={() => handleOptionSelect("lodging")}
                                        isChecked={selectedOption === "lodging"}
                                    />
                                </Flex>
                            </GridItem>
                            <GridItem colSpan={1} ml="5vh">
                                <Flex justifyContent="space-between">
                                    <FormLabel mt={1}>Rating:</FormLabel>
                                    <Input
                                        value={value}
                                        onChange={handleChange}
                                        placeholder="0/5"
                                        size="sm"
                                    />
                                </Flex>
                                <Flex justifyContent="space-between" mt={5}>
                                    <FormLabel mt={1}>Radius:</FormLabel>
                                    <Select
                                        placeholder="Select"
                                        onChange={handleRadiusChange}
                                        width={90}
                                    >
                                        <option value="5000">5 km</option>
                                        <option value="10000">10 km</option>
                                        <option value="15000">15 km</option>
                                    </Select>
                                </Flex>
                            </GridItem>
                        </Grid>
                    </VStack>
                </SlidingPanel>
                <GoogleMap
                    center={center}
                    zoom={9}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    options={mapOptions}
                    onLoad={(map) => onMapLoad(map)}
                >
                    <MapComponent />
                    {places && <PlaceMarkerComp data={places} />}
                </GoogleMap>
            </Box>
            {hideBox && (
                <Box
                    p={4}
                    borderRadius="lg"
                    m={4}
                    bgColor="white"
                    shadow="base"
                    minW="container.md"
                    zIndex="1"
                >
                    <HStack spacing={2} justifyContent="space-between">
                        <Box flexGrow={1}>
                            <Autocomplete>
                                <Input type="text" placeholder="Origin" ref={originRef} />
                            </Autocomplete>
                        </Box>
                        <Box flexGrow={1}>
                            <Autocomplete>
                                <Input
                                    type="text"
                                    placeholder="Destination"
                                    ref={destiantionRef}
                                />
                            </Autocomplete>
                        </Box>

                        <ButtonGroup>
                            <Button
                                colorScheme="blue"
                                type="submit"
                                onClick={calculateRouteNew}
                            >
                                Calculate Route
                            </Button>
                            <IconButton
                                aria-label="center back"
                                icon={<FaTimes />}
                                onClick={() => clearRoute(directionsRendererNew)}
                            />
                        </ButtonGroup>
                    </HStack>
                    <HStack spacing={4} mt={4} justifyContent="space-between">
                        <Text>Distance: {distance} </Text>
                        <Text>Duration: {duration} </Text>
                        <Box>
                            <Button mr={10} colorScheme="blue" type="submit" onClick={hide}>
                                Hide
                            </Button>
                            <IconButton
                                aria-label="center back"
                                icon={<FaLocationArrow />}
                                isRound
                                onClick={() => {
                                    map.panTo(center);
                                    map.setZoom(15);
                                }}
                            />
                        </Box>
                    </HStack>
                </Box>
            )}
            (
            {!hideBox && (
                <Button mr={10} colorScheme="blue" type="submit" onClick={hide}>
                    Show
                </Button>
            )}
            )
            <Button
                mr="10vh"
                colorScheme="blue"
                onClick={() => setOpenPanel(true)}
                position="absolute"
                right={0}
                mt="50vh"
            >
                Show
            </Button>
            <Button
                mr="10vh"
                colorScheme="blue"
                onClick={() => saveRouteAsGPX(route)}
                position="absolute"
                right={0}
                mt="60vh"
            >
                GPX
            </Button>
        </Flex>
    );
}

export default MapComp;
