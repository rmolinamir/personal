// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./app";
import type { Todo } from "./constants";

const TODOS: Todo[] = [
  { completed: false, id: 1, title: "delectus aut autem", userId: 1 },
  {
    completed: true,
    id: 2,
    title: "quis ut nam facilis et officia qui",
    userId: 1,
  },
  { completed: false, id: 3, title: "fugiat veniam minus", userId: 1 },
];

function mockJsonResponse(body: unknown, ok = true, status = 200) {
  return Promise.resolve({
    json: async () => body,
    ok,
    status,
  } as Response);
}

function getTaskRow(title: string) {
  const titleElement = screen.getByText(title);
  const row = titleElement.closest("tr") ?? titleElement.closest("li");

  if (!row) {
    throw new Error(`Could not find row/list item for title: ${title}`);
  }

  return row;
}

describe("Task Queue assessment", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders app heading", () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      mockJsonResponse(TODOS),
    );

    render(<App />);

    expect(screen.getByRole("heading", { name: /task queue/i })).toBeTruthy();
  });

  it("fetches todos on first render and displays them", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(() => mockJsonResponse(TODOS));

    render(<App />);

    await screen.findByText("delectus aut autem");

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/todos?_limit=20",
      expect.objectContaining({}),
    );
    expect(screen.getByText("quis ut nam facilis et officia qui")).toBeTruthy();
  });

  it("supports loading, error with retry, and empty states", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new Error("network down"))
      .mockImplementationOnce(() => mockJsonResponse([]));

    render(<App />);

    expect(screen.getByText(/loading/i)).toBeTruthy();

    await screen.findByText(/something went wrong/i);

    fireEvent.click(screen.getByRole("button", { name: /retry/i }));

    await screen.findByText(/no tasks found/i);

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("filters tasks by controlled search input", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      mockJsonResponse(TODOS),
    );

    render(<App />);

    await screen.findByText("delectus aut autem");

    const searchInput = screen.getByRole("textbox", { name: /search/i });
    fireEvent.change(searchInput, { target: { value: "fugiat" } });

    expect(screen.getByText("fugiat veniam minus")).toBeTruthy();
    expect(screen.queryByText("delectus aut autem")).toBeNull();
  });

  it("filters by status (all/open/completed)", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      mockJsonResponse(TODOS),
    );

    render(<App />);

    await screen.findByText("delectus aut autem");

    const statusSelect = screen.getByRole("combobox", { name: /status/i });

    fireEvent.change(statusSelect, { target: { value: "completed" } });
    expect(screen.getByText("quis ut nam facilis et officia qui")).toBeTruthy();
    expect(screen.queryByText("delectus aut autem")).toBeNull();

    fireEvent.change(statusSelect, { target: { value: "open" } });
    expect(screen.getByText("delectus aut autem")).toBeTruthy();
    expect(screen.queryByText("quis ut nam facilis et officia qui")).toBeNull();
  });

  it("updates a todo with PATCH and reflects new status", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation((input, init) => {
        const url = String(input);

        if (url.endsWith("/todos?_limit=20")) {
          return mockJsonResponse(TODOS);
        }

        if (init?.method === "PATCH" && url.endsWith("/todos/1")) {
          return mockJsonResponse({ ...TODOS[0], completed: true });
        }

        return mockJsonResponse({}, false, 404);
      });

    render(<App />);

    await screen.findByText("delectus aut autem");

    const firstRow = getTaskRow("delectus aut autem");
    const toggleButton = within(firstRow).getByRole("button", {
      name: /mark complete/i,
    });

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(within(firstRow).getByText(/completed/i)).toBeTruthy();
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/todos/1",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("shows per-row saving state while patch is in flight", async () => {
    let resolvePatch: (value: Response) => void = () => {};

    vi.spyOn(globalThis, "fetch").mockImplementation((input, init) => {
      const url = String(input);

      if (url.endsWith("/todos?_limit=20")) {
        return mockJsonResponse(TODOS);
      }

      if (init?.method === "PATCH" && url.endsWith("/todos/1")) {
        return new Promise<Response>((resolve) => {
          resolvePatch = resolve;
        });
      }

      return mockJsonResponse({}, false, 404);
    });

    render(<App />);

    await screen.findByText("delectus aut autem");

    const firstRow = getTaskRow("delectus aut autem");
    const secondRow = getTaskRow("quis ut nam facilis et officia qui");

    fireEvent.click(
      within(firstRow).getByRole("button", { name: /mark complete/i }),
    );

    expect(within(firstRow).getByText(/saving/i)).toBeTruthy();
    expect(
      within(secondRow).getByRole("button", {
        name: /reopen/i,
      }),
    ).toBeTruthy();

    resolvePatch({
      json: async () => ({ ...TODOS[0], completed: true }),
      ok: true,
      status: 200,
    } as Response);

    await waitFor(() => {
      expect(
        within(firstRow).getByRole("button", { name: /reopen/i }),
      ).toBeTruthy();
    });
  });

  it("shows inline error when a patch request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((input, init) => {
      const url = String(input);

      if (url.endsWith("/todos?_limit=20")) {
        return mockJsonResponse(TODOS);
      }

      if (init?.method === "PATCH" && url.endsWith("/todos/1")) {
        return mockJsonResponse({ message: "failed" }, false, 500);
      }

      return mockJsonResponse({}, false, 404);
    });

    render(<App />);

    await screen.findByText("delectus aut autem");

    const firstRow = getTaskRow("delectus aut autem");
    fireEvent.click(
      within(firstRow).getByRole("button", { name: /mark complete/i }),
    );

    await waitFor(() => {
      expect(within(firstRow).getByText(/could not update task/i)).toBeTruthy();
    });
  });
});
