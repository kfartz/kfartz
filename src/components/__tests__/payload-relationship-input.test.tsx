import { GlobalRegistrator } from "@happy-dom/global-registrator";

if (!global.window) {
  GlobalRegistrator.register();
}

import { afterEach, beforeEach, describe, expect, jest, test } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PayloadRelationshipInput } from "../payload-relationship-input";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe("PayloadRelationshipInput", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
    global.fetch = jest.fn() as unknown as typeof fetch;
    // mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders closed combobox with placeholder", () => {
    const { getByRole, getByText } = renderWithClient(
      <PayloadRelationshipInput
        relationTo="users"
        value={null}
        onChange={mockOnChange}
        placeholder="Select a user"
      />,
    );

    expect(getByRole("combobox")).toBeInTheDocument();
    expect(getByText("Select a user")).toBeInTheDocument();
  });

  test("fetches and displays options when opened", async () => {
    const mockData = {
      docs: [
        { id: "1", name: "User One", createdAt: "2023-01-01T00:00:00.000Z" },
        { id: "2", name: "User Two", createdAt: "2023-01-02T00:00:00.000Z" },
      ],
    };

    (
      global.fetch as unknown as ReturnType<typeof jest.fn>
    ).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { getByRole, findByText, getByText } = renderWithClient(
      <PayloadRelationshipInput
        relationTo="users"
        value={null}
        onChange={mockOnChange}
      />,
    );

    const combobox = getByRole("combobox");
    await userEvent.click(combobox);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/users?limit=10&select[name]=true&select[createdAt]=true",
      );
    });

    expect(await findByText("User One")).toBeInTheDocument();
    expect(getByText("User Two")).toBeInTheDocument();
  });

  test("displays empty state when no results", async () => {
    (
      global.fetch as unknown as ReturnType<typeof jest.fn>
    ).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: [] }),
    });

    const { getByRole, findByText } = renderWithClient(
      <PayloadRelationshipInput
        relationTo="users"
        value={null}
        onChange={mockOnChange}
      />,
    );

    await userEvent.click(getByRole("combobox"));

    expect(await findByText("No results found.")).toBeInTheDocument();
  });

  test("handles fetch error gracefully", async () => {
    (
      global.fetch as unknown as ReturnType<typeof jest.fn>
    ).mockResolvedValueOnce({
      ok: false,
    });

    const { getByRole, findByText } = renderWithClient(
      <PayloadRelationshipInput
        relationTo="users"
        value={null}
        onChange={mockOnChange}
      />,
    );

    await userEvent.click(getByRole("combobox"));

    // the query will fail, meaning data is undefined, docs is empty array, should show "No results found."
    expect(await findByText("No results found.")).toBeInTheDocument();
  });

  test("selects an option and calls onChange", async () => {
    const mockData = {
      docs: [
        { id: "1", name: "User One", createdAt: "2023-01-01T00:00:00.000Z" },
      ],
    };

    (
      global.fetch as unknown as ReturnType<typeof jest.fn>
    ).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { getByRole, findByText } = renderWithClient(
      <PayloadRelationshipInput
        relationTo="users"
        value={null}
        onChange={mockOnChange}
      />,
    );

    await userEvent.click(getByRole("combobox"));

    const option = await findByText("User One");
    await userEvent.click(option);

    expect(mockOnChange).toHaveBeenCalledWith("1");
  });

  test("displays selected value label", async () => {
    const mockData = {
      docs: [
        { id: "1", name: "User One", createdAt: "2023-01-01T00:00:00.000Z" },
      ],
    };

    // We need to fetch data so the component can resolve the name from the ID
    (
      global.fetch as unknown as ReturnType<typeof jest.fn>
    ).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { getByText, getByRole, getAllByText } = renderWithClient(
      <PayloadRelationshipInput
        relationTo="users"
        value="1"
        onChange={mockOnChange}
      />,
    );

    // Initial render without docs will just show the ID
    expect(getByText("1")).toBeInTheDocument();

    // Open it to trigger the fetch
    await userEvent.click(getByRole("combobox"));

    // Once fetched, it should find the name and update the combobox label
    await waitFor(() => {
      // Combobox content + the list item
      const userOneElements = getAllByText("User One");
      expect(userOneElements.length).toBeGreaterThan(0);
    });
  });

  test("searches when typing in input", async () => {
    (global.fetch as unknown as ReturnType<typeof jest.fn>)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ docs: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          docs: [{ id: "3", name: "Search Result", createdAt: "2023-01-01" }],
        }),
      });

    const { getByRole, getByPlaceholderText } = renderWithClient(
      <PayloadRelationshipInput
        relationTo="users"
        value={null}
        onChange={mockOnChange}
      />,
    );

    await userEvent.click(getByRole("combobox"));

    const searchInput = getByPlaceholderText("Search...");
    await userEvent.type(searchInput, "test");

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("&where[name][contains]=test"),
      );
    });
  });
});
