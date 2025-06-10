import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Counter, UserForm } from "../../examples/react-component";

jest.mock("../../src/config/index.js");

beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Counter", () => {
  it("should render with initial value", () => {
    const onCountChange = jest.fn();
    render(<Counter initialValue={5} onCountChange={onCountChange} />);
    expect(screen.getByRole("main")).toHaveTextContent("Counter: 5");
  });

  it("should increment count", () => {
    const onCountChange = jest.fn();
    render(<Counter onCountChange={onCountChange} />);
    fireEvent.click(screen.getByTestId("increment-btn"));
    expect(screen.getByRole("main")).toHaveTextContent("Counter: 1");
    expect(onCountChange).toHaveBeenCalledWith(1);
  });

  it("should decrement count", () => {
    const onCountChange = jest.fn();
    render(<Counter onCountChange={onCountChange} />);
    fireEvent.click(screen.getByTestId("decrement-btn"));
    expect(screen.getByRole("main")).toHaveTextContent("Counter: -1");
    expect(onCountChange).toHaveBeenCalledWith(-1);
  });

  it("should reset count", () => {
    const onCountChange = jest.fn();
    render(<Counter initialValue={5} onCountChange={onCountChange} />);
    fireEvent.click(screen.getByTestId("increment-btn"));
    fireEvent.click(screen.getByTestId("reset-btn"));
    expect(screen.getByRole("main")).toHaveTextContent("Counter: 5");
    expect(onCountChange).toHaveBeenCalledWith(5);
  });
});

describe("UserForm", () => {
  it("should render form", () => {
    const onSubmit = jest.fn();
    render(<UserForm onSubmit={onSubmit} />);
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("should handle input changes", () => {
    const onSubmit = jest.fn();
    render(<UserForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Age:"), {
      target: { value: "30" },
    });
    expect(screen.getByLabelText("Name:").value).toBe("Test User");
    expect(screen.getByLabelText("Email:").value).toBe("test@example.com");
    expect(screen.getByLabelText("Age:").value).toBe("30");
  });

  it("should submit form with valid data", () => {
    const onSubmit = jest.fn();
    render(<UserForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });
    fireEvent.submit(screen.getByRole("form"));
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      age: "",
    });
  });

  it("should prevent submission with invalid data", () => {
    const onSubmit = jest.fn();
    render(<UserForm onSubmit={onSubmit} />);
    fireEvent.submit(screen.getByRole("form"));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith("Name and email are required");
  });
});
