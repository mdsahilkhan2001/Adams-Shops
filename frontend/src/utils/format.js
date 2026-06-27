export const formatPrice = (value, currency = "INR") => {
  const amount = Number(value);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `${currency} ${safeAmount.toLocaleString("en-IN")}`;
};

export const formatCurrency = (value, currency = "INR") => {
  const amount = Number(value);
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(safeAmount);
};

export const formatDashboardValue = (value, kind = "count") => {
  if (kind === "currency") {
    return formatCurrency(value);
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toLocaleString("en-IN") : "0";
};

export const formatGrowthLabel = (value) => {
  if (value === null || value === undefined || value === "") {
    return "0%";
  }

  return String(value);
};

export const validateImageFile = (file) => {
  if (!file) {
    return "Please choose an image file.";
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return "Only JPG, JPEG, PNG, and WEBP files are allowed.";
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return "Images must be 5MB or smaller.";
  }

  return "";
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
