import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const Layout = ({ children }) => {
  const cartCount = useSelector((state) => state.cart.items.length);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="bg-gold text-white text-[11px] uppercase tracking-[0.35em] border-b border-black/10">
        <div className="marquee py-2">
          <div className="marquee-track">
            {[
              "Shop: USA, UK, AU & Canada",
              "Free Shipping Above ₹500",
              "Ramadan Sale is Live",
              "Worldwide Delivery"
            ].map((item, index) => (
              <span key={`marquee-${index}`} className="marquee-item">
                {item}
              </span>
            ))}
            {[
              "Shop: USA, UK, AU & Canada",
              "Free Shipping Above ₹500",
              "Ramadan Sale is Live",
              "Worldwide Delivery"
            ].map((item, index) => (
              <span key={`marquee-repeat-${index}`} className="marquee-item">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Header cartCount={cartCount} />
      <main className="relative overflow-hidden">{children || <Outlet />}</main>
      <Footer />
    </div>
  );
};

export default Layout;
