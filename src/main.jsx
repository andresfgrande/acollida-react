
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "./routes/root";
import Login from "./routes/Login";
import Register from "./routes/Register";
import ErrorPage from "./routes/Error-page";
import './index.css'
import Dashboard from "./routes/Dashboard";
import Account from "./routes/Account";
import "../src/style/account.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
    
    
      <Root />
   
    ),
    errorElement: <ErrorPage />,
    children:[
      {
        path: "login",
        element: <Login/>,
      },
      {
        path: "register",
        element: <Register/>,
      },
      {
        path: "dashboard",
        element: <Dashboard/>,
      },
      {
        path: "account",
        element: <Account/>,
      },
    ]
  },
  
 
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
</React.StrictMode>
);