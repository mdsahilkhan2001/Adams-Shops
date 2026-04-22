import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SectionHeader from "../components/SectionHeader.jsx";
import { clearCart } from "../store/cartSlice.js";
import { setCredentials } from "../store/authSlice.js";
import { useCheckoutMutation, useLoginMutation } from "../store/api.js";
import { formatPrice, getPrimaryImage } from "../utils/format.js";

const paymentOptions = [
  { id: "card", label: "Credit / Debit Card" },
  { id: "upi", label: "UPI" },
  { id: "cod", label: "Cash on Delivery" }
];

const Checkout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const token = useSelector((state) => state.auth.token);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [shipping, setShipping] = useState({
    full_name: "",
    line1: "",
    line2: "",
    city: "Bangalore",
    state: "Karnataka",
    postal_code: "",
    country: "India",
    phone: ""
  });

  const [login, { isLoading: loggingIn, error: loginError }] = useLoginMutation();
  const [checkout, { isLoading: placingOrder, error: checkoutError }] = useCheckoutMutation();

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
    [cartItems]
  );
  const isShippingValid =
    shipping.full_name &&
    shipping.line1 &&
    shipping.city &&
    shipping.state &&
    shipping.postal_code &&
    shipping.phone;

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const data = await login(loginForm).unwrap();
      dispatch(setCredentials({ token: data.access, user: null }));
    } catch (error) {
      // handled via loginError
    }
  };

  const handleCheckout = async () => {
    if (!token || cartItems.length === 0) {
      return;
    }
    const payload = {
      payment_method: paymentMethod,
      shipping_address: shipping,
      items: cartItems.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        selected_size: item.selected_size || "",
        selected_color: item.selected_color || ""
      }))
    };

    try {
      await checkout(payload).unwrap();
      dispatch(clearCart());
      setShowSuccess(true);
    } catch (error) {
      // handled via checkoutError
    }
  };

  return (
    <div className="lux-container py-16 space-y-10">
      <SectionHeader
        eyebrow="Checkout"
        title="Secure Luxury Checkout"
        description="Complete your order with refined service and curated delivery."
      />

      {!token && (
        <div className="lux-card space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">Sign In</p>
          <p className="text-sand text-sm">
            Please sign in to place your order and track your purchases.
          </p>
          <form onSubmit={handleLogin} className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(event) =>
                setLoginForm((prev) => ({ ...prev, username: event.target.value }))
              }
              className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((prev) => ({ ...prev, password: event.target.value }))
              }
              className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
            />
            <button type="submit" className="lux-button" disabled={loggingIn}>
              {loggingIn ? "Signing In" : "Sign In"}
            </button>
          </form>
          {loginError && <p className="text-red-400 text-sm">Login failed. Check credentials.</p>}
        </div>
      )}

      {showSuccess && (
        <div className="glass-panel space-y-2">
          <h3 className="font-display text-2xl">Order Confirmed</h3>
          <p className="text-sand">Your order is placed. We will notify you with tracking details.</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="lux-card space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-sand">Shipping Address</p>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Full Name"
                value={shipping.full_name}
                onChange={(event) =>
                  setShipping((prev) => ({ ...prev, full_name: event.target.value }))
                }
                className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
              />
              <input
                type="text"
                placeholder="Phone"
                value={shipping.phone}
                onChange={(event) =>
                  setShipping((prev) => ({ ...prev, phone: event.target.value }))
                }
                className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
              />
              <input
                type="text"
                placeholder="Address Line 1"
                value={shipping.line1}
                onChange={(event) =>
                  setShipping((prev) => ({ ...prev, line1: event.target.value }))
                }
                className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none md:col-span-2"
              />
              <input
                type="text"
                placeholder="Address Line 2"
                value={shipping.line2}
                onChange={(event) =>
                  setShipping((prev) => ({ ...prev, line2: event.target.value }))
                }
                className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none md:col-span-2"
              />
              <input
                type="text"
                placeholder="City"
                value={shipping.city}
                onChange={(event) => setShipping((prev) => ({ ...prev, city: event.target.value }))}
                className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
              />
              <input
                type="text"
                placeholder="State"
                value={shipping.state}
                onChange={(event) =>
                  setShipping((prev) => ({ ...prev, state: event.target.value }))
                }
                className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={shipping.postal_code}
                onChange={(event) =>
                  setShipping((prev) => ({ ...prev, postal_code: event.target.value }))
                }
                className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
              />
              <input
                type="text"
                placeholder="Country"
                value={shipping.country}
                onChange={(event) =>
                  setShipping((prev) => ({ ...prev, country: event.target.value }))
                }
                className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
              />
            </div>
          </div>

          <div className="lux-card space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-sand">Payment</p>
            <div className="grid gap-3">
              {paymentOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm cursor-pointer ${
                    paymentMethod === option.id ? "border-gold bg-gold/10" : "border-black/10"
                  }`}
                >
                  <span>{option.label}</span>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)}
                  />
                </label>
              ))}
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-4 text-sm text-sand">
              Payment is captured on dispatch. Use the admin panel for payment reconciliation.
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="lux-card space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-sand">Order Summary</p>
            <div className="space-y-4">
              {cartItems.length === 0 && <p className="text-sand text-sm">Your cart is empty.</p>}
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={getPrimaryImage(item)}
                    alt={item.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-display">{item.name}</p>
                    <p className="text-xs text-sand">
                      Qty {item.quantity}
                      {item.selected_size ? ` · Size ${item.selected_size}` : ""}
                      {item.selected_color ? ` · ${item.selected_color}` : ""}
                    </p>
                  </div>
                  <p className="text-sm text-gold">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-black/10 pt-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at dispatch</span>
              </div>
              <div className="flex justify-between font-display text-lg">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>

          {checkoutError && (
            <div className="lux-card text-red-400 text-sm">
              Unable to place order. Please verify your details.
            </div>
          )}

          <button
            className="lux-button w-full"
            disabled={!token || cartItems.length === 0 || placingOrder || !isShippingValid}
            onClick={handleCheckout}
          >
            {placingOrder ? "Placing Order" : "Place Order"}
          </button>
          {!token && <p className="text-xs text-sand">Sign in required to place an order.</p>}
          {token && !isShippingValid && (
            <p className="text-xs text-sand">Complete the shipping address to continue.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
