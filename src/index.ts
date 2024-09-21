import { useSyncExternalStore } from "react";
import { createStore } from "./store";

export function createUseStore<T>(initialState: T, key?: string) {
  const store = createStore({ initialState, key });
  return () =>
    [
      useSyncExternalStore(store.subscribe, store.getSnapshot),
      store.setState,
    ] as const;
}
