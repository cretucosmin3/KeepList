/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "./index.css";
import App from "./App";
import Dashboard from "./pages/Dashboard";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Dashboard} />
    </Router>
  ),
  root
);