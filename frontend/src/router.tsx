import { createBrowserRouter } from "react-router";
import TripsPage from "./pages/TripsPage";
import LoginPage from "./pages/LoginPage";
import PlacesPage from "./pages/PlacePage";

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
  {
    path: "/trips/:tid/places",
    Component: PlacesPage,
  },
]);
