import React from "react";
import { useCountStore } from "./globalStore";

const Counter = ({ index }: { index: number }) => {
  const [count, setCount] = useCountStore();

  const increment = () => {
    setCount(count + 1); // Simple state update for number
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <h2>
        Counter {index} : {count}
      </h2>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;
