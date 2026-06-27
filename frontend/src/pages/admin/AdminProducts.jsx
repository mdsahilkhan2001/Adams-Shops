import { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import {
  useCreateProductImageMutation,
  useCreateProductMutation,
  useDeleteProductImageMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useUpdateProductMutation,
  useUploadImageMutation
} from "../../store/api.js";
import { categories as starterCategories } from "../../data/mockData.js";
import { useLocalProducts } from "../../hooks/useLocalProducts.js";
import { normalizeProductsResponse } from "../../utils/format.js";
import { formatCurrency, validateImageFile } from "../../utils/format.js";
import {
  createLocalProduct,
  deleteLocalProduct,
  mergeProducts,
  updateLocalProduct
} from "../../utils/localProducts.js";

const emptyForm = {
  name: "",
  slug: "",
  category: "",
  price: "",
  compare_at_price: "",
  stock: "",
  description: "",
  sizes: "",
  colors: "",
  image_url: "",
  is_featured: false,
  is_best_seller: false
};

const parseList = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const AdminProducts = () => {
  const { data: categories } = useGetCategoriesQuery();
  const localProducts = useLocalProducts();
  const [page, setPage] = useState(1);
  const { data } = useGetProductsQuery({ page, page_size: 20, ordering: "-created_at" });
  const { items: products, count, next, previous } = normalizeProductsResponse(data);
  const apiCategories = Array.isArray(categories) ? categories : categories?.results || [];
  const categoryOptions = apiCategories.length ? apiCategories : starterCategories;
  const displayedProducts = useMemo(
    () => mergeProducts(localProducts, products),
    [localProducts, products]
  );
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [existingImageId, setExistingImageId] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadedImagePath, setUploadedImagePath] = useState("");
  const [removedImage, setRemovedImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [createImage] = useCreateProductImageMutation();
  const [deleteProductImage] = useDeleteProductImageMutation();
  const [uploadImage] = useUploadImageMutation();

  const totalProductsCount = (count || 0) + localProducts.length;
  const totalPages = useMemo(
    () => (count ? Math.ceil((count + localProducts.length) / 20) : 1),
    [count, localProducts.length]
  );

  useEffect(() => {
    if (editingId && displayedProducts.length) {
      const product = displayedProducts.find((item) => String(item.id) === String(editingId));
      if (product) {
        const primaryImage = product.images?.find((item) => item.is_primary) || product.images?.[0] || null;
        const preview = primaryImage?.image_url || product.image || "";

        setForm({
          name: product.name || "",
          slug: product.slug || "",
          category: product.category || "",
          price: product.price || "",
          compare_at_price: product.compare_at_price || "",
          stock: product.stock || "",
          description: product.description || "",
          sizes: (product.sizes || []).join(", "),
          colors: (product.colors || []).join(", "),
          image_url: preview,
          is_featured: product.is_featured || false,
          is_best_seller: product.is_best_seller || false
        });
        setExistingImageUrl(preview);
        setExistingImageId(primaryImage?.id || null);
        setImagePreview(preview);
        setUploadedImageUrl("");
        setUploadedImagePath("");
        setRemovedImage(false);
        setImageError("");
      }
    }
  }, [editingId, displayedProducts]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImagePreview("");
    setExistingImageUrl("");
    setExistingImageId(null);
    setUploadedImageUrl("");
    setUploadedImagePath("");
    setRemovedImage(false);
    setImageError("");
    setUploadingImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const validationMessage = validateImageFile(file);
    if (validationMessage) {
      setImageError(validationMessage);
      return;
    }

    setUploadingImage(true);
    setImageError("");

    try {
      const result = await uploadImage({ file }).unwrap();
      setUploadedImageUrl(result.url);
      setUploadedImagePath(result.path);
      setImagePreview(result.url);
      setRemovedImage(false);
      setForm((prev) => ({ ...prev, image_url: result.path }));
      setNotice("");
    } catch (error) {
      setImageError(
        error?.data?.file ||
          error?.data?.message ||
          "Image upload failed. Please try again."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageError("");
    setUploadedImageUrl("");
    setUploadedImagePath("");
    setImagePreview("");
    setForm((prev) => ({ ...prev, image_url: "" }));
    setRemovedImage(Boolean(editingId && (existingImageId || existingImageUrl)));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNotice("");
    setErrorMessage("");

    const payload = {
      name: form.name,
      slug: form.slug,
      category: Number(form.category) || form.category,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      stock: Number(form.stock),
      description: form.description,
      sizes: parseList(form.sizes),
      colors: parseList(form.colors),
      is_featured: form.is_featured,
      is_best_seller: form.is_best_seller
    };

    const imagePathToPersist =
      uploadedImagePath || (editingId ? existingImageUrl : "") || form.image_url || "";
    const shouldReplaceExistingImage =
      Boolean(editingId && existingImageId && imagePathToPersist && imagePathToPersist !== existingImageUrl);
    const shouldRemoveExistingImage =
      Boolean(editingId && existingImageId && removedImage && !uploadedImagePath);

    const localPayload = {
      ...payload,
      image_url: removedImage ? "" : imagePreview || uploadedImageUrl || existingImageUrl || ""
    };

    try {
      if (editingId && String(editingId).startsWith("local-")) {
        updateLocalProduct(editingId, localPayload, categoryOptions);
        resetForm();
        setNotice("Product updated locally.");
        return;
      }

      if (editingId) {
        const product = await updateProduct({ id: editingId, ...payload }).unwrap();

        if (shouldReplaceExistingImage) {
          await deleteProductImage(existingImageId).unwrap();
        } else if (shouldRemoveExistingImage) {
          await deleteProductImage(existingImageId).unwrap();
        }

        if (uploadedImagePath) {
          await createImage({
            product: product.id,
            image_url: uploadedImagePath,
            alt_text: product.name,
            is_primary: true
          }).unwrap();
        }

        setNotice("Product updated successfully.");
      } else {
        const product = await createProduct(payload).unwrap();
        if (uploadedImagePath) {
          await createImage({
            product: product.id,
            image_url: uploadedImagePath,
            alt_text: product.name,
            is_primary: true
          }).unwrap();
        }
        setNotice("Product created successfully.");
      }

      resetForm();
    } catch (error) {
      if (editingId && String(editingId).startsWith("local-")) {
        updateLocalProduct(editingId, localPayload, categoryOptions);
        resetForm();
        setNotice("Product updated locally.");
      } else if (!editingId) {
        createLocalProduct(localPayload, categoryOptions);
        resetForm();
        setNotice("Product saved locally and is visible in the storefront.");
      } else {
        setErrorMessage(
          error?.data?.detail ||
            error?.data?.message ||
            error?.data?.file ||
            "Product could not be saved. Check backend access and try again."
        );
      }
    }
  };

  const handleDelete = async (product) => {
    setNotice("");
    setErrorMessage("");

    if (String(product.id).startsWith("local-")) {
      deleteLocalProduct(product.id);
      setNotice("Local product deleted.");
      return;
    }

    try {
      await deleteProduct(product.id).unwrap();
      setNotice("Product deleted.");
    } catch (error) {
      setErrorMessage(error?.data?.detail || "Product could not be deleted.");
    }
  };

  return (
    <AdminLayout title="Products">
      <div className="grid gap-8 lg:grid-cols-[380px,1fr]">
        <form onSubmit={handleSubmit} className="lux-card space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">
            {editingId ? "Edit Product" : "Add Product"}
          </p>
          {notice && <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{notice}</p>}
          {errorMessage && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
          )}
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Product name"
            className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
            required
          />
          <input
            value={form.slug}
            onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
            placeholder="Slug (unique)"
            className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
            required
          />
          <select
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
            required
          >
            <option value="">Select category</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              placeholder="Price"
              type="number"
              className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
              required
            />
            <input
              value={form.compare_at_price}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, compare_at_price: event.target.value }))
              }
              placeholder="Compare at"
              type="number"
              className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
            />
          </div>
          <input
            value={form.stock}
            onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
            placeholder="Stock"
            type="number"
            className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
            required
          />
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Description"
            className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none min-h-[120px]"
            required
          />
          <input
            value={form.sizes}
            onChange={(event) => setForm((prev) => ({ ...prev, sizes: event.target.value }))}
            placeholder="Sizes (S, M, L)"
            className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
          />
          <input
            value={form.colors}
            onChange={(event) => setForm((prev) => ({ ...prev, colors: event.target.value }))}
            placeholder="Colors (Emerald, Sand)"
            className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
          />

          <div className="rounded-3xl border border-dashed border-black/10 bg-slate-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-24 w-24 overflow-hidden rounded-2xl bg-white shadow-sm">
                {imagePreview ? (
                  <img src={imagePreview} alt="Product preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-slate-400">
                    No image selected
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">Primary image</p>
                  <p className="text-xs text-slate-500">JPG, JPEG, PNG, or WEBP up to 5MB.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-black/20 hover:bg-slate-50 disabled:opacity-60"
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? "Uploading..." : imagePreview ? "Replace image" : "Choose image"}
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:opacity-50"
                    disabled={!imagePreview && !uploadedImageUrl && !existingImageUrl}
                  >
                    Remove image
                  </button>
                </div>
                {imageError && <p className="text-sm text-red-600">{imageError}</p>}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, is_featured: event.target.checked }))
                }
              />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_best_seller}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, is_best_seller: event.target.checked }))
                }
              />
              Bestseller
            </label>
          </div>
          <div className="flex gap-3">
            <button className="lux-button flex-1" disabled={creating || updating || uploadingImage}>
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                className="lux-outline"
                onClick={() => {
                  setNotice("");
                  setErrorMessage("");
                  resetForm();
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="lux-card space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-sand">Product List</p>
            <p className="text-xs uppercase tracking-[0.3em] text-sand">
              Total {totalProductsCount || displayedProducts.length}
            </p>
          </div>
          <div className="space-y-4">
            {displayedProducts.map((product) => (
              <div key={product.id} className="flex items-start gap-4 border-b border-black/10 pb-4">
                <img
                  src={product.image || product.images?.[0]?.image_url}
                  alt={product.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-display">{product.name}</p>
                  <p className="text-xs text-sand">{product.category_name}</p>
                  <p className="text-xs text-sand">{formatCurrency(product.price)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em]"
                    onClick={() => setEditingId(product.id)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-red-400/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-red-300"
                    onClick={() => handleDelete(product)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] disabled:opacity-40"
              disabled={!previous}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              type="button"
            >
              Previous
            </button>
            <span className="text-xs text-sand">
              Page {page} of {totalPages}
            </span>
            <button
              className="rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] disabled:opacity-40"
              disabled={!next}
              onClick={() => setPage((prev) => prev + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
