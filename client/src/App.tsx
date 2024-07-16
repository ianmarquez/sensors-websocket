import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import "./App.css";
import { Sensor } from "./types/sensor";
import SensorTable from "./components/SensorGrid";
import SensorCard from "./components/SensorCard";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
type SensorsList = Record<Sensor["id"], Sensor>;

function App() {
  const [sensors, setSensors] = useState<SensorsList>({});
  const { sendMessage, lastMessage, readyState } = useWebSocket<Sensor>(
    WEBSOCKET_URL,
    {
      onOpen: () => console.log("WebSocket connection opened!"),
      onClose: () => console.log("WebSocket connection closed!"),
      onError: (event) => console.error("WebSocket error:", event),
    },
  );

  useEffect(() => {
    if (!lastMessage) return;
    setSensors((prev: SensorsList) => {
      const newSensors: SensorsList = {};
      Object.keys(prev).forEach((key) => {
        newSensors[key] = prev[key];
      });
      const newSensor = JSON.parse(lastMessage.data);
      newSensors[newSensor.id] = newSensor;
      return newSensors;
    });
  }, [lastMessage]);

  return (
    <>
      <div className="mx-auto max-w-[90rem] flex flex-col gap-5 justify-center pt-5">
        <h1 className="text-primary text-2xl font-semibold">Sensors</h1>
        <div className="grid-cols-2 sm:grid-cols-3 md:grid-cols-3 grid gap-3 ">
          {Object.values(sensors).map((sensor) => (
            <SensorCard key={sensor.id} {...sensor} sendMessage={sendMessage} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
