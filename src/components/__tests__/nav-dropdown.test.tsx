import { GlobalRegistrator } from "@happy-dom/global-registrator";
import React from "react";

if (!global.window) {
  GlobalRegistrator.register();
}

import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { User } from "@/payload-types";
import NavDropdown from "../nav-dropdown";

// Mock next/navigation
const mockPush = mock();
const mockReplace = mock();

mock.module("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: mock(),
  }),
  usePathname: () => "/crystals",
}));

describe("NavDropdown", () => {
  const mockUser = {
    id: 1,
    email: "testuser@example.com",
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    admin: false,
  } as unknown as User;

  beforeEach(() => {
    mock.restore();
    mockPush.mockClear();
    mockReplace.mockClear();
    if (document.body) {
      document.body.innerHTML = "";
    }
  });

  afterEach(() => {
    // Reset global fetch mock if any
    global.fetch = undefined as unknown as typeof fetch;
  });

  it("should render the dropdown trigger with the user's name", () => {
    const { getByRole } = render(<NavDropdown user={mockUser} />);
    const triggerBtn = getByRole("button", { name: /testuser/i });
    expect(triggerBtn).toBeInTheDocument();
  });

  it("should open the dropdown and allow navigating to insert", async () => {
    const { getByRole, getByText } = render(<NavDropdown user={mockUser} />);
    const triggerBtn = getByRole("button", { name: /testuser/i });

    await userEvent.click(triggerBtn);

    const insertItem = getByText("Insert");
    expect(insertItem).toBeInTheDocument();

    await userEvent.click(insertItem);

    expect(mockPush).toHaveBeenCalledWith("/crystals/insert");
  });

  it("should trigger logout on click", async () => {
    global.fetch = mock().mockResolvedValue({
      ok: true,
      status: 200,
    });

    const { getByRole, getByText } = render(<NavDropdown user={mockUser} />);
    const triggerBtn = getByRole("button", { name: /testuser/i });

    await userEvent.click(triggerBtn);

    const logoutItem = getByText("Log out");
    await userEvent.click(logoutItem);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/login");
    });
  });

  it("should handle keyboard shortcuts for insert and logout", async () => {
    global.fetch = mock().mockResolvedValue({
      ok: true,
      status: 200,
    });

    render(<NavDropdown user={mockUser} />);

    // Test Ctrl+I
    const insertEvent = new window.KeyboardEvent("keydown", {
      key: "i",
      ctrlKey: true,
    });
    window.dispatchEvent(insertEvent);
    expect(mockPush).toHaveBeenCalledWith("/crystals/insert");

    // Test Ctrl+L
    const logoutEvent = new window.KeyboardEvent("keydown", {
      key: "l",
      ctrlKey: true,
    });
    act(() => {
      window.dispatchEvent(logoutEvent);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/login");
    });
  });

  it("should trigger switch tables event on click", async () => {
    const { getByRole, getByText } = render(<NavDropdown user={mockUser} />);
    const triggerBtn = getByRole("button", { name: /testuser/i });

    await userEvent.click(triggerBtn);

    const switchTablesItem = getByText("Switch Tables");
    expect(switchTablesItem).toBeInTheDocument();

    const dispatchSpy = mock();
    document.addEventListener("keydown", dispatchSpy);

    await userEvent.click(switchTablesItem);

    expect(dispatchSpy).toHaveBeenCalled();
    const eventArg = dispatchSpy.mock.calls[0][0];
    expect(eventArg.key).toBe("k");
    expect(eventArg.ctrlKey).toBe(true);

    document.removeEventListener("keydown", dispatchSpy);
  });

  it("should throw error on logout failure", async () => {
    const originalConsoleError = console.error;
    console.error = mock();

    class ErrorBoundary extends React.Component<
      { children: React.ReactNode },
      { hasError: boolean; error: Error | null }
    > {
      constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
      }
      static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
      }
      render() {
        if (this.state.hasError) {
          return <div>Error Boundary Caught: {this.state.error?.message}</div>;
        }
        return this.props.children;
      }
    }

    global.fetch = mock().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const { getByRole, getByText, findByText } = render(
      <ErrorBoundary>
        <NavDropdown user={mockUser} />
      </ErrorBoundary>,
    );

    const triggerBtn = getByRole("button", { name: /testuser/i });
    await userEvent.click(triggerBtn);

    const logoutItem = getByText("Log out");
    await userEvent.click(logoutItem);

    expect(
      await findByText(/Error Boundary Caught: Logout failed with status 500/),
    ).toBeInTheDocument();

    console.error = originalConsoleError;
  });
});
