import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection.jsx";
import FAQSection from "../components/FAQSection.jsx";
import Newsletter from "../components/Newsletter.jsx";
import ProductCard from "../components/ProductCard.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import SEO from "../components/SEO.jsx";
import { categoryPages } from "../data/categoryConfig.js";

const CategoryPage = ({ pageKey }) => {
  const page = categoryPages[pageKey];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer);
  }, [pageKey]);

  if (!page) {
    return (
      <div className="lux-container py-24 text-center">
        <p className="section-subtitle">Page Missing</p>
        <h1 className="section-title gold-underline">Content Not Found</h1>
        <p className="text-sand mt-4">The category you're looking for is unavailable.</p>
        <Link to="/" className="lux-button mt-8 inline-flex">
          Return Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <SEO title={`${page.title} | Adams Islamic Boutique`} description={page.description} />
      <HeroSection
        title={page.title}
        subtitle={page.subtitle}
        image={page.heroImage}
        ctaText="Shop Collection"
        ctaTo="/shop"
      />

      <section className="lux-container py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-start">
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Category"
              title={page.title}
              description={page.description}
            />
            {page.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-sand leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-sand">Why Choose This Category</p>
            <div className="mt-6 space-y-4">
              {page.benefits.map((benefit) => (
                <div key={benefit.title} className="rounded-3xl border border-black/10 bg-paper p-5">
                  <h3 className="font-semibold text-ink">{benefit.title}</h3>
                  <p className="text-sand mt-2">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="lux-container py-16">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="section-subtitle">Featured Products</p>
            <h2 className="section-title gold-underline">Shop the Best Picks</h2>
          </div>
          <p className="text-sm text-sand">{page.products.length} products available</p>
        </div>

        {page.products.length === 0 ? (
          <div className="lux-card mt-8 text-center">
            <p>No products available in this category.</p>
            <Link to="/" className="lux-button mt-6 inline-flex">
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {page.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="lux-container py-16">
        <FAQSection faqs={page.faqs} />
      </section>

      <section className="lux-container py-16">
        <div className="space-y-6">
          <p className="section-subtitle">Related Categories</p>
          <h2 className="section-title gold-underline">Explore More</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {page.related.map((related) => (
              <Link
                key={related.title}
                to={related.path}
                className="group overflow-hidden rounded-3xl border border-black/10 bg-white transition hover:border-gold hover:shadow-soft"
                aria-label={`Go to ${related.title}`}
              >
                <div className="h-48 overflow-hidden bg-slate-100">
                  <img
                    src={related.image}
                    alt={related.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(event) => {
                      event.target.onerror = null;
                      event.target.src = "https://via.placeholder.com/600x400?text=No+Image";
                    }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-ink">{related.title}</h3>
                  <p className="text-sand text-sm mt-2">View curated products and new arrivals.</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
};

const SectionHeader = ({ eyebrow, title, description }) => (
  <div className="space-y-4">
    {eyebrow && <span className="section-subtitle">{eyebrow}</span>}
    <h2 className="section-title gold-underline">{title}</h2>
    {description && <p className="text-sand max-w-2xl">{description}</p>}
  </div>
);

export default CategoryPage;
