import { createBrowserRouter } from "react-router";
import TripsPage from "./pages/TripsPage";
import LoginPage from "./pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: TripsPage,
  },
  {
    path: "/trips",
    Component: TripsPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
]);
