import { GlobalRegistrator } from "@happy-dom/global-registrator";

if (!global.window) {
  GlobalRegistrator.register();
}

import { describe, expect, it } from "bun:test";
import { render } from "@testing-library/react";
import Loading from "../loading";

describe("Loading", () => {
  it("should render without crashing and produce no DOM output", () => {
    const { container } = render(<Loading />);
    // Loading returns null, so the container should be empty
    expect(container.innerHTML).toBe("");
  });
});
