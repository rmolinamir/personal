import { Button } from "@acme/ui/components/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <Button>Click me!</Button>
    </div>
  );
}
