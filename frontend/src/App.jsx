import { Suspense, lazy, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout.jsx";
import AdminRoute from "./components/admin/AdminRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useLazyRefreshTokenQuery } from "./store/authApi.js";
import { setCredentials } from "./store/authSlice.js";
import PageLoader from "./components/PageLoader.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Shop = lazy(() => import("./pages/Shop.jsx"));
const Product = lazy(() => import("./pages/Product.jsx"));
const Account = lazy(() => import("./pages/Account.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const CategoryPage = lazy(() => import("./pages/CategoryPage.jsx"));

// Admin Pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.jsx"));
const AdminForgotPassword = lazy(() => import("./pages/admin/AdminForgotPassword.jsx"));
const AdminChangePassword = lazy(() => import("./pages/admin/AdminChangePassword.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts.jsx"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories.jsx"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.jsx"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers.jsx"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews.jsx"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons.jsx"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory.jsx"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Register = lazy(() => import("./pages/auth/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword.jsx"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail.jsx"));
const Profile = lazy(() => import("./pages/auth/Profile.jsx"));
const ChangePassword = lazy(() => import("./pages/auth/ChangePassword.jsx"));

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return null;
};

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [triggerRefreshToken] = useLazyRefreshTokenQuery();

  useEffect(() => {
    if (!token) {
      triggerRefreshToken()
        .unwrap()
        .then((data) => {
          dispatch(setCredentials({ token: data.accessToken, user: data.user }));
        })
        .catch(() => {
          // Silent failure when no active refresh session exists
        });
    }
  }, [token, triggerRefreshToken, dispatch]);

  return (
    <AnimatePresence mode="wait">
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/change-password" element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/change-password" element={<AdminChangePassword />} />
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
          <Route
            path="/admin/customers"
            element={
              <AdminRoute>
                <AdminCustomers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <AdminRoute>
                <AdminReviews />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <AdminRoute>
                <AdminCoupons />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <AdminRoute>
                <AdminInventory />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <AdminRoute>
                <AdminReports />
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
