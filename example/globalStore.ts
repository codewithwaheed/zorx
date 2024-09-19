// globalStore.ts
import { createUseStore } from "../src/store";

export const useCountStore = createUseStore<number>(0, "countState"); // Persist count as a number

interface State {
  count: number;
  user: {
    name: string;
    city: string;
  };
}

export const useUserStore = createUseStore<State>(
  {
    count: 0,
    user: {
      name: "Alice",
      city: "Berlin",
    },
  },
  "globalAppState" // Persist complex object state
);
