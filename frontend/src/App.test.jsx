
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";

import {
  render,
  screen,
  cleanup,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import axios from "axios";
import App from "./App";

vi.mock("axios");

afterEach(() => {
  cleanup();
});

describe("Employee Management Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    axios.get.mockResolvedValue({
      data: {
        content: [
          {
            id: 1,
            fullName: "Test Employee",
            email: "test@example.com",
            phoneNumber: "9876543210",
            department: "Engineering",
            designation: "Developer",
            dateOfJoining: "2025-01-15",
            salary: 40000,
            employmentStatus: "ACTIVE",
          },
        ],
        totalPages: 1,
        totalElements: 1,
      },
    });
  });

  it("displays employees returned by the API", async () => {
    render(<App />);

    expect(
      await screen.findByText("Test Employee")
    ).toBeInTheDocument();

    expect(screen.getAllByText("Engineering").length).toBe(2);
    expect(screen.getByText("Developer")).toBeInTheDocument();
  });

  it("filters employees by search text", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByText("Test Employee");

    const searchBox = screen.getByRole("textbox", {
      name: "Search employees",
    });

    await user.type(searchBox, "Nobody");

    expect(
      screen.queryByText("Test Employee")
    ).not.toBeInTheDocument();
  });
});
