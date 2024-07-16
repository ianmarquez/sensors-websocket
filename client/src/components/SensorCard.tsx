import clsx from "clsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { connectSensor, disconnectSensor } from "@/services/sensors";
import { useEffect } from "react";
import { SendMessage } from "react-use-websocket";

interface SensorCardProps {
  id: string;
  name: string;
  connected: boolean;
  unit: string;
  value: string;
  sendMessage: SendMessage;
}

export default function SensorCard(props: SensorCardProps) {
  const { id, name, connected, value, unit, sendMessage } = props;

  const toggleStatus = (value: boolean) => {
    console.log(value);
    if (!value) {
      return disconnectSensor(id, sendMessage);
    }
    return connectSensor(id, sendMessage);
  };

  useEffect(() => {
    console.log(value);
  }, [value]);

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
      >
        {value ? parseFloat(value).toFixed(2) : 0}
        <span className="text-xl">{unit}</span>
      </CardContent>
    </Card>
  );
}
