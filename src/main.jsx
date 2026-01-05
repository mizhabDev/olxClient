import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import Home from "./pages/Home";
import "./index.css";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/signUpPage.jsx";
import SellPage from "./pages/SellPage.jsx";
import GoogleAuth from "./pages/GoogleAuth.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        path: "/sell",
        element: <SellPage />,
      },
      {
        path: "/oauth-success",
        element: <GoogleAuth />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPasswordPage />,
      },
      {
        path: "/product/:productId",
        element: <ProductDetailPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
