import { createRoot } from "react-dom/client";
import "@fontsource-variable/noto-sans";
import "@fontsource-variable/noto-sans-bengali";
import App from "./App";
import "./styles/tokens.css";
import "./styles/app.css";

createRoot(document.getElementById("root")!).render(<App />);
