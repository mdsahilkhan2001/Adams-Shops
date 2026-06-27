import { Link } from "react-router-dom";
import ImageWithFallback from "./ImageWithFallback.jsx";

const HeroSection = ({ title, subtitle, ctaText = "Shop Now", ctaTo = "/shop", image }) => {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="lux-container grid gap-10 py-20 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="section-subtitle">Collection</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight text-ink">{title}</h1>
          <p className="max-w-2xl text-sand text-lg">{subtitle}</p>
          <Link to={ctaTo} className="lux-button inline-flex items-center justify-center px-8 py-3">
            {ctaText}
          </Link>
        </div>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-black/10 bg-white shadow-soft">
          <ImageWithFallback
            src={image}
            alt={title}
            className="h-[420px] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
