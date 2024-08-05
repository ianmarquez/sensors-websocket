import SensorCard from "@/components/SensorCard";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SensorData } from "../mockData/SensorCard.data";

describe("SensorCard", () => {
  it("Should render card with the correct data", () => {
    render(<SensorCard {...SensorData} />);
    const heading = screen.getByText(SensorData.name);
    const toggle = screen.getByRole("switch");
    const toggleValue = screen.getByTestId("switch");
    const sensorValue = screen.getByTestId("sensor-value");
    const button = screen.getByText(/hide/i);

    expect(heading).toBeVisible();
    expect(toggle).toBeVisible();
    expect(toggleValue).toHaveAttribute("data-state");
    expect(toggleValue.getAttribute("data-state")).toBe("unchecked");
    expect(sensorValue).toBeInTheDocument();
    expect(sensorValue).toHaveTextContent(SensorData.value);
    expect(sensorValue).toHaveTextContent(SensorData.unit);
    expect(button).toBeInTheDocument();
  });

  it("Should not render card when data is hidden", () => {
    const data = { ...SensorData };
    data.hidden = true;
    const { container } = render(<SensorCard {...data} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("Should hide the card when hide button is clicked", () => {
    const data = { ...SensorData };
    data.toggleVisibility = () => {
      data.hidden = !data.hidden;
    };
    const { container, rerender } = render(<SensorCard {...data} />);
    expect(container).not.toBeEmptyDOMElement();
    fireEvent.click(screen.getByText(/hide/i));
    rerender(<SensorCard {...data} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("Should be hidden when active visibility flag is true and is sensor is not connected.", () => {
    const data = { ...SensorData };
    data.activeVisibility = true;
    const { container } = render(<SensorCard {...data} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("Should be visible when active visibility flag is true and is sensor is connected.", () => {
    const data = { ...SensorData };
    data.connected = true;
    data.activeVisibility = true;
    const { container } = render(<SensorCard {...data} />);
    expect(container).not.toBeEmptyDOMElement();
  });

  it("Should toggle status when switch button is clicked", () => {
    const data = { ...SensorData };
    const { rerender } = render(<SensorCard {...data} />);
    const toggleValue = screen.getByTestId("switch");
    data.connected = true;
    rerender(<SensorCard {...data} />);
    expect(toggleValue).toHaveAttribute("data-state");
    expect(toggleValue.getAttribute("data-state")).toBe("checked");
    data.connected = false;
    rerender(<SensorCard {...data} />);
    expect(toggleValue.getAttribute("data-state")).toBe("unchecked");
  });
});
