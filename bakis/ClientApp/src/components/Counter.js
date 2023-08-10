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

export function Counter() {
    const [weatherData, setWeatherData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch("/api/weatherstation");
            const data = await response.json();
            console.log(data)
            setWeatherData(data);
        }
        fetchData();
    }, []);

    return (
        <div>
            <Table variant="striped" colorScheme="gray">
                <Thead>
            {weatherData.map((data, index) => (
                <Tr key={index}>
                    <Td>{data.pavadinimas}</Td>
                    <Td>{data.lat}</Td>
                    <Td>{data.lng}</Td>
                    <Td>{data.data}</Td>
                    <Td>{data.kelioDanga}</Td>
                    <Td>{data.oroTemperatura}</Td>
                    <Td>{data.vejoGreitis}</Td>
                    <Td>{data.sukibimoKoficientas}</Td>
                    <Td>{data.krituliuTipas}</Td>
                    <Td>{data.krituliuKiekis}</Td>
                </Tr>
            ))}
                    </Thead>
            </Table>
        </div>
    );
}
/*static displayName = Counter.name;

constructor(props) {
    super(props);
    this.state = { currentCount: 0 };
    this.incrementCounter = this.incrementCounter.bind(this);
}

incrementCounter() {
    this.setState({
        currentCount: this.state.currentCount + 1
    });
}

render() {
    return (
        <div>
            <h1>Counter</h1>

            <p>This is a simple example of a React component.</p>

            <p aria-live="polite">Current count: <strong>{this.state.currentCount}</strong></p>

            <button className="btn btn-primary" onClick={this.incrementCounter}>Increment</button>
        </div>
    );
}*/