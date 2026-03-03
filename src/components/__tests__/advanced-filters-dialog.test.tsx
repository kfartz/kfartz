import { GlobalRegistrator } from "@happy-dom/global-registrator";

if (!global.window) {
  GlobalRegistrator.register();
}

import { beforeEach, describe, expect, it, mock } from "bun:test";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdvancedFiltersDialog } from "../advanced-filters-dialog";

describe("AdvancedFiltersDialog", () => {
  beforeEach(() => {
    if (document.body) {
      document.body.innerHTML = "";
    }
  });

  it("should not render when open is false", () => {
    const { queryByText } = render(
      <AdvancedFiltersDialog open={false} onOpenChange={() => {}} />,
    );
    expect(queryByText("Advanced Filters")).not.toBeInTheDocument();
  });

  it("should render when open is true", () => {
    const { getByText, getByRole } = render(
      <AdvancedFiltersDialog open={true} onOpenChange={() => {}} />,
    );

    expect(getByText("Advanced Filters")).toBeInTheDocument();
    expect(
      getByText("Configure detailed filters for your table data"),
    ).toBeInTheDocument();

    // Check for standard buttons
    expect(getByRole("button", { name: /\+ Add Filter/i })).toBeInTheDocument();
    expect(getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(getByRole("button", { name: /Apply Filters/i })).toBeInTheDocument();
  });

  it("should call onOpenChange with false when cancel is clicked", async () => {
    const onOpenChangeMock = mock();
    const { getByRole } = render(
      <AdvancedFiltersDialog open={true} onOpenChange={onOpenChangeMock} />,
    );

    const cancelBtn = getByRole("button", { name: /Cancel/i });
    await userEvent.click(cancelBtn);

    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

  it("should call onOpenChange with false when apply is clicked", async () => {
    const onOpenChangeMock = mock();
    const { getByRole } = render(
      <AdvancedFiltersDialog open={true} onOpenChange={onOpenChangeMock} />,
    );

    const applyBtn = getByRole("button", { name: /Apply Filters/i });
    await userEvent.click(applyBtn);

    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });
});
