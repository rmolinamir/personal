import { type Todo as PrimitiveTodo, type Status, status } from "./constants";
import "./app.css";
import { useCallback, useEffect, useState } from "react";

type Todo = PrimitiveTodo & {
  saving?: boolean;
  error?: boolean;
};

export function App() {
  const [tasks, setTasks] = useState<Todo[]>([]);

  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status>(status.all);

  const fetchInitialTasks = useCallback(() => {
    const controller = new AbortController();

    setNetworkError(false);
    setIsLoadingTasks(true);

    fetch("https://jsonplaceholder.typicode.com/todos?_limit=20", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Something went wrong.");
        const initialTasks = await res.json();
        setTasks(initialTasks);
      })
      .catch(() => setNetworkError(true))
      .finally(() => setIsLoadingTasks(false));

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    return fetchInitialTasks();
  }, [fetchInitialTasks]);

  const toggleTaskStatus = useCallback((task: Todo) => {
    const controller = new AbortController();

    setTasks((tasks) => {
      return tasks.map((t) => {
        if (t.id === task.id) return { ...t, saving: true };
        return t;
      });
    });

    fetch(`https://jsonplaceholder.typicode.com/todos/${task.id}`, {
      body: JSON.stringify({ completed: !task.completed }),
      method: "PATCH",
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Something went wrong.");

        setTasks((tasks) => {
          return tasks.map((t) => {
            if (t.id === task.id)
              return { ...task, completed: !task.completed };
            return t;
          });
        });
      })
      .catch(() => {
        setTasks((tasks) => {
          return tasks.map((t) => {
            if (t.id === task.id) return { ...task, error: true };
            return t;
          });
        });
      });

    return () => {
      controller.abort();
    };
  }, []);

  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(searchFilter.toLowerCase()))
    .filter((t) => {
      switch (statusFilter) {
        case "completed":
          return t.completed;
        case "open":
          return !t.completed;
        case "all":
          return true;
        default:
          console.warn("Wrong status:", { statusFilter, task: t });
          return true;
      }
    });

  return (
    <div>
      <h1>Task Queue</h1>
      <div className="filters">
        <div className="search-filter">
          <label htmlFor="search-filter">Search Filter</label>
          <input
            id="search-filter"
            value={searchFilter}
            onChange={(event) => {
              setSearchFilter(event.target.value.trim());
            }}
          />
        </div>
        <div className="status-filter">
          <label htmlFor="status-filter">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as Status)}
            id="status-filter"
          >
            <option value={status.all}>All</option>
            <option value={status.completed}>Completed</option>
            <option value={status.open}>Open</option>
          </select>
        </div>
      </div>
      <div />

      {networkError ? (
        <div>
          <p>Something went wrong</p>
          <button onClick={() => fetchInitialTasks()} type="button">
            Retry
          </button>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>
                Status (<code>Completed</code> / <code>Open</code>)
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoadingTasks && filteredTasks.length > 0 ? (
              filteredTasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.title}</td>
                  <td className={t.completed ? "completed" : "open"}>
                    {t.saving ? (
                      <code>Saving...</code>
                    ) : t.error ? (
                      <code>Could not update task.</code>
                    ) : (
                      <>
                        <code>{t.completed ? "Completed" : "Open"}</code>
                        <button
                          onClick={() => toggleTaskStatus(t)}
                          type="button"
                        >
                          <code>
                            {t.completed ? "Reopen" : "Mark complete"}
                          </code>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr
                style={{
                  textAlign: "center",
                }}
              >
                <td>{isLoadingTasks ? "Loading..." : "No tasks found."}</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
