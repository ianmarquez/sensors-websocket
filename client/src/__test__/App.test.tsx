import App from "@/App";
import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, describe, expect, it, beforeEach } from "vitest";
import WS from "vitest-websocket-mock";
import { Sensors } from "./mockData/App.data";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

let server: WS;
describe("App", () => {
  beforeEach(() => {
    server = new WS(WEBSOCKET_URL);
  });
  afterEach(() => {
    WS.clean();
  });

  it("should have a header", () => {
    render(<App />);
    const header = screen.getByText(/sensors/i);
    expect(header).toBeVisible();
  });

  it("should have an active button", () => {
    render(<App />);
    const button = screen.getByText(/active/i);
    expect(button).toBeVisible();
  });

  it("should have sensor list", async () => {
    render(<App />);

    await server.connected;
    act(() => {
      for (const sensor of Sensors) {
        server.send(sensor);
      }
    });
    const cardGrid = screen.getByTestId("card-grid");
    expect(cardGrid).toBeVisible();
    expect(screen.getAllByTestId("sensor-card")).length(Sensors.length);
  });

  it("should hide inactive sensors when active button is clicked", async () => {
    render(<App />);

    await server.connected;
    act(() => {
      for (const sensor of Sensors) {
        server.send(sensor);
      }
    });

    const cardGrid = screen.getByTestId("card-grid");
    expect(screen.getAllByTestId("sensor-card")).length(Sensors.length);

    act(() => {
      const button = screen.getByText(/active/i);
      fireEvent.click(button);
    });
    expect(cardGrid).toBeVisible();
    expect(cardGrid).toBeEmptyDOMElement();
  });

  it("should show all sensors when all button is clicked", async () => {
    render(<App />);
    await server.connected;
    act(() => {
      for (const sensor of Sensors) {
        server.send(sensor);
      }
    });

    const cardGrid = screen.getByTestId("card-grid");
    expect(screen.getAllByTestId("sensor-card")).length(Sensors.length);
    act(() => {
      const button = screen.getByText(/active/i);
      fireEvent.click(button);
    });
    expect(cardGrid).toBeEmptyDOMElement();

    act(() => {
      fireEvent.click(screen.getByText(/all/i));
    });
    expect(screen.getAllByTestId("sensor-card")).length(Sensors.length);
    expect(cardGrid).toBeVisible();
  });
});
