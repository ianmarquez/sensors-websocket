import clsx from "clsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { connectSensor, disconnectSensor } from "@/services/sensors";
import { SendMessage } from "react-use-websocket";
import { Button } from "./ui/button";

export interface SensorCardProps {
  id: string;
  name: string;
  connected: boolean;
  unit: string;
  value: string;
  hidden: boolean;
  sendMessage: SendMessage;
  toggleVisibility: (id: string) => void;
  activeVisibility: boolean;
}

export default function SensorCard(props: SensorCardProps) {
  const {
    id,
    name,
    connected,
    value,
    unit,
    sendMessage,
    toggleVisibility,
    hidden,
    activeVisibility,
  } = props;

  const toggleStatus = (value: boolean) => {
    if (!value) {
      return disconnectSensor(id, sendMessage);
    }
    return connectSensor(id, sendMessage);
  };

  if (activeVisibility) {
    if (!connected) {
      return;
    }
  } else if (hidden) return;

  return (
    <Card className="flex flex-col gap-5 p-2">
      <CardHeader className="flex flex-row gap-3 ">
        <CardTitle className="grow text-xl font-semibold">{name}</CardTitle>
        <CardDescription>
          <Switch
            checked={connected}
            onCheckedChange={toggleStatus}
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-zinc-50"
          />
        </CardDescription>
      </CardHeader>
      <CardContent
        className={clsx(
          "text-5xl text-center flex gap-2 justify-center items-center",
          connected ? "text-green-500" : "text-zinc-500",
        )}
        data-testid="sensor-value"
      >
        {value ? parseFloat(value).toFixed(2) : 0}
        <span className="text-xl">{unit}</span>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          data-testid="hide-btn"
          variant="destructive"
          className="w-full uppercase rounded-full py-6 px-4 "
          onClick={() => toggleVisibility(id)}
        >
          Hide
        </Button>
      </CardFooter>
    </Card>
  );
}
