import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import Timeline from "./Components/Timeline";
import Stats from "./Components/Stats";
import Home from "./Components/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;