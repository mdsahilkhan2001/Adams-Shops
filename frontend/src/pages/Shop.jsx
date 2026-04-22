import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import SectionHeader from "../components/SectionHeader.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { categories, products as mockProducts } from "../data/mockData.js";
import { useGetCategoriesQuery, useGetProductsQuery } from "../store/api.js";
import { normalizeProductsResponse } from "../utils/format.js";

const Shop = () => {
  const pageSize = 12;
  const { data: apiCategories } = useGetCategoriesQuery();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ordering, setOrdering] = useState("");
  const [page, setPage] = useState(1);

  const params = {
    page,
    page_size: pageSize
  };

  if (search.trim()) {
    params.search = search.trim();
  }
  if (activeCategory !== "all") {
    params.category_slug = activeCategory;
  }
  if (minPrice) {
    params.min_price = minPrice;
  }
  if (maxPrice) {
    params.max_price = maxPrice;
  }
  if (ordering) {
    params.ordering = ordering;
  }

  const { data, isError, isFetching } = useGetProductsQuery(params);

  useEffect(() => {
    setPage(1);
  }, [search, activeCategory, minPrice, maxPrice, ordering]);

  const { items: apiProducts, count, next, previous } = normalizeProductsResponse(data);
  const products = !isError ? apiProducts : mockProducts;
  const categoryList = apiCategories?.length ? apiCategories : categories;
  const useApiResults = !isError;

  const filtered = useMemo(() => {
    if (useApiResults) {
      return products;
    }
    return products.filter((product) => {
      const categorySlug = product.slug || (product.category || "").toLowerCase().replace(/\s+/g, "-");
      const categoryName = product.category_name || product.category;
      const matchesCategory =
        activeCategory === "all" ||
        categorySlug === activeCategory ||
        categoryName === activeCategory;
      const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase());
      const priceValue = Number(product.price) || 0;
      const matchesMin = minPrice ? priceValue >= Number(minPrice) : true;
      const matchesMax = maxPrice ? priceValue <= Number(maxPrice) : true;
      return matchesCategory && matchesSearch && matchesMin && matchesMax;
    });
  }, [products, search, activeCategory, minPrice, maxPrice, useApiResults]);

  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  return (
    <div className="lux-container py-16 space-y-10">
      <SectionHeader
        eyebrow="Shop"
        title="Luxury Modest Fashion"
        description="Find curated collections for every sacred celebration."
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2">
          <Search size={16} className="text-sand" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search for abayas, hijabs, kurtas"
            className="bg-transparent text-sm text-ink outline-none placeholder:text-sand w-72"
          />
        </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                activeCategory === "all" ? "border-gold bg-gold text-obsidian" : "border-black/20"
              }`}
            >
              All
            </button>
            {categoryList.slice(0, 6).map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.slug || category.name)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                  activeCategory === (category.slug || category.name)
                    ? "border-gold bg-gold text-obsidian"
                    : "border-black/20"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.3em] text-sand">Min Price</label>
            <input
              type="number"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="0"
              className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.3em] text-sand">Max Price</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="8000"
              className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.3em] text-sand">Sort By</label>
            <select
              value={ordering}
              onChange={(event) => setOrdering(event.target.value)}
              className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
            >
              <option value="">Featured</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-created_at">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {useApiResults && !isFetching && filtered.length === 0 && (
        <div className="lux-card text-center text-sand">No products match your filters.</div>
      )}
      {isFetching && (
        <div className="lux-card text-center text-sand">Loading curated pieces...</div>
      )}
      {useApiResults && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white px-6 py-4">
          <p className="text-sm text-sand">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={!previous}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={!next}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
