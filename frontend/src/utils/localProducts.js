export const LOCAL_PRODUCTS_EVENT = "adams:local-products-changed";

const STORAGE_KEY = "adams_local_products";

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;

export const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const notifyProductsChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(LOCAL_PRODUCTS_EVENT));
  }
};

export const getLocalProducts = () => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

const saveLocalProducts = (products) => {
  if (!canUseStorage()) {
    return products;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  notifyProductsChanged();
  return products;
};

export const findCategoryOption = (categoryValue, categories = []) => {
  const value = String(categoryValue);
  return categories.find((category) => {
    const id = category.id == null ? "" : String(category.id);
    const slug = category.slug || slugify(category.name);
    return id === value || slug === value || category.name === categoryValue;
  });
};

const normalizeLocalProduct = (product, categories = []) => {
  const category = findCategoryOption(product.category, categories);
  const categoryName = category?.name || product.category_name || product.category || "";
  const categorySlug = category?.slug || product.category_slug || slugify(categoryName);
  const image = product.image_url || product.image || product.images?.[0]?.image_url || "";

  return {
    ...product,
    id: product.id || `local-${Date.now()}`,
    slug: product.slug || slugify(product.name),
    category: category?.id || product.category,
    category_name: categoryName,
    category_slug: categorySlug,
    price: Number(product.price) || 0,
    compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : null,
    stock: Number(product.stock) || 0,
    sizes: product.sizes || [],
    colors: product.colors || [],
    image,
    images: image ? [{ image_url: image, alt_text: product.name, is_primary: true }] : [],
    is_featured: Boolean(product.is_featured),
    is_best_seller: Boolean(product.is_best_seller),
    isLocal: true
  };
};

export const createLocalProduct = (payload, categories = []) => {
  const product = normalizeLocalProduct(
    {
      ...payload,
      id: `local-${Date.now()}`
    },
    categories
  );
  saveLocalProducts([product, ...getLocalProducts()]);
  return product;
};

export const updateLocalProduct = (id, payload, categories = []) => {
  const products = getLocalProducts();
  const nextProducts = products.map((product) =>
    String(product.id) === String(id)
      ? normalizeLocalProduct({ ...product, ...payload, id: product.id }, categories)
      : product
  );
  saveLocalProducts(nextProducts);
  return nextProducts.find((product) => String(product.id) === String(id));
};

export const deleteLocalProduct = (id) => {
  saveLocalProducts(getLocalProducts().filter((product) => String(product.id) !== String(id)));
};

export const mergeProducts = (...groups) => {
  const seen = new Set();
  return groups
    .flat()
    .filter(Boolean)
    .filter((product) => {
      const key = String(product.id || product.slug || product.name);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
};

export const productMatchesFilters = (product, filters = {}) => {
  const { search = "", activeCategory = "all", minPrice = "", maxPrice = "" } = filters;
  const query = search.trim().toLowerCase();
  const categoryName = product.category_name || product.category || "";
  const categorySlug = product.category_slug || slugify(categoryName);
  const normalizedActiveCategory = String(activeCategory).toLowerCase();
  const compactCategorySlug = categorySlug.replace(/-/g, "");
  const compactActiveCategory = normalizedActiveCategory.replace(/-/g, "");
  const priceValue = Number(product.price) || 0;

  const matchesSearch = query ? product.name?.toLowerCase().includes(query) : true;
  const matchesCategory =
    activeCategory === "all" ||
    categorySlug === normalizedActiveCategory ||
    compactCategorySlug === compactActiveCategory ||
    categoryName.toLowerCase() === normalizedActiveCategory ||
    String(product.category) === String(activeCategory);
  const matchesMin = minPrice ? priceValue >= Number(minPrice) : true;
  const matchesMax = maxPrice ? priceValue <= Number(maxPrice) : true;

  return matchesSearch && matchesCategory && matchesMin && matchesMax;
};
