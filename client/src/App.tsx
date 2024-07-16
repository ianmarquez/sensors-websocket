import { useState } from "react";
import useWebSocket from "react-use-websocket";
import "./App.css";
import { Sensor } from "./types/sensor";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

function App() {
  const [messageHistory, setMessageHistory] = useState<Sensor[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket<Sensor>(
    WEBSOCKET_URL,
    {
      onOpen: () => console.log("WebSocket connection opened!"),
      onClose: () => console.log("WebSocket connection closed!"),
      onError: (event) => console.error("WebSocket error:", event),
      onMessage,
    },
  );

  function onMessage(event: MessageEvent<string>) {
    try {
      const messageData: Sensor = JSON.parse(event.data);
      setMessageHistory((prev) => prev.concat(messageData));
    } catch (err) {
      console.error("Event data is not expected format:", event.data);
    }
  }

  return (
    <>
      <h1 className="text-2xl">{WEBSOCKET_URL}</h1>
    </>
  );
}

export default App;
