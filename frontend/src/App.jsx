import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout.jsx";
import AdminRoute from "./components/admin/AdminRoute.jsx";
import PageLoader from "./components/PageLoader.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Shop = lazy(() => import("./pages/Shop.jsx"));
const Product = lazy(() => import("./pages/Product.jsx"));
const Account = lazy(() => import("./pages/Account.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const CategoryPage = lazy(() => import("./pages/CategoryPage.jsx"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts.jsx"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories.jsx"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.jsx"));

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return null;
};

const App = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="account" element={<Account />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="eid-26-collection" element={<CategoryPage pageKey="eid-26-collection" />} />
            <Route path="new" element={<CategoryPage pageKey="new" />} />
            <Route path="men" element={<CategoryPage pageKey="men" />} />
            <Route path="bestsellers" element={<CategoryPage pageKey="bestsellers" />} />
            <Route path="abayas" element={<CategoryPage pageKey="abayas" />} />
            <Route path="hajj-umrah" element={<CategoryPage pageKey="hajj-umrah" />} />
            <Route path="kaftans" element={<CategoryPage pageKey="kaftans" />} />
            <Route path="hijabs" element={<CategoryPage pageKey="hijabs" />} />
            <Route path="kids" element={<CategoryPage pageKey="kids" />} />
            <Route path="clothing" element={<CategoryPage pageKey="clothing" />} />
            <Route path="turkish-abaya" element={<CategoryPage pageKey="turkish-abaya" />} />
            <Route path="accessories" element={<CategoryPage pageKey="accessories" />} />
            <Route path="sale" element={<CategoryPage pageKey="sale" />} />
            <Route path="winter-wear" element={<CategoryPage pageKey="winter-wear" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default App;
