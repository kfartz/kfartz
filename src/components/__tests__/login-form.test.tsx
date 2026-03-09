import { GlobalRegistrator } from "@happy-dom/global-registrator";

if (!global.window) {
  GlobalRegistrator.register();
}

import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../login-form";

// Mock next/navigation
const mockPush = mock();
mock.module("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mock(),
    prefetch: mock(),
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mock.restore();
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

  it("should render the login form", () => {
    const { getByLabelText, getByRole } = render(
      <LoginForm tableSlugs={["crystals"]} />,
    );

    expect(getByLabelText("Email")).toBeInTheDocument();
    expect(getByLabelText("Password")).toBeInTheDocument();
    expect(getByRole("button", { name: /Sign in/i })).toBeInTheDocument();
  });

  it("should allow toggling password visibility", async () => {
    const { getByLabelText, getByRole } = render(
      <LoginForm tableSlugs={["crystals"]} />,
    );

    const passwordInput = getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = getByRole("button", { name: /Show password/i });

    // Click to show password
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click to hide password
    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should validate email format and required fields", async () => {
    const { getByLabelText, getByText, queryByText } = render(
      <LoginForm tableSlugs={["crystals"]} />,
    );

    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");

    // Test email required
    await userEvent.type(emailInput, "a");
    await userEvent.type(emailInput, "{backspace}");
    expect(getByText("Email is required")).toBeInTheDocument();

    // Test email format
    await userEvent.type(emailInput, "invalid-email");
    expect(getByText("Please enter a valid email")).toBeInTheDocument();

    // Fix email
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "test@example.com");
    expect(queryByText("Please enter a valid email")).not.toBeInTheDocument();

    // Test password required (onBlur)
    await userEvent.click(passwordInput);
    await userEvent.click(document.body); // blur
    expect(getByText("Password is required")).toBeInTheDocument();
  });

  it("should successfully log in and redirect", async () => {
    global.fetch = mock().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ user: { id: 1 } }),
    });

    const { getByLabelText, getByRole } = render(
      <LoginForm tableSlugs={["crystals"]} />,
    );

    await userEvent.type(getByLabelText("Email"), "test@example.com");
    await userEvent.type(getByLabelText("Password"), "password123");

    const submitBtn = getByRole("button", { name: /Sign in/i });
    expect(submitBtn).not.toBeDisabled();

    // Form submission
    const form = document.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/crystals");
    });
  });

  it("should handle login server errors", async () => {
    global.fetch = mock().mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({ errors: [{ message: "Custom error message" }] }),
    });

    const { getByLabelText, getByText } = render(
      <LoginForm tableSlugs={["crystals"]} />,
    );

    await userEvent.type(getByLabelText("Email"), "test@example.com");
    await userEvent.type(getByLabelText("Password"), "wrongpassword");

    const form = document.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(getByText("Custom error message")).toBeInTheDocument();
    });
  });

  it("should handle network errors", async () => {
    global.fetch = mock().mockRejectedValue(new Error("Network Error"));

    const { getByLabelText, getByText } = render(
      <LoginForm tableSlugs={["crystals"]} />,
    );

    await userEvent.type(getByLabelText("Email"), "test@example.com");
    await userEvent.type(getByLabelText("Password"), "password");

    const form = document.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(
        getByText("Unable to connect to the server. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("should show data.message when errors array is not present", async () => {
    global.fetch = mock().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Account locked" }),
    });

    const { getByLabelText, getByText } = render(
      <LoginForm tableSlugs={["crystals"]} />,
    );

    await userEvent.type(getByLabelText("Email"), "test@example.com");
    await userEvent.type(getByLabelText("Password"), "wrongpassword");

    const form = document.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(getByText("Account locked")).toBeInTheDocument();
    });
  });

  it("should show default error when no message field is present", async () => {
    global.fetch = mock().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });

    const { getByLabelText, getByText } = render(
      <LoginForm tableSlugs={["crystals"]} />,
    );

    await userEvent.type(getByLabelText("Email"), "test@example.com");
    await userEvent.type(getByLabelText("Password"), "wrongpassword");

    const form = document.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(getByText("Invalid email or password.")).toBeInTheDocument();
    });
  });

  it("should disable submit button when form is pristine", () => {
    const { getByRole } = render(<LoginForm tableSlugs={["crystals"]} />);

    const submitBtn = getByRole("button", { name: /Sign in/i });
    expect(submitBtn).toBeDisabled();
  });
});
