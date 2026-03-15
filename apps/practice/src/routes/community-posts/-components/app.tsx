import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type Post, type Sort, sort } from "./constants";

type AppContextValue = {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

const AppContext = createContext<AppContextValue | null>(null);

type PostProps = {
  post: Post;
};

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext error");
  return context;
}

function PostCard({ post }: PostProps) {
  const { setPosts } = useAppContext();

  const [title, setTitle] = useState("");
  const [like, setLike] = useState(0);
  const [dislike, setDislike] = useState(0);
  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const updateTitle = useCallback(
    (newTitle: string) => {
      setError(false);
      setLoading(true);

      fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`, {
        body: JSON.stringify({
          title: newTitle,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Something went wrong.");
          const json = await res.json();
          setPosts((prev) =>
            prev.map((p) => {
              if (p.id === post.id) {
                return { ...p, ...json, title: newTitle };
              }
              return p;
            }),
          );
          setEditing(false);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setPosts, post.id],
  );

  const inputId = `post-${post.id}-title-input`;

  return (
    <div
      style={{
        border: "1px solid black",
        margin: "16px 0px",
        padding: "8px",
      }}
    >
      {error ? (
        <div>
          <div>Could not update post.</div>
          <button
            type="button"
            disabled={loading}
            onClick={() => setError(false)}
          >
            Retry.
          </button>
        </div>
      ) : editing ? (
        <div>
          <div>
            <label htmlFor={inputId}>Title</label>
            <input
              id={inputId}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <button
            disabled={loading}
            type="button"
            onClick={() => updateTitle(title.trim())}
          >
            {loading ? "Saving" : "Save"}
          </button>
          <button
            disabled={loading}
            type="button"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <strong>{post.title}</strong>
      )}
      <div>{post.body}</div>
      <div>
        <div>Likes: {like}</div>
        <div>Dislikes: {dislike}</div>
      </div>
      <br />
      <div>
        <button type="button" onClick={() => setLike((prev) => prev + 1)}>
          Like
        </button>
        <button type="button" onClick={() => setDislike((prev) => prev + 1)}>
          Dislike
        </button>
        <button type="button" onClick={() => setEditing(true)}>
          Edit title
        </button>
      </div>
    </div>
  );
}

export function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postSorting, setPostSorting] = useState<Sort>(sort.newest);
  const [postFilter, setPostFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPosts = useCallback(() => {
    const controller = new AbortController();

    setError(false);
    setLoading(true);

    fetch("https://jsonplaceholder.typicode.com/posts?_limit=15", {
      method: "GET",
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Something went wrong.");
        const json = await res.json();
        setPosts(json);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    return fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    return posts
      .filter((p) => p.title.toLowerCase().includes(postFilter))
      .sort((a, b) => {
        if (a.id < b.id) return postSorting === sort.newest ? 1 : -1;
        if (a.id === b.id) return 0;
        return postSorting === sort.newest ? -1 : 1;
      });
  }, [posts, postFilter, postSorting]);

  return (
    <AppContext.Provider
      value={{
        posts,
        setPosts,
      }}
    >
      <div>
        <h1>Community Posts</h1>
        <div>
          <div>
            <label style={{ marginRight: "8px" }} htmlFor="post-filter">
              Search Posts:
            </label>
            <input
              id="post-filter"
              value={postFilter}
              onChange={(event) =>
                setPostFilter(event.target.value.trim().toLowerCase())
              }
            />
          </div>
          <div>
            <label style={{ marginRight: "8px" }} htmlFor="post-sorting">
              Sort Posts:
            </label>
            <select
              id="post-sorting"
              value={postSorting}
              onChange={(event) => setPostSorting(event.target.value as Sort)}
            >
              <option value={sort.newest}>Newest</option>
              <option value={sort.oldest}>Oldest</option>
            </select>
          </div>
        </div>
        <div className="posts">
          {error ? (
            <div>
              <div>Something went wrong.</div>
              <button
                type="button"
                disabled={loading}
                onClick={() => fetchPosts()}
              >
                Retry.
              </button>
            </div>
          ) : loading ? (
            <div>Loading...</div>
          ) : filteredPosts.length === 0 ? (
            <div>No posts found.</div>
          ) : (
            filteredPosts.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </div>
      </div>
    </AppContext.Provider>
  );
}
