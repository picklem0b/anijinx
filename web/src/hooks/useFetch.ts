import { useEffect, useState } from 'react'

interface State<T> {
  data: T | null
  error: string | null
}

export function useFetch<T>(load: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<State<T>>({ data: null, error: null })

  useEffect(() => {
    let alive = true
    setState({ data: null, error: null })
    load()
      .then((data) => alive && setState({ data, error: null }))
      .catch((e: Error) => alive && setState({ data: null, error: e.message }))
    return () => {
      alive = false
    }
  }, deps)

  return state
}
