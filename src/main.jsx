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
import ProfilePage from "./pages/ProfilePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ContentPage from "./pages/ContentPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import MyListingsPage from "./pages/MyListingsPage.jsx";
import AuthGuard from "./routes/AuthGuard.jsx";
import { AboutPage, ContactPage, PrivacyPolicyPage, TermsPage, FAQPage, CategoriesPage } from "./pages/static";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // 🌐 Public routes
      { path: "/", element: <Home /> },
      { path: "/home", element: <Home /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignUpPage /> },
      { path: "/oauth-success", element: <GoogleAuth /> },
      { path: "/reset-password/:token", element: <ResetPasswordPage /> },
      { path: "/page/:slug", element: <ContentPage /> },

      // 📄 Static pages
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/privacy", element: <PrivacyPolicyPage /> },
      { path: "/terms", element: <TermsPage /> },
      { path: "/faq", element: <FAQPage /> },
      { path: "/categories", element: <CategoriesPage /> },

      // 🔒 Protected routes
      {
        element: <AuthGuard />,
        children: [
          { path: "/sell", element: <SellPage /> },
          { path: "/product/:productId", element: <ProductDetailPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/chat", element: <ChatPage /> },
          { path: "/wishlist", element: <WishlistPage /> },
          { path: "/my-listings", element: <MyListingsPage /> },
        ],
      },
    ],
  },
]);


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
