import { GlobalRegistrator } from "@happy-dom/global-registrator";

if (!global.window) {
  GlobalRegistrator.register();
}

import { beforeEach, describe, expect, it, mock } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableSwitcherDialog } from "../table-switcher-dialog";

// Mock next/navigation
const mockPush = mock();

mock.module("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockTables = {
  crystals: {
    desc: "Crystal data and properties",
    columns: [],
  },
  measurements: {
    desc: "Measurement records",
    columns: [],
  },
  publications: {
    desc: "Published papers and articles",
    columns: [],
  },
} as never;

const currentTable = {
  name: "crystals",
  desc: "Crystal data and properties",
} as never;

describe("TableSwitcherDialog", () => {
  beforeEach(() => {
    mock.restore();
    mockPush.mockClear();
    if (document.body) {
      document.body.innerHTML = "";
    }
  });

  it("should open on cmd+k", async () => {
    const { queryByText, getByText } = render(
      <TableSwitcherDialog tables={mockTables} currentTable={currentTable} />,
    );

    expect(queryByText("Table picker")).not.toBeInTheDocument();

    // Trigger cmd+k
    fireEvent.keyDown(window, { key: "k", metaKey: true });

    expect(getByText("Table picker")).toBeInTheDocument();
    expect(getByText("measurements")).toBeInTheDocument();
    expect(getByText("publications")).toBeInTheDocument();
  });

  it("should filter tables by search input", async () => {
    const { getByText, queryByText, getByPlaceholderText } = render(
      <TableSwitcherDialog tables={mockTables} currentTable={currentTable} />,
    );

    // Open dialog
    fireEvent.keyDown(window, { key: "k", metaKey: true });

    const searchInput = getByPlaceholderText("Search tables...");
    await userEvent.type(searchInput, "pub");

    expect(getByText("publications")).toBeInTheDocument();
    expect(queryByText("measurements")).not.toBeInTheDocument();
  });

  it("should navigate to selected table on click", async () => {
    const { getByText } = render(
      <TableSwitcherDialog tables={mockTables} currentTable={currentTable} />,
    );

    fireEvent.keyDown(window, { key: "k", metaKey: true });

    const publicationsBtn = getByText("publications");
    await userEvent.click(publicationsBtn);

    expect(mockPush).toHaveBeenCalledWith("/publications");
  });

  it("should navigate using keyboard", async () => {
    render(
      <TableSwitcherDialog tables={mockTables} currentTable={currentTable} />,
    );

    fireEvent.keyDown(window, { key: "k", metaKey: true });

    // measurements should be selected by default (index 1 in array, first non-current)

    // Press down arrow
    fireEvent.keyDown(window, { key: "ArrowDown" });

    // Press Enter to select publications (index 2)
    fireEvent.keyDown(window, { key: "Enter" });

    expect(mockPush).toHaveBeenCalledWith("/publications");
  });

  it("should handle keyboard navigation edge cases", async () => {
    const mockTablesWithMore = {
      ...mockTables,
      table4: { desc: "Table 4", columns: [] },
    } as never;

    // Current table is measurements (index 1 in the list of crystals, measurements, publications, table4)
    const currentTableMid = {
      name: "measurements",
      desc: "Measurement records",
    } as never;

    render(
      <TableSwitcherDialog
        tables={mockTablesWithMore}
        currentTable={currentTableMid}
      />,
    );

    fireEvent.keyDown(window, { key: "k", metaKey: true });

    // Currently selected is 'crystals' (index 0)
    // Down arrow -> skips 'measurements' (index 1), lands on 'publications' (index 2)
    fireEvent.keyDown(window, { key: "ArrowDown" });
    fireEvent.keyDown(window, { key: "Enter" });
    expect(mockPush).toHaveBeenCalledWith("/publications");

    // Open again
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyDown(window, { key: "k", metaKey: true });

    // Up arrow from 'crystals' (index 0) -> shouldn't go below 0
    fireEvent.keyDown(window, { key: "ArrowUp" });
    fireEvent.keyDown(window, { key: "Enter" });
    expect(mockPush).toHaveBeenCalledWith("/crystals");

    // Open again
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyDown(window, { key: "k", metaKey: true });

    // Move to publications (index 2)
    fireEvent.keyDown(window, { key: "ArrowDown" });
    // Move up -> skips 'measurements' (index 1), lands on 'crystals' (index 0)
    fireEvent.keyDown(window, { key: "ArrowUp" });
    fireEvent.keyDown(window, { key: "Enter" });
    expect(mockPush).toHaveBeenCalledWith("/crystals");

    // Open again
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyDown(window, { key: "k", metaKey: true });

    // Move down to table4 (index 3)
    fireEvent.keyDown(window, { key: "ArrowDown" }); // 0 -> 2
    fireEvent.keyDown(window, { key: "ArrowDown" }); // 2 -> 3

    // Normal ArrowUp, no skipping (3 -> 2)
    fireEvent.keyDown(window, { key: "ArrowUp" });
    fireEvent.keyDown(window, { key: "Enter" });
    expect(mockPush).toHaveBeenCalledWith("/publications");

    // Open again
    fireEvent.keyDown(window, { key: "Escape" });
    fireEvent.keyDown(window, { key: "k", metaKey: true });

    fireEvent.keyDown(window, { key: "ArrowDown" }); // 0 -> 2
    fireEvent.keyDown(window, { key: "ArrowDown" }); // 2 -> 3

    // Move down again -> shouldn't go past end
    fireEvent.keyDown(window, { key: "ArrowDown" });
    fireEvent.keyDown(window, { key: "Enter" });
    expect(mockPush).toHaveBeenCalledWith("/table4");
  });

  it("should handle current table at the very end during navigation", async () => {
    // Test where currentTable is the last item
    const currentTableLast = {
      name: "publications",
      desc: "Published papers and articles",
    } as never;

    render(
      <TableSwitcherDialog
        tables={mockTables}
        currentTable={currentTableLast}
      />,
    );

    fireEvent.keyDown(window, { key: "k", metaKey: true });

    // Initially selects 'crystals' (index 0)
    fireEvent.keyDown(window, { key: "ArrowDown" }); // 'measurements' (index 1)
    fireEvent.keyDown(window, { key: "ArrowDown" }); // tries to skip 'publications' (index 2) but hits end
    fireEvent.keyDown(window, { key: "Enter" });
    expect(mockPush).toHaveBeenCalledWith("/measurements");
  });

  it("should handle current table at the very beginning during navigation", async () => {
    // Current table is the first item
    const currentTableFirst = {
      name: "crystals",
      desc: "Crystal data and properties",
    } as never;

    render(
      <TableSwitcherDialog
        tables={mockTables}
        currentTable={currentTableFirst}
      />,
    );

    fireEvent.keyDown(window, { key: "k", metaKey: true });

    // Initially selects 'measurements' (index 1)
    fireEvent.keyDown(window, { key: "ArrowUp" }); // tries to skip 'crystals' (index 0) but hits beginning
    fireEvent.keyDown(window, { key: "Enter" });
    expect(mockPush).toHaveBeenCalledWith("/measurements");
  });
});
