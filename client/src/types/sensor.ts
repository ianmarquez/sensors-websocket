export type Sensor = {
  id: string;
  name: string;
  connected: boolean;
  unit: string;
  value: string;
};

export const SensorEvents = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
} as const;
