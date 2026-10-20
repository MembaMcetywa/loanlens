import { QueryClient } from '@tanstack/react-query'

export function getContext() {
  return {
    queryClient: new QueryClient({
      defaultOptions: { queries: { staleTime: 30_000 } },
    }),
  }
}

export default function TanstackQueryProvider() {}
