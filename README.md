# Global State Management Library with React

This is a simple yet powerful global state management library built using React's `useSyncExternalStore`. It allows you to manage global state across multiple components, handle both primitive and object states, and optionally persist the state using `localStorage`.

## Features

- **Global State Management**: Easily manage state across multiple components without prop drilling.
- **Primitive and Object State Support**: Handle both primitive types (e.g., numbers, strings) and complex objects.
- **State Persistence**: Optionally persist state using `localStorage` with a simple configuration.
- **Partial Object Updates**: Perform partial updates to object state without overriding the entire object.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/codewithwaheed/zorx.git
   cd zorx
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

### Creating a Store

You can create a global store using the `createUseStore` function. It supports both primitive and object states and can persist the state to `localStorage`.

```ts
// src/store.ts
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

  // Load persisted state from localStorage
  if (key && typeof window !== "undefined") {
    const persistedState = localStorage.getItem(key);
    if (persistedState) {
      try {
        const parsedState = JSON.parse(persistedState);
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
    setState(newState: Partial<T> | T) {
      if (typeof newState === "object" && !Array.isArray(newState)) {
        state = { ...(state as object), ...newState };
      } else {
        state = newState as T;
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
```

### Example: Managing a Primitive State

For managing a simple **primitive state** (like a number), create a store and use it inside your component.

```ts
// example/globalStore.ts
import { createUseStore } from "../src/store";

export const useCountStore = createUseStore<number>(0, "countState"); // Using localStorage to persist
```

Then, in your component, you can easily increment or decrement the count:

```tsx
// example/Counter.tsx
import React from "react";
import { useCountStore } from "./globalStore";

const Counter = ({ index }: { index: number }) => {
  const [count, setCount] = useCountStore();

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div>
      <h2>
        Counter {index}: {count}
      </h2>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;
```

### Example: Managing an Object State

For more complex state management, you can manage an object state and perform partial updates:

```ts
// example/globalStore.ts
import { createUseStore } from "../src/store";

interface State {
  count: number;
  user: {
    name: string;
    city: string;
  };
}

export const useGlobalStore = createUseStore<State>(
  {
    count: 0,
    user: {
      name: "Alice",
      city: "Berlin",
    },
  },
  "globalAppState"
);
```

In your component, you can update only specific properties of the object:

```tsx
// example/UserComponent.tsx
import React from "react";
import { useGlobalStore } from "./globalStore";

export function UserComponent() {
  const [{ count, user }, setGlobalState] = useGlobalStore();

  const increment = () => {
    setGlobalState({ count: count + 1 });
  };

  const changeCity = () => {
    setGlobalState({ user: { ...user, city: "Hamburg" } }); // Partial update
  };

  return (
    <div>
      <h2>Count: {count}</h2>
      <p>User: {user.name}</p>
      <p>City: {user.city}</p>
      <button onClick={increment}>Increment Count</button>
      <button onClick={changeCity}>Change City</button>
    </div>
  );
}
```

### Running the Example

To run the example:

```bash
npm run dev
```

The example application will start, showcasing the use of both primitive and object-based state management.

## Customization

- **Initial State**: You can pass any initial state to `createUseStore` — either a primitive or an object.
- **Persistence**: By providing a `key` to `createUseStore`, the state will be automatically persisted in `localStorage` and restored when the app reloads.

## Contributing

Feel free to open issues and submit pull requests for any improvements or bug fixes. Contributions are welcome!

## License

This project is licensed under the MIT License.
