import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Button,
    Center,
} from "@chakra-ui/react";
import { FaSort } from "react-icons/fa";
import { useState, useEffect } from "react";

function WeatherTable() {
    const [weatherData, setWeatherData] = useState([]);
    const [sortType, setSortType] = useState("");

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                "https://eismoinfo.lt/weather-conditions-service"
            );
            const data = await response.json();
            setWeatherData(data);
        }
        fetchData();
    }, []);

    const handleSort = (type) => {
        if (sortType === type) {
            // reverse order if same column header is clicked
            setWeatherData([...weatherData].reverse());
        } else {
            // sort by selected column header
            setSortType(type);
            setWeatherData(
                [...weatherData].sort((a, b) => {
                    if (type === "id") {
                        return Number(a.id) - Number(b.id);
                    } else {
                        if (parseFloat(a[type]) < parseFloat(b[type])) {
                            return -1;
                        } else if (parseFloat(a[type]) > parseFloat(b[type])) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                })
            );
        }
    };

    return (
        <Table variant="striped" colorScheme="gray">
            <Thead>
                <Tr>
                    <Th alignItems="center">
                        ID
                        <IconButton
                            aria-label="sort ID"
                            icon={<FaSort />}
                            isRound
                            onClick={() => {
                                handleSort("id");
                            }}
                        />
                    </Th>
                    <Th>
                        Latitude
                        <IconButton
                            aria-label="sort Latitude"
                            icon={<FaSort />}
                            isRound
                            onClick={() => {
                                handleSort("lat");
                            }}
                        />
                    </Th>
                    <Th>
                        Longitude
                        <IconButton
                            aria-label="sort Longitude"
                            icon={<FaSort />}
                            isRound
                            onClick={() => {
                                handleSort("lng");
                            }}
                        />
                    </Th>
                    <Th>
                        Collection Date
                        <IconButton
                            aria-label="sort Collection Date"
                            icon={<FaSort />}
                            isRound
                            onClick={() => {
                                handleSort("surinkimo_data");
                            }}
                        />
                    </Th>
                    <Th>
                        Road Condition
                        <IconButton
                            aria-label="sort Road Condition"
                            icon={<FaSort />}
                            isRound
                            onClick={() => {
                                handleSort("kelio_danga");
                            }}
                        />
                    </Th>
                    <Th>
                        Air Temperature (℃)
                        <IconButton
                            aria-label="sort Air Temperature"
                            icon={<FaSort />}
                            isRound
                            onClick={() => {
                                handleSort("oro_temperatura");
                            }}
                        />
                    </Th>
                    <Th>
                        Dew Point (℃)
                        <IconButton
                            aria-label="sort Dew Point"
                            icon={<FaSort />}
                            isRound
                            onClick={() => {
                                handleSort("rasos_taskas");
                            }}
                        />
                    </Th>
                    <Th>
                        Road Surface Temperature (℃)
                        <IconButton
                            aria-label="sort Dew Point"
                            icon={<FaSort />}
                            isRound
                            onClick={() => {
                                handleSort("dangos_temperatura");
                            }}
                        />
                    </Th>
                    <Th>
                        Average Wind Speed (m/s)
                        <IconButton
                            aria-label="sort Dew Point"
                            icon={<FaSort />}
                            isRound
                            onClick={() => {
                                handleSort("vejo_greitis_vidut");
                            }}
                        />
                    </Th>
                    <Th>
                        Friction Coefficient
                        <IconButton
                            icon={<FaSort />}
                            isRound
                            onClick={() => {
                                handleSort("sukibimo_koeficientas");
                            }}
                        />
                    </Th>
                    <Th>Go Here</Th>
                </Tr>
            </Thead>
            <Tbody>
                {weatherData.map((data) => (
                    <Tr key={data.id}>
                        <Td>{data.id}</Td>
                        <Td>{data.lat}</Td>
                        <Td>{data.lng}</Td>
                        <Td>{data.surinkimo_data}</Td>
                        <Td>{data.kelio_danga}</Td>
                        <Td>{data.oro_temperatura}</Td>
                        <Td>{data.rasos_taskas}</Td>
                        <Td>{data.dangos_temperatura}</Td>
                        <Td>{data.vejo_greitis_vidut}</Td>
                        <Td>{data.sukibimo_koeficientas}</Td>
                        <IconButton icon={<FaSort />} isRound />
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}

export default WeatherTable;
