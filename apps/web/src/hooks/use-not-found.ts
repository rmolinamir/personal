import { useRouter, useRouterState } from "@tanstack/react-router";

export function useNotFound() {
  const { hasNotFoundMatch } = useRouter();
  const { statusCode } = useRouterState();

  return {
    isNotFound: hasNotFoundMatch() || statusCode === 404,
  };
}
