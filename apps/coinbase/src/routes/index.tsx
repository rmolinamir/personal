import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div>
      <h1>Practice Applications</h1>
      <ul>
        <li>
          <Link to="/task-queue">Task Queue</Link>
        </li>
      </ul>
    </div>
  );
}
