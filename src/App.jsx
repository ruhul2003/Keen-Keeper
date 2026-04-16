import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import Timeline from "./Components/Timeline";
import Stats from "./Components/Stats";
import Home from "./Components/Home";
import FriendDetails from "./Components/FriendDetails";
import ErrorPage from "./Components/ErrorPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "timeline",
        element: <Timeline />
      },
      {
        path: "stats",
        element: <Stats />
      },
      {
        path: "friends/:id",
        element: <FriendDetails />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;