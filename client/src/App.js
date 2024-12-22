import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

const App = () => {
  const myRouter = createBrowserRouter([
    {
      path: "",
      element: <Signup />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "signup",
      element: <Signup />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
    },
  ]);
  return <div>
    <RouterProvider router={myRouter} />
  </div>;
};

export default App;
