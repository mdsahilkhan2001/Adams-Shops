import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Heart, Search, ShoppingBag, User, ShieldCheck, Menu, X } from "lucide-react";

const menuItems = [
  { label: "Home", to: "/" },
  { label: "Eid-26 Collection", to: "/eid-26-collection" },
  { label: "New", to: "/new" },
  { label: "Men", to: "/men" },
  { label: "Bestsellers", to: "/bestsellers" },
  { label: "Abayas", to: "/abayas" },
  { label: "Hajj-Umrah", to: "/hajj-umrah" },
  { label: "Kaftans", to: "/kaftans" },
  { label: "Hijabs", to: "/hijabs" },
  { label: "Kids", to: "/kids" },
  { label: "Clothing", to: "/clothing" },
  { label: "Turkish Abaya", to: "/turkish-abaya" },
  { label: "Accessories", to: "/accessories" },
  { label: "Sale", to: "/sale", accent: true },
  { label: "Winter Wear", to: "/winter-wear" }
];

const Header = ({ cartCount }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-black/10">
      <div className="lux-container flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border border-gold/60 flex items-center justify-center text-gold font-display">
              A
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-lg text-ink">Adams</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-sand">Islamic Boutique</p>
            </div>
          </Link>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-full border border-black/10 p-2 text-ink lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className="hidden flex-1 items-center justify-center gap-4 text-[11px] uppercase tracking-[0.28em] text-ink lg:flex lg:flex-wrap">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap transition ${
                  item.accent ? "text-gold font-semibold" : isActive ? "text-gold font-semibold" : "hover:text-gold"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button className="p-2 rounded-full border border-black/10 hover:border-gold/40" title="Search" aria-label="Search">
            <Search size={18} />
          </button>
          <Link
            to="/admin/login"
            className="p-2 rounded-full border border-black/10 hover:border-gold/40"
            title="Admin Panel"
            aria-label="Admin panel"
          >
            <ShieldCheck size={18} />
          </Link>
          <Link to="/account" className="p-2 rounded-full border border-black/10 hover:border-gold/40" aria-label="Account">
            <User size={18} />
          </Link>
          <button className="p-2 rounded-full border border-black/10 hover:border-gold/40" aria-label="Wishlist">
            <Heart size={18} />
          </button>
          <Link to="/cart" className="relative p-2 rounded-full border border-black/10 hover:border-gold/40" aria-label="Cart">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gold text-white text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/10 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm uppercase tracking-[0.3em] transition ${
                    item.accent ? "text-gold font-semibold" : isActive ? "bg-black/5 text-ink" : "text-sand hover:bg-black/5"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/account" className="rounded-full border border-black/10 px-4 py-3 text-sm uppercase tracking-[0.3em] text-sand" onClick={() => setOpen(false)}>
                Account
              </Link>
              <Link to="/cart" className="rounded-full border border-black/10 px-4 py-3 text-sm uppercase tracking-[0.3em] text-sand" onClick={() => setOpen(false)}>
                Cart
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
