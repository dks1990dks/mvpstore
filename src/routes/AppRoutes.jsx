import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Categories from "../pages/category/Categories";
import Products from "../pages/product/Products";
import StoreSettings from "../pages/store/StoreSettings";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

// Import your public storefront pages
import StoreHome from "../pages/public/StoreHome";
import ProductDetail from "../pages/public/ProductDetail";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Root Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 2. Public Auth Routes (No Sidebar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 3. Public Customer Storefront Routes (No Sidebar) */}
        <Route path="/store/:storeSlug" element={<StoreHome />} />
        <Route path="/store/:storeSlug/product/:productSlug" element={<ProductDetail />} />

        {/* 4. Private Merchant Routes (WITH Sidebar Layout) */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout /> {/* This is what introduces the sidebar */}
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/store-settings" element={<StoreSettings />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}