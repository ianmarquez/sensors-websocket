import { SensorCardProps } from "@/components/SensorCard";

export const SensorData: SensorCardProps = {
  id: "0",
  name: "Temperature",
  connected: false,
  unit: "C",
  value: "0",
  hidden: false,
  sendMessage: () => {
    console.log("sending message");
  },
  activeVisibility: false,
  toggleVisibility: (id) => console.log(id),
};
