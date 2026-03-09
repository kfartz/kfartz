import { GlobalRegistrator } from "@happy-dom/global-registrator";

if (!global.window) {
  GlobalRegistrator.register();
}

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InsertForm, { type SerializedField } from "../insert-form";

// Mock next/navigation
const mockBack = mock();
const mockPush = mock();

mock.module("next/navigation", () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
  }),
}));

const mockFields: SerializedField[] = [
  {
    name: "title",
    type: "text",
    required: true,
  },
  {
    name: "description",
    type: "textarea",
  },
  {
    name: "user",
    type: "relationship",
    relationTo: "users",
  },
  {
    name: "status",
    type: "select",
    options: ["active", "inactive", { label: "Pending", value: "pending" }],
  },
  {
    name: "isVerified",
    type: "checkbox",
  },
  {
    name: "count",
    type: "number",
    min: 0,
    max: 10,
  },
  {
    name: "birthDate",
    type: "date",
  },
  {
    name: "hiddenField",
    type: "hidden",
  },
  {
    name: "groupField",
    type: "group",
    fields: [
      {
        name: "subField",
        type: "text",
      },
      {
        name: "measurement",
        type: "number",
      },
      {
        name: "uncertainty",
        type: "number",
      },
    ],
  },
  {
    name: "arrayField",
    type: "array",
    fields: [
      {
        name: "refinement",
        type: "relationship",
        relationTo: "refinements",
      },
    ],
  },
];

const mockMeasurementsFields: SerializedField[] = [
  {
    name: "experiment_type",
    type: "text",
  },
  {
    name: "pressure",
    type: "number",
  },
];

describe("InsertForm", () => {
  beforeEach(() => {
    mock.restore();
    mockBack.mockClear();
    mockPush.mockClear();
    if (document.body) {
      document.body.innerHTML = "";
    }
    // Mock scrollIntoView needed by some components
    window.HTMLElement.prototype.scrollIntoView = mock();
    window.HTMLElement.prototype.hasPointerCapture =
      mock().mockReturnValue(false);
    window.HTMLElement.prototype.releasePointerCapture = mock();
  });

  afterEach(() => {
    global.fetch = undefined as unknown as typeof fetch;
  });

  it("should render fields based on props", () => {
    const { getByLabelText, getByText, queryByLabelText } = render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={mockFields} />
      </QueryClientProvider>,
    );

    expect(getByLabelText(/title/i)).toBeInTheDocument();
    expect(getByLabelText(/description/i)).toBeInTheDocument();
    expect(getByLabelText(/isVerified/i)).toBeInTheDocument();
    expect(getByLabelText(/count/i)).toBeInTheDocument();
    expect(getByLabelText(/birthDate/i)).toBeInTheDocument();
    expect(getByText(/groupField/i)).toBeInTheDocument();
    expect(getByText(/arrayField/i)).toBeInTheDocument();
    expect(getByText(/Insert Record/i)).toBeInTheDocument();
    expect(queryByLabelText(/hiddenField/i)).not.toBeInTheDocument();
  });

  it("should submit form data and push to table slug", async () => {
    global.fetch = mock().mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ doc: { id: "123" } }),
    });

    const alertSpy = spyOn(window, "alert").mockImplementation(() => {});

    const { getByLabelText } = render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={mockFields} />
      </QueryClientProvider>,
    );

    const titleInput = getByLabelText(/title/i);
    await userEvent.type(titleInput, "New Crystal");

    const form = document.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      const fetchArgs = (global.fetch as ReturnType<typeof mock>).mock.calls[0];
      expect(fetchArgs[0]).toBe("/api/crystals");
      expect(fetchArgs[1].method).toBe("POST");

      // Should redirect back to the table view
      expect(mockPush).toHaveBeenCalledWith("/crystals");
      expect(alertSpy).toHaveBeenCalledWith("Successfully created!");
    });
  });

  it("should show alert on error", async () => {
    const alertSpy = spyOn(window, "alert").mockImplementation(() => {});

    global.fetch = mock().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ errors: ["Bad Request"] }),
    });

    const { getByLabelText } = render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={mockFields} />
      </QueryClientProvider>,
    );

    const titleInput = getByLabelText(/title/i);
    await userEvent.type(titleInput, "New Crystal");

    const form = document.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error: ["Bad Request"]');
    });
  });

  it("should handle error catch block", async () => {
    const consoleErrorSpy = spyOn(console, "error").mockImplementation(
      () => {},
    );

    global.fetch = mock().mockRejectedValue(new Error("Network Error"));

    const { getByLabelText } = render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={mockFields} />
      </QueryClientProvider>,
    );

    const titleInput = getByLabelText(/title/i);
    await userEvent.type(titleInput, "New Crystal");

    const form = document.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  it("should validate required fields", async () => {
    const { getByText } = render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={mockFields} />
      </QueryClientProvider>,
    );

    const form = document.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(getByText("This field is required")).toBeInTheDocument();
    });
  });

  it("should validate conditionally required fields for measurements", async () => {
    const { getByLabelText, getByText } = render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="measurements" fields={mockMeasurementsFields} />
      </QueryClientProvider>,
    );

    const experimentTypeInput = getByLabelText(/experiment_type/i);
    await userEvent.type(experimentTypeInput, "non-ambient");

    const form = document.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(
        getByText("Required for non-ambient experiments"),
      ).toBeInTheDocument();
    });
  });

  it("should interact with various field types", async () => {
    const { getByLabelText, getByText } = render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={mockFields} />
      </QueryClientProvider>,
    );

    // Number
    const countInput = getByLabelText(/count/i);
    await userEvent.type(countInput, "5");
    expect(countInput).toHaveValue(5);

    // Checkbox
    const checkboxInput = getByLabelText(/isVerified/i);
    await userEvent.click(checkboxInput);
    expect(checkboxInput).toHaveAttribute("aria-checked", "true");

    // Date
    const dateInput = getByLabelText(/birthDate/i);
    fireEvent.change(dateInput, { target: { value: "2023-01-01" } });
    expect(dateInput).toHaveValue("2023-01-01");

    // Select
    const statusSelect = document.querySelector("#status") as HTMLElement;
    expect(statusSelect).toBeInTheDocument();
    await userEvent.click(statusSelect);

    // Radix UI renders a hidden select with options AND a portal with custom items
    const pendingOptions = await waitFor(() =>
      getByText("Pending", { selector: "span" }),
    );
    expect(pendingOptions).toBeInTheDocument();
    await userEvent.click(pendingOptions);
  });

  it("should handle array fields (add and remove items)", async () => {
    const { container } = render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={mockFields} />
      </QueryClientProvider>,
    );

    const addButton = container
      .querySelector(".lucide-plus")
      ?.closest("button");
    expect(addButton).toBeInTheDocument();

    if (addButton) {
      await userEvent.click(addButton);
    }

    const minusButton = container
      .querySelector(".lucide-minus")
      ?.closest("button");
    expect(minusButton).toBeInTheDocument();

    if (minusButton) {
      await userEvent.click(minusButton);
    }

    await waitFor(() => {
      expect(container.querySelector(".lucide-minus")).not.toBeInTheDocument();
    });
  });

  it("should handle beforeunload prompt", () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={mockFields} />
      </QueryClientProvider>,
    );

    const confirmSpy = spyOn(window, "confirm").mockReturnValue(false);
    const preventDefaultSpy = mock();

    const event = new Event("beforeunload");
    event.preventDefault = preventDefaultSpy;

    window.dispatchEvent(event);

    expect(confirmSpy).toHaveBeenCalledWith("Discard changes?");
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should upload and parse CIF files", async () => {
    const { getByRole, getByLabelText } = render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={mockFields} />
      </QueryClientProvider>,
    );

    const uploadBtn = getByRole("button", { name: /Load from CIF/i });
    expect(uploadBtn).toBeInTheDocument();

    const file = new File(
      ["title 'Fake Title'\ngroupField 10.5(2)\ncount 42\nisVerified true"],
      "test.cif",
      { type: "text/plain" },
    );
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await userEvent.upload(input, file);

    // Check if the form fields were updated.
    await waitFor(() => {
      const titleInput = getByLabelText(/title/i) as HTMLInputElement;
      expect(titleInput.value).toBe("Fake Title");

      const countInput = getByLabelText(/count/i) as HTMLInputElement;
      expect(countInput.value).toBe("42");
    });
  });

  it("should handle CIF upload with no file selected (early return)", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={mockFields} />
      </QueryClientProvider>,
    );

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    // Fire change with no files — triggers the early return on line 325
    fireEvent.change(input, { target: { files: [] } });

    // The form should still be in its initial state (title empty)
    const titleInput = document.querySelector("#title") as HTMLInputElement;
    expect(titleInput.value).toBe("");
  });

  it("should handle CIF upload setting group field with plain number (no uncertainty)", async () => {
    const { getByLabelText } = render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={mockFields} />
      </QueryClientProvider>,
    );

    // "groupField 42" produces cifValue=42 (a plain number, not {value, uncertainty})
    // This hits the else branch at line 343-344: form.setFieldValue(`${field.name}.measurement`, Number(cifValue))
    const file = new File(["groupField 42"], "plain-group.cif", {
      type: "text/plain",
    });
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await userEvent.upload(input, file);

    await waitFor(() => {
      const measurementInput = getByLabelText(
        /measurement/i,
      ) as HTMLInputElement;
      expect(measurementInput.value).toBe("42");
    });
  });

  it("should render date field with existing value via CIF upload", async () => {
    const { getByLabelText } = render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={mockFields} />
      </QueryClientProvider>,
    );

    // Upload a CIF that sets a date value — this triggers form.setFieldValue
    // which causes a re-render with value truthy, hitting lines 223-224
    const file = new File(["birthDate 2024-06-15"], "dates.cif", {
      type: "text/plain",
    });
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await userEvent.upload(input, file);

    await waitFor(() => {
      const dateInput = getByLabelText(/birthDate/i) as HTMLInputElement;
      expect(dateInput.value).toBe("2024-06-15");
    });
  });

  it("should trigger file input click when CIF button is clicked", async () => {
    const { getByRole } = render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={mockFields} />
      </QueryClientProvider>,
    );

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const clickSpy = spyOn(input, "click");

    const uploadBtn = getByRole("button", { name: /Load from CIF/i });
    await userEvent.click(uploadBtn);

    expect(clickSpy).toHaveBeenCalled();
  });

  it("should filter out ui field type", () => {
    const fieldsWithUi: SerializedField[] = [
      { name: "title", type: "text", required: true },
      { name: "separator", type: "ui" },
    ];

    const { queryByLabelText } = render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={fieldsWithUi} />
      </QueryClientProvider>,
    );

    expect(queryByLabelText(/separator/i)).not.toBeInTheDocument();
  });

  it("should handle CIF setting non-group field with value+uncertainty object", async () => {
    // A non-group number field receiving a CIF value like "10.5(2)" which parses
    // to {value: 10.5, uncertainty: 2} — hits the else branch at line 347-348
    const { getByLabelText } = render(
      <QueryClientProvider client={new QueryClient()}>
        <InsertForm tableSlug="crystals" fields={mockFields} />
      </QueryClientProvider>,
    );

    const file = new File(["count 10.5(2)"], "uncertain.cif", {
      type: "text/plain",
    });
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    await userEvent.upload(input, file);

    await waitFor(() => {
      const countInput = getByLabelText(/count/i) as HTMLInputElement;
      // cifValue is {value: 10.5, uncertainty: 2}, so form gets cifValue.value = 10.5
      expect(countInput.value).toBe("10.5");
    });
  });
});
