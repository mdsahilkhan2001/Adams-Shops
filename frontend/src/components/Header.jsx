import { Link } from "react-router-dom";
import { Heart, Search, ShoppingBag, User, ShieldCheck } from "lucide-react";

const menuItems = [
  { label: "Home", to: "/" },
  { label: "Eid-26 Collection", to: "/shop" },
  { label: "New", to: "/shop" },
  { label: "Men", to: "/shop" },
  { label: "Bestsellers", to: "/shop" },
  { label: "Abayas", to: "/shop" },
  { label: "Hajj-Umrah", to: "/shop" },
  { label: "Kaftans", to: "/shop" },
  { label: "Hijabs", to: "/shop" },
  { label: "Kids", to: "/shop" },
  { label: "Clothing", to: "/shop" },
  { label: "Turkish Abaya", to: "/shop" },
  { label: "Accessories", to: "/shop" },
  { label: "Sale", to: "/shop", accent: true },
  { label: "Winter Wear", to: "/shop" }
];

const Header = ({ cartCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-black/10">
      <div className="lux-container flex items-center gap-6 py-5">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-gold/60 flex items-center justify-center text-gold font-display">
            A
          </div>
          <div>
            <p className="font-display text-lg text-ink">Adams</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-sand">Islamic Boutique</p>
          </div>
        </Link>
        <nav className="hidden lg:flex flex-1 flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.28em] text-ink">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`whitespace-nowrap transition ${
                item.accent ? "text-gold font-semibold" : "hover:text-gold"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full border border-black/10 hover:border-gold/40" title="Search">
            <Search size={18} />
          </button>
          <Link
            to="/admin/login"
            className="p-2 rounded-full border border-black/10 hover:border-gold/40"
            title="Admin Panel"
          >
            <ShieldCheck size={18} />
          </Link>
          <Link to="/account" className="p-2 rounded-full border border-black/10 hover:border-gold/40">
            <User size={18} />
          </Link>
          <button className="p-2 rounded-full border border-black/10 hover:border-gold/40">
            <Heart size={18} />
          </button>
          <Link to="/cart" className="relative p-2 rounded-full border border-black/10 hover:border-gold/40">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold text-white text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
