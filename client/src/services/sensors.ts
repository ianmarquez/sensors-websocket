import { SendMessage } from "react-use-websocket";
import { SensorEvents } from "../types/sensor";

export function connectSensor(id: string, sendMessage: SendMessage): void {
  return sendMessage(JSON.stringify({ command: SensorEvents.CONNECT, id }));
}

export function disconnectSensor(id: string, sendMessage: SendMessage): void {
  return sendMessage(JSON.stringify({ command: SensorEvents.DISCONNECT, id }));
}
