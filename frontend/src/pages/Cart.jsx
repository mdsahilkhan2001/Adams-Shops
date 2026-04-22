import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader.jsx";
import { formatPrice } from "../utils/format.js";

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="lux-container py-16 space-y-10">
      <SectionHeader
        eyebrow="Cart"
        title="Your Luxury Cart"
        description="Review your selected pieces before checkout."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.length === 0 ? (
            <div className="lux-card">Your cart is empty.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="lux-card flex items-center gap-6">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="font-display text-lg">{item.name}</p>
                  <p className="text-sand text-sm">Qty {item.quantity}</p>
                </div>
                <p className="text-gold font-semibold">{formatPrice(item.price)}</p>
              </div>
            ))
          )}
        </div>
        <div className="lux-card space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">Summary</p>
          <div className="flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex items-center justify-between text-lg font-display">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Link to="/checkout" className="lux-button w-full text-center">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
