import "./index.css";

import ReactDOM from "react-dom/client";
import { App } from "./App";

// Apply dark mode immediately on boot to avoid screen flash
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<App />);
}