import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import "./App.css";
import SensorCard from "./components/SensorCard";
import { Button } from "./components/ui/button";
import { Sensor } from "./types/sensor";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
type SensorState = Sensor & { hidden: boolean };
type SensorsList = Record<Sensor["id"], SensorState>;

function App() {
  const [sensors, setSensors] = useState<SensorsList>({});
  const [hiddenCount, setHiddenCount] = useState<number>(0);
  const [activeView, setActiveView] = useState<boolean>(false);
  const { sendMessage, lastMessage } = useWebSocket<Sensor>(WEBSOCKET_URL, {
    onOpen: () => console.log("WebSocket connection opened!"),
    onClose: () => console.log("WebSocket connection closed!"),
    onError: (event) => console.error("WebSocket error:", event),
  });

  function showAll() {
    setSensors((prev) => {
      const newSensors: SensorsList = structuredClone(prev);
      Object.keys(newSensors).forEach((key: string) => {
        newSensors[key].hidden = false;
      });
      return newSensors;
    });
    setHiddenCount(0);
  }

  function toggleActiveView() {
    showAll();
    setActiveView((prev) => !prev);
  }

  useEffect(() => {
    if (!lastMessage) return;
    setSensors((prev: SensorsList) => {
      const newSensors: SensorsList = {};
      Object.keys(prev).forEach((key) => {
        newSensors[key] = prev[key];
      });
      const newSensor = JSON.parse(lastMessage.data) as Sensor;
      newSensors[newSensor.id] = {
        ...newSensor,
        hidden: prev[newSensor.id] ? prev[newSensor.id].hidden : false,
      };
      return newSensors;
    });
  }, [lastMessage]);

  function toggleVisibility(id: string) {
    setSensors((prev) => {
      const newSensors: SensorsList = structuredClone(prev);
      newSensors[id].hidden = !newSensors[id].hidden;
      if (newSensors[id].hidden) {
        setHiddenCount((prev) => prev + 1);
      } else {
        setHiddenCount((prev) => prev - 1);
      }
      return newSensors;
    });
  }

  return (
    <div className="mx-auto max-w-[90rem] flex flex-col gap-5 p-5">
      <div className="flex md:flex-row gap-3">
        <h1 className="text-primary text-2xl font-semibold grow">Sensors</h1>
        {hiddenCount > 0 && (
          <Button
            variant="default"
            className="rounded-full w-auto grow-0"
            onClick={showAll}
          >
            Show {hiddenCount} hidden item{hiddenCount > 1 && "s"}
          </Button>
        )}
        <Button
          variant="default"
          className="rounded-full w-auto grow-0"
          onClick={toggleActiveView}
        >
          {activeView ? "All" : "Active"}
        </Button>
      </div>
      <div className="grid-cols-2 sm:grid-cols-3 md:grid-cols-3 grid gap-3 ">
        {Object.values(sensors).map((sensor) => (
          <SensorCard
            key={sensor.id}
            {...sensor}
            sendMessage={sendMessage}
            toggleVisibility={toggleVisibility}
            activeVisibility={activeView}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
