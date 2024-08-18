import { Fragment } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Params,
} from "react-router-dom";
import "./index.css";
import "./App.css";
import Main from "./main";


const router = createBrowserRouter([
  { path: '/', element: <Main /> }, // This catches all undefined routes
]);


function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;