import { afterEach, expect } from "bun:test";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";

// Check if it's already registered to avoid the error
if (!global.window) {
  GlobalRegistrator.register();
}

// Extend bun's expect with jest-dom matchers (e.g. toBeInTheDocument)
expect.extend(matchers);

// Cleanup react-testing-library after each test
afterEach(() => {
  cleanup();
});
