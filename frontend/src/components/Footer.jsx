import { Instagram, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-black/10 bg-white">
      <div className="lux-container grid gap-10 py-16 md:grid-cols-4">
        <div className="space-y-4">
          <h3 className="font-display text-xl">Adams</h3>
          <p className="text-sand text-sm">
            Luxury Islamic fashion and lifestyle essentials inspired by modern modesty.
          </p>
          <a className="lux-button" href="https://wa.me/919000000000" target="_blank" rel="noreferrer">
            WhatsApp Order
          </a>
        </div>
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-sand">Shop</p>
          <ul className="space-y-2 text-sm text-ink">
            <li>Abayas</li>
            <li>Hijabs</li>
            <li>Men's Kurtas</li>
            <li>Perfumes & Attars</li>
          </ul>
        </div>
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-sand">Support</p>
          <ul className="space-y-2 text-sm text-ink">
            <li>Order Tracking</li>
            <li>Size Guide</li>
            <li>Shipping & Returns</li>
            <li>Contact Concierge</li>
          </ul>
          <a
            href="https://instagram.com/adams.islamic.boutique"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-gold text-sm"
          >
            <Instagram size={16} /> @adams.islamic.boutique
          </a>
        </div>
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-sand">Visit</p>
          <p className="text-sm text-ink flex items-center gap-2">
            <MapPin size={16} /> Bangalore, India
          </p>
          <p className="text-sm text-ink flex items-center gap-2">
            <Phone size={16} /> +91 90000 00000
          </p>
          <div className="overflow-hidden rounded-2xl border border-black/10">
            <iframe
              title="Adams Bangalore"
              src="https://maps.google.com/maps?q=Bangalore&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="h-32 w-full"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="border-t border-black/10">
        <div className="lux-container flex flex-col md:flex-row items-center justify-between py-6 text-xs uppercase tracking-[0.3em] text-sand">
          <p>Adams - The Islamic Boutique</p>
          <p>Luxury Modest Fashion</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
