import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Gem, Globe, ShieldCheck, ArrowRight } from "lucide-react";
import {
  categories,
  ramadanCollections,
  bestSelling,
  testimonials,
  gallery
} from "../data/mockData.js";
import SectionHeader from "../components/SectionHeader.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useGetCategoriesQuery, useGetProductsQuery } from "../store/api.js";
import { normalizeProductsResponse } from "../utils/format.js";

const Home = () => {
  const { data: apiProducts } = useGetProductsQuery({ is_best_seller: true, page_size: 8 });
  const { data: apiCategories } = useGetCategoriesQuery();
  const apiBest = normalizeProductsResponse(apiProducts).items;
  const bestSellingProducts = apiBest.length ? apiBest : bestSelling;
  const featuredCategories = apiCategories?.length ? apiCategories.slice(0, 12) : categories;
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-24">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern"></div>
        <div className="absolute inset-0 pattern-grid opacity-40"></div>
        <div className="lux-container relative grid gap-12 py-24 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-7"
          >
            <div className="flex items-center gap-4">
              <span className="badge">Ramzan Ready Collection</span>
              <span className="text-xs uppercase tracking-[0.3em] text-sand">Bangalore</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-tight">
              Luxury Islamic Fashion
              <span className="block text-gold">for Modern Modesty</span>
            </h1>
            <p className="text-sand max-w-xl text-lg">
              Discover curated abayas, hijabs, and lifestyle essentials crafted with refined
              fabrics, elegant tailoring, and timeless Islamic aesthetics.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="lux-button">Shop Collection</button>
              <button className="lux-outline">Explore Abayas</button>
            </div>
            <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.3em] text-sand">
              <span>120+ Curated Pieces</span>
              <span>Premium Fabrics</span>
              <span>Worldwide Shipping</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 -top-6 h-24 w-24 rounded-full border border-gold/40 opacity-40"
            ></motion.div>
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 right-4 h-28 w-28 rounded-full border border-emerald/60 opacity-50"
            ></motion.div>
            <div className="grid gap-6">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-black/10 bg-white p-4 shadow-soft">
                <img
                  src="https://images.unsplash.com/photo-1503342452485-86b7f54527ef?auto=format&fit=crop&w=1000&q=80&fm=webp"
                  alt="Adams Ramadan Edit"
                  className="h-[420px] w-full rounded-[2rem] object-cover"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-black/10 bg-white p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-sand">Featured Edit</p>
                  <p className="font-display text-xl">Noor Luxe Abaya</p>
                  <p className="text-gold text-lg mt-2">INR 3,499</p>
                </div>
                <div className="rounded-3xl border border-black/10 bg-white p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-sand">New Season</p>
                  <p className="font-display text-xl">Emerald Silk Hijab</p>
                  <button className="text-gold text-xs uppercase tracking-[0.3em] mt-3">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className="marquee py-4">
          <div className="marquee-track">
            {["Ramadan Sale is Live", "Exclusive Abaya Edit", "Luxury Gift Wrap"].map(
              (item, index) => (
                <span key={`ticker-${index}`} className="marquee-item">
                  {item}
                </span>
              )
            )}
            {["Ramadan Sale is Live", "Exclusive Abaya Edit", "Luxury Gift Wrap"].map(
              (item, index) => (
                <span key={`ticker-repeat-${index}`} className="marquee-item">
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <section className="lux-container space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-subtitle">Shop By Style</p>
            <h2 className="section-title">Signature Categories</h2>
          </div>
          <button className="hidden md:inline-flex text-gold text-xs uppercase tracking-[0.3em]">
            View All
          </button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {featuredCategories.map((category) => (
            <motion.div
              key={`circle-${category.id}`}
              whileHover={{ y: -6 }}
              className="flex min-w-[140px] flex-col items-center gap-3"
            >
              <div className="relative h-28 w-28 overflow-hidden rounded-full border border-black/20 shadow-soft">
                <img
                  src={category.image || category.image_url}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-sm text-ink">{category.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="lux-container space-y-10">
        <SectionHeader
          eyebrow="Categories"
          title="Featured Collections"
          description="Explore signature categories curated for modest luxury living."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section id="about" className="lux-container grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <SectionHeader eyebrow="Our Story" title="About Adams" />
          <p className="text-sand">
            Adams - The Islamic Boutique is a premium modest fashion brand offering curated
            Islamic clothing and lifestyle essentials. Our mission is to bring elegance,
            modesty, and authenticity together in every collection.
          </p>
          <div className="flex gap-4">
            <div className="lux-card flex-1">
              <p className="text-xs uppercase tracking-[0.3em] text-sand">Luxury</p>
              <p className="font-display text-lg">Handpicked Fabrics</p>
            </div>
            <div className="lux-card flex-1">
              <p className="text-xs uppercase tracking-[0.3em] text-sand">Craft</p>
              <p className="font-display text-lg">Artisan Finishing</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl border border-gold/30 translate-x-4 -translate-y-4"></div>
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80&fm=webp"
            alt="Adams Boutique"
            className="relative h-full w-full rounded-3xl object-cover shadow-soft"
          />
        </div>
      </section>

      <section className="lux-container space-y-10">
        <SectionHeader
          eyebrow="Ramadan"
          title="Ramadan Collection"
          description="Curated ensembles for sacred gatherings, iftars, and Umrah journeys."
        />
        <div className="flex gap-6 overflow-x-auto pb-4">
          {ramadanCollections.map((collection) => (
            <motion.div
              key={collection.id}
              whileHover={{ y: -6 }}
              className="min-w-[280px] md:min-w-[360px] overflow-hidden rounded-3xl border border-black/10 bg-white"
            >
              <img src={collection.image} alt={collection.title} className="h-52 w-full object-cover" />
              <div className="p-6 space-y-2">
                <h3 className="font-display text-xl">{collection.title}</h3>
                <p className="text-sand text-sm">{collection.description}</p>
                <button className="text-gold text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                  Explore <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="lux-container space-y-10">
        <SectionHeader
          eyebrow="Bestsellers"
          title="Best Selling Products"
          description="Refined silhouettes loved by the Adams community."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {bestSellingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="lux-container space-y-10">
        <SectionHeader
          eyebrow="Why Adams"
          title="Why Choose Adams"
          description="Luxury craftsmanship, modest elegance, and trusted quality." 
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Crown size={28} />, title: "Premium Fabric" },
            { icon: <Gem size={28} />, title: "Elegant Modesty" },
            { icon: <Globe size={28} />, title: "Global Islamic Fashion" },
            { icon: <ShieldCheck size={28} />, title: "Trusted Quality" }
          ].map((item) => (
            <div key={item.title} className="lux-card space-y-4">
              <div className="text-gold">{item.icon}</div>
              <h3 className="font-display text-lg">{item.title}</h3>
              <p className="text-sand text-sm">
                Crafted to honor tradition with modern luxury silhouettes and refined details.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="lux-container space-y-8">
        <SectionHeader
          eyebrow="Testimonials"
          title="Customer Stories"
          description="Loved by women who appreciate elegant modest fashion."
        />
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-8">
          <motion.div
            key={activeTestimonial}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-xl font-display">"{testimonials[activeTestimonial].text}"</p>
            <p className="text-sm uppercase tracking-[0.3em] text-sand">
              {testimonials[activeTestimonial].name} - {testimonials[activeTestimonial].location}
            </p>
          </motion.div>
          <div className="mt-6 flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`h-2 w-10 rounded-full ${
                  index === activeTestimonial ? "bg-gold" : "bg-black/10"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      <section className="lux-container space-y-10">
        <SectionHeader
          eyebrow="Instagram"
          title="Adams Lifestyle Gallery"
          description="Follow the Adams modest luxury journey."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {gallery.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="overflow-hidden rounded-3xl border border-black/10"
            >
              <img src={item.image} alt="Adams lifestyle" className="h-64 w-full object-cover" />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
