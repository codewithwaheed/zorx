import { useSyncExternalStore } from "react";

export type Listener = () => void;

function createStore<T>({
  initialState,
  key,
}: {
  initialState: T;
  key?: string;
}) {
  let subscribers: Listener[] = [];
  let state = initialState;

  // Load persisted state from localStorage (if key is provided)
  if (key && typeof window !== "undefined") {
    const persistedState = localStorage.getItem(key);
    if (persistedState) {
      try {
        const parsedState = JSON.parse(persistedState);
        // Ensure persisted state matches the type of initialState
        if (typeof parsedState === typeof initialState) {
          state = parsedState;
        }
      } catch (error) {
        console.error("Error parsing state from localStorage", error);
      }
    }
  }

  const notifyStateChanged = () => {
    subscribers.forEach((fn) => fn());
  };

  // Persist state to localStorage (if key is provided)
  const persistState = (newState: T) => {
    if (key && typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(newState));
    }
  };

  return {
    subscribe(fn: Listener) {
      subscribers.push(fn);
      return () => {
        subscribers = subscribers.filter((listener) => listener !== fn);
      };
    },
    getSnapshot() {
      return state;
    },
    // Handle updates for both primitives and objects
    setState(newState: Partial<T> | T) {
      if (typeof newState === "object" && !Array.isArray(newState)) {
        state = { ...(state as object), ...newState } as T;
      } else {
        state = newState as T; // For primitive values (number, string, etc.)
      }
      notifyStateChanged();
      persistState(state);
    },
  };
}

export function createUseStore<T>(initialState: T, key?: string) {
  const store = createStore({ initialState, key });
  return () =>
    [
      useSyncExternalStore(store.subscribe, store.getSnapshot),
      store.setState,
    ] as const;
}
