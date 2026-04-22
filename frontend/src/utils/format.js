export const formatPrice = (value, currency = "INR") => {
  const amount = Number(value);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `${currency} ${safeAmount.toLocaleString("en-IN")}`;
};

export const getPrimaryImage = (product) => {
  if (!product) {
    return "";
  }
  if (product.image) {
    return product.image;
  }
  const images = product.images || [];
  const primary = images.find((item) => item.is_primary) || images[0];
  return primary?.image_url || "";
};

export const normalizeProductsResponse = (data) => {
  if (!data) {
    return { items: [], count: 0, next: null, previous: null };
  }
  if (Array.isArray(data)) {
    return { items: data, count: data.length, next: null, previous: null };
  }
  return {
    items: data.results || [],
    count: data.count ?? (data.results ? data.results.length : 0),
    next: data.next || null,
    previous: data.previous || null
  };
};
