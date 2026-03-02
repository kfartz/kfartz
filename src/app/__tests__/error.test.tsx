import { GlobalRegistrator } from "@happy-dom/global-registrator";

if (!global.window) {
  GlobalRegistrator.register();
}

import { beforeEach, describe, expect, it, mock } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import RootError from "../error";

describe("RootError", () => {
  beforeEach(() => {
    if (document.body) {
      document.body.innerHTML = "";
    }
  });

  it("should render the error message", () => {
    const error = new Error("Something broke");
    const reset = mock();

    const { getByText } = render(<RootError error={error} reset={reset} />);

    expect(getByText("Something went wrong")).toBeInTheDocument();
    expect(getByText("Something broke")).toBeInTheDocument();
  });

  it("should render a Try again button", () => {
    const error = new Error("test");
    const reset = mock();

    const { getByText } = render(<RootError error={error} reset={reset} />);

    expect(getByText("Try again")).toBeInTheDocument();
  });

  it("should call reset when Try again is clicked", () => {
    const error = new Error("test");
    const reset = mock();

    const { getByText } = render(<RootError error={error} reset={reset} />);

    fireEvent.click(getByText("Try again"));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
