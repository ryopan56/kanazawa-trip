import { createBrowserRouter } from "react-router";
import TripsPage from "./pages/TripsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: TripsPage,
  },
  {
    path: "/trips",
    Component: TripsPage,
  },
]);
