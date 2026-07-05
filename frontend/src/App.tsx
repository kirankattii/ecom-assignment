import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AdminContext } from "./context/AdminContext";

// Admin components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import AddProduct from "./pages/admin/AddProduct";
import ProductList from "./pages/admin/ProductList";
import EditProduct from "./pages/admin/EditProduct";

// Public components & pages
import PublicNavbar from "./components/PublicNavbar";
import PublicFooter from "./components/PublicFooter";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";

const App = () => {
  const { aToken } = useContext(AdminContext);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
        toastClassName="!bg-white !text-slate-800 !border !border-slate-200 shadow-lg"
      />

      <Routes>
        {/* Admin Layout Routes */}
        <Route
          path="/admin-dashboard"
          element={
            aToken ? (
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex flex-1">
                  <Sidebar />
                  <Dashboard />
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/add-product"
          element={
            aToken ? (
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex flex-1">
                  <Sidebar />
                  <AddProduct />
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/product-list"
          element={
            aToken ? (
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex flex-1">
                  <Sidebar />
                  <ProductList />
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/edit-product/:id"
          element={
            aToken ? (
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex flex-1">
                  <Sidebar />
                  <EditProduct />
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login route (render form directly, redirect to dashboard if logged in) */}
        <Route
          path="/login"
          element={
            aToken ? <Navigate to="/admin-dashboard" replace /> : <Login />
          }
        />

        {/* Public Storefront Layout Routes */}
        <Route
          path="/*"
          element={
            <div className="flex flex-col min-h-screen">
              <PublicNavbar />
              <main className="flex-1 flex flex-col bg-white">
                <Routes>
                  <Route path="/" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  {/* Catch all other URLs and send to Shop */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <PublicFooter />
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
