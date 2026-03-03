import { GlobalRegistrator } from "@happy-dom/global-registrator";

if (!global.window) {
  GlobalRegistrator.register();
}

import { beforeEach, describe, expect, it } from "bun:test";
import { fireEvent, render } from "@testing-library/react";
import { createGenericContext } from "../context";

describe("createGenericContext", () => {
  beforeEach(() => {
    if (document.body) {
      document.body.innerHTML = "";
    }
  });

  it("should provide a value and setter via the Provider", () => {
    const [useCtx, Provider] = createGenericContext<string>();

    function Consumer() {
      const [value] = useCtx();
      return <span>{value}</span>;
    }

    const { getByText } = render(
      <Provider defaultValue="hello">
        <Consumer />
      </Provider>,
    );

    expect(getByText("hello")).toBeInTheDocument();
  });

  it("should update the value when setter is called", () => {
    const [useCtx, Provider] = createGenericContext<string>();

    function Consumer() {
      const [value, setValue] = useCtx();
      return (
        <div>
          <span data-testid="value">{value}</span>
          <button type="button" onClick={() => setValue("updated")}>
            Update
          </button>
        </div>
      );
    }

    const { getByTestId, getByText } = render(
      <Provider defaultValue="initial">
        <Consumer />
      </Provider>,
    );

    expect(getByTestId("value").textContent).toBe("initial");
    fireEvent.click(getByText("Update"));
    expect(getByTestId("value").textContent).toBe("updated");
  });

  it("should throw an error when used outside Provider", () => {
    const [useCtx] = createGenericContext<string>();

    function Consumer() {
      const [value] = useCtx();
      return <span>{value}</span>;
    }

    // Suppress React error boundary console noise
    const originalError = console.error;
    console.error = () => {};

    expect(() => render(<Consumer />)).toThrow(
      "useGenericContext must be used within its Provider",
    );

    console.error = originalError;
  });

  it("should render children passed to Provider", () => {
    const [, Provider] = createGenericContext<number>();

    const { getByText } = render(
      <Provider defaultValue={42}>
        <div>child content</div>
      </Provider>,
    );

    expect(getByText("child content")).toBeInTheDocument();
  });
});
