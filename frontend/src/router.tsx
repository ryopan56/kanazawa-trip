import { createBrowserRouter } from "react-router";
import TripsPage from "./pages/TripsPage";
import LoginPage from "./pages/LoginPage";
import PlacesPage from "./pages/PlacePage";
import ActivitiesPage from "./pages/ActivitiesPage";

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
  {
    path: "/trips/:tid/activities",
    Component: ActivitiesPage,
  },
]);
