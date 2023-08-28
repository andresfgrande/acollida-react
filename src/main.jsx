
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "./routes/root";
import Login from "./routes/login";
import Register from "./routes/register";
import ErrorPage from "./routes/error-page";
import './index.css'


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
    ]
  },
  
 
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
</React.StrictMode>
);