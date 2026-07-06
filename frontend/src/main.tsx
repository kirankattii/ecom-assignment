import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AdminContextProvider from "./context/AdminContext.tsx";
import { WishlistContextProvider } from "./context/WishlistContext.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AdminContextProvider>
        <WishlistContextProvider>
          <App />
        </WishlistContextProvider>
      </AdminContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
