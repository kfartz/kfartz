import { GlobalRegistrator } from "@happy-dom/global-registrator";

if (!global.window) {
  GlobalRegistrator.register();
}

import { beforeEach, describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import { ResizableTable } from "../resizable-table";

describe("ResizableTable", () => {
  beforeEach(() => {
    if (document.body) {
      document.body.innerHTML = "";
    }
  });

  it("should render a table with provided docs", () => {
    const mockQuery = {
      docs: [
        { id: "1", name: "Crystal A", property: { size: 10 } },
        { id: "2", name: "Crystal B", property: { size: 20 } },
      ],
      totalDocs: 2,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };

    const { getByText, getAllByRole } = render(
      <ResizableTable name="crystals" query={mockQuery as never} />,
    );

    // Headers (skipping 'id' based on the component logic)
    expect(getByText("name")).toBeInTheDocument();
    expect(getByText("property.size")).toBeInTheDocument();

    // Data rows
    expect(getByText("Crystal A")).toBeInTheDocument();
    expect(getByText("10")).toBeInTheDocument();
    expect(getByText("Crystal B")).toBeInTheDocument();
    expect(getByText("20")).toBeInTheDocument();

    // Should render 2 data rows + 1 header row = 3 rows
    const rows = getAllByRole("row");
    expect(rows.length).toBe(3);
  });

  it("should render array values correctly", () => {
    const mockQuery = {
      docs: [
        {
          id: "1",
          name: "Crystal A",
          refinements: [
            { id: 1, refinement: { name: "Ref 1" } },
            { id: 2, refinement: { name: "Ref 2" } },
          ],
        },
      ],
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };

    const { getByText } = render(
      <ResizableTable name="crystals" query={mockQuery as never} />,
    );

    // Assuming stringified output of array mapped names: ["Ref 1","Ref 2"]
    expect(getByText('["Ref 1","Ref 2"]')).toBeInTheDocument();
  });

  it("should render null cells for falsy values", () => {
    const mockQuery = {
      docs: [{ id: "1", name: null, property: { size: 0 } }],
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };

    const { getAllByText } = render(
      <ResizableTable name="crystals" query={mockQuery as never} />,
    );

    // null value renders "null" string, and 0 (falsy) also renders "null"
    const nullCells = getAllByText("null");
    expect(nullCells.length).toBeGreaterThan(0);
  });

  it("should render non-array, non-null primitive values via String()", () => {
    const mockQuery = {
      docs: [{ id: "1", count: 42, active: true }],
      totalDocs: 1,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };

    const { getByText } = render(
      <ResizableTable name="crystals" query={mockQuery as never} />,
    );

    expect(getByText("42")).toBeInTheDocument();
    expect(getByText("true")).toBeInTheDocument();
  });

  it("should display 'No data found' when docs array is empty", () => {
    const mockQuery = {
      docs: [],
      totalDocs: 0,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };

    const { getByText } = render(
      <ResizableTable name="crystals" query={mockQuery as never} />,
    );

    expect(getByText("No data found")).toBeInTheDocument();
  });

  it("should render an empty table when docs are empty", () => {
    const mockQuery = {
      docs: [],
      totalDocs: 0,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };

    const { queryByRole } = render(
      <ResizableTable name="crystals" query={mockQuery as never} />,
    );

    // With no docs, dataKeys is empty, so columns are empty
    // The table might just render empty headers or no columns at all.
    // Let's verify it doesn't crash and renders table structural elements
    expect(queryByRole("table")).toBeInTheDocument();
  });
});
