import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { act } from "react";

describe("App", () => {
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

  it("should have sensor list", () => {
    render(<App />);
    const cardGrid = screen.getByTestId("card-grid");
    // 6 by default
    setTimeout(() => {
      screen.debug();
      expect(cardGrid).toBeVisible();
      expect(cardGrid.querySelectorAll(".text-card-foreground")).length(6);
    }, 1000);
  });

  it("should hide inactive sensors when active button is clicked", () => {
    render(<App />);
    const cardGrid = screen.getByTestId("card-grid");
    // 6 by default
    setTimeout(() => {
      act(() => {
        const button = screen.getByText(/active/i);
        expect(cardGrid.querySelectorAll(".text-card-foreground")).length(6);
        fireEvent.click(button);
        expect(cardGrid).toBeVisible();
        expect(cardGrid.querySelectorAll(".text-card-foreground")).length(0);
      });
    }, 1000);
  });

  it("should show all sensors when all button is clicked", () => {
    render(<App />);
    const cardGrid = screen.getByTestId("card-grid");
    // 6 by default
    setTimeout(() => {
      act(() => {
        const button = screen.getByText(/active/i);
        expect(cardGrid.querySelectorAll(".text-card-foreground")).length(6);
        fireEvent.click(button);
        expect(cardGrid).toBeVisible();
        expect(cardGrid.querySelectorAll(".text-card-foreground")).length(0);
        fireEvent.click(screen.getByText(/all/i));
        expect(cardGrid.querySelectorAll(".text-card-foreground")).length(6);
      });
    }, 1000);
  });
});
