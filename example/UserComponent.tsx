import React from "react";
import { useUserStore } from "./globalStore";

export function UserComponent() {
  const [{ count, user }, setUser] = useUserStore();

  const increment = () => {
    setUser({ count: count + 1 });
  };

  const changeCity = () => {
    setUser({ user: { ...user, city: "Hamburg" } });
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
