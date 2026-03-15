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
import type { Post } from "./constants";

const POSTS: Post[] = [
  {
    body: "This post explains what changed in the latest release.",
    id: 3,
    title: "Release notes: security improvements",
    userId: 1,
  },
  {
    body: "This is our first community update.",
    id: 1,
    title: "Welcome to Acme community posts",
    userId: 2,
  },
  {
    body: "An update on market structure and volatility.",
    id: 2,
    title: "Market recap: volatility outlook",
    userId: 3,
  },
];

function mockJsonResponse(body: unknown, ok = true, status = 200) {
  return Promise.resolve({
    json: async () => body,
    ok,
    status,
  } as Response);
}

function getPostContainer(title: string) {
  const titleElement = screen.getByText(title);
  let node: HTMLElement | null = titleElement as HTMLElement;

  while (node) {
    const hasPostControls =
      within(node).queryByRole("button", { name: /^like$/i }) ||
      within(node).queryByRole("button", { name: /edit title/i });

    if (hasPostControls) {
      return node;
    }

    node = node.parentElement;
  }

  throw new Error(`Could not find post container for title: ${title}`);
}

describe("Community Posts assessment", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders app heading", () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      mockJsonResponse(POSTS),
    );

    render(<App />);

    expect(
      screen.getByRole("heading", { name: /community posts/i }),
    ).toBeTruthy();
  });

  it("fetches posts on first render and displays them", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(() => mockJsonResponse(POSTS));

    render(<App />);

    await screen.findByText("Release notes: security improvements");

    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0]?.[0]).toBe(
      "https://jsonplaceholder.typicode.com/posts?_limit=15",
    );
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

    await screen.findByText(/no posts found/i);

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("filters posts by controlled search input", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      mockJsonResponse(POSTS),
    );

    render(<App />);

    await screen.findByText("Release notes: security improvements");

    fireEvent.change(screen.getByRole("textbox", { name: /search/i }), {
      target: { value: "volatility" },
    });

    expect(screen.getByText("Market recap: volatility outlook")).toBeTruthy();
    expect(
      screen.queryByText("Release notes: security improvements"),
    ).toBeNull();
  });

  it("sorts posts by id (newest/oldest)", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      mockJsonResponse(POSTS),
    );

    render(<App />);

    await screen.findByText("Release notes: security improvements");

    fireEvent.change(screen.getByRole("combobox", { name: /sort/i }), {
      target: { value: "oldest" },
    });

    const oldest = screen.getByText("Welcome to Acme community posts");
    const newest = screen.getByText("Release notes: security improvements");
    const relation = oldest.compareDocumentPosition(newest);

    expect(relation & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("supports local like and dislike interactions", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() =>
      mockJsonResponse(POSTS),
    );

    render(<App />);

    await screen.findByText("Release notes: security improvements");

    const postContainer = getPostContainer(
      "Release notes: security improvements",
    );

    fireEvent.click(
      within(postContainer).getByRole("button", { name: /^like$/i }),
    );
    fireEvent.click(
      within(postContainer).getByRole("button", { name: /^like$/i }),
    );
    fireEvent.click(
      within(postContainer).getByRole("button", { name: /dislike/i }),
    );

    expect(within(postContainer).getByText(/likes:\s*2/i)).toBeTruthy();
    expect(within(postContainer).getByText(/dislikes:\s*1/i)).toBeTruthy();
  });

  it("updates post title with PATCH and reflects new title", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation((input, init) => {
        const url = String(input);

        if (url.endsWith("/posts?_limit=15")) {
          return mockJsonResponse(POSTS);
        }

        if (init?.method === "PATCH" && url.endsWith("/posts/3")) {
          return mockJsonResponse({
            ...POSTS[0],
            title: "Updated release notes",
          });
        }

        return mockJsonResponse({}, false, 404);
      });

    render(<App />);

    await screen.findByText("Release notes: security improvements");

    const postContainer = getPostContainer(
      "Release notes: security improvements",
    );

    fireEvent.click(
      within(postContainer).getByRole("button", { name: /edit title/i }),
    );
    fireEvent.change(
      within(postContainer).getByRole("textbox", { name: /title/i }),
      {
        target: { value: "Updated release notes" },
      },
    );
    fireEvent.click(
      within(postContainer).getByRole("button", { name: /save/i }),
    );

    await screen.findByText("Updated release notes");

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/posts/3",
      expect.objectContaining({
        body: JSON.stringify({ title: "Updated release notes" }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      }),
    );
  });

  it("shows per-post saving and inline mutation error states", async () => {
    let resolvePatch: (value: Response) => void = () => {};

    vi.spyOn(globalThis, "fetch").mockImplementation((input, init) => {
      const url = String(input);

      if (url.endsWith("/posts?_limit=15")) {
        return mockJsonResponse(POSTS);
      }

      if (init?.method === "PATCH" && url.endsWith("/posts/3")) {
        return new Promise<Response>((resolve) => {
          resolvePatch = resolve;
        });
      }

      if (init?.method === "PATCH" && url.endsWith("/posts/2")) {
        return mockJsonResponse({ message: "failed" }, false, 500);
      }

      return mockJsonResponse({}, false, 404);
    });

    render(<App />);

    await screen.findByText("Release notes: security improvements");

    const firstPost = getPostContainer("Release notes: security improvements");
    const secondPost = getPostContainer("Market recap: volatility outlook");

    fireEvent.click(
      within(firstPost).getByRole("button", { name: /edit title/i }),
    );
    fireEvent.change(
      within(firstPost).getByRole("textbox", { name: /title/i }),
      {
        target: { value: "Saving title" },
      },
    );
    fireEvent.click(within(firstPost).getByRole("button", { name: /save/i }));

    expect(
      within(firstPost).getByRole("button", { name: /saving/i }),
    ).toBeTruthy();
    expect(
      within(secondPost).getByRole("button", { name: /edit title/i }),
    ).toBeTruthy();

    fireEvent.click(
      within(secondPost).getByRole("button", { name: /edit title/i }),
    );
    fireEvent.change(
      within(secondPost).getByRole("textbox", { name: /title/i }),
      {
        target: { value: "Will fail" },
      },
    );
    fireEvent.click(within(secondPost).getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(
        within(secondPost).getByText(/could not update post/i),
      ).toBeTruthy();
    });

    resolvePatch({
      json: async () => ({ ...POSTS[0], title: "Saving title" }),
      ok: true,
      status: 200,
    } as Response);

    await waitFor(() => {
      expect(
        within(firstPost).getByRole("button", { name: /edit title/i }),
      ).toBeTruthy();
    });
  });
});
