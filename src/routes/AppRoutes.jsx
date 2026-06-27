// 1. Import HashRouter instead of BrowserRouter
import { HashRouter, Routes, Route, Navigate } from "react-router-dom"; 
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Categories from "../pages/category/Categories";
import Products from "../pages/product/Products";
import StoreSettings from "../pages/store/StoreSettings";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import StoreHome from "../pages/public/StoreHome";
import ProductDetail from "../pages/public/ProductDetail";

export default function AppRoutes() {
  return (
    // 2. Change BrowserRouter to HashRouter
    <HashRouter> 
      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public Customer Storefront Routes */}
        <Route path="/store/:storeSlug" element={<StoreHome />} />
        <Route path="/store/:storeSlug/product/:productSlug" element={<ProductDetail />} />

        {/* Private Merchant Routes */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/store-settings" element={<StoreSettings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
