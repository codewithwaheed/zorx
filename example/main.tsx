import React from "react";
import ReactDOM from "react-dom/client";
import Counter from "./Counter.tsx";
import { UserComponent } from "./UserComponent.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {[1, 2, 3].map((index) => (
      <Counter index={index} />
    ))}
    <UserComponent />
  </React.StrictMode>
);
