import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import {
  useCreateProductImageMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useUpdateProductMutation
} from "../../store/api.js";
import { normalizeProductsResponse } from "../../utils/format.js";

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
  const [page, setPage] = useState(1);
  const { data } = useGetProductsQuery({ page, page_size: 20, ordering: "-created_at" });
  const { items: products, count, next, previous } = normalizeProductsResponse(data);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [createImage] = useCreateProductImageMutation();

  const totalPages = useMemo(() => (count ? Math.ceil(count / 20) : 1), [count]);

  useEffect(() => {
    if (editingId && products.length) {
      const product = products.find((item) => item.id === editingId);
      if (product) {
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
          image_url: "",
          is_featured: product.is_featured || false,
          is_best_seller: product.is_best_seller || false
        });
      }
    }
  }, [editingId, products]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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

    try {
      let product;
      if (editingId) {
        product = await updateProduct({ id: editingId, ...payload }).unwrap();
      } else {
        product = await createProduct(payload).unwrap();
      }

      if (form.image_url) {
        await createImage({ product: product.id, image_url: form.image_url, is_primary: true }).unwrap();
      }

      resetForm();
    } catch (error) {
      // noop: errors shown by backend response
    }
  };

  return (
    <AdminLayout title="Products">
      <div className="grid gap-8 lg:grid-cols-[380px,1fr]">
        <form onSubmit={handleSubmit} className="lux-card space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">
            {editingId ? "Edit Product" : "Add Product"}
          </p>
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
            {categories?.map((category) => (
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
          <input
            value={form.image_url}
            onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
            placeholder="Primary image URL (webp)"
            className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
          />
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
            <button className="lux-button flex-1" disabled={creating || updating}>
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button type="button" className="lux-outline" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="lux-card space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-sand">Product List</p>
            <p className="text-xs uppercase tracking-[0.3em] text-sand">Total {count || products.length}</p>
          </div>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-start gap-4 border-b border-black/10 pb-4">
                <img
                  src={product.image || product.images?.[0]?.image_url}
                  alt={product.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-display">{product.name}</p>
                  <p className="text-xs text-sand">{product.category_name}</p>
                  <p className="text-xs text-sand">INR {product.price}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em]"
                    onClick={() => setEditingId(product.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-full border border-red-400/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-red-300"
                    onClick={() => deleteProduct(product.id)}
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
            >
              Previous
            </button>
            <span className="text-xs text-sand">Page {page} of {totalPages}</span>
            <button
              className="rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-[0.2em] disabled:opacity-40"
              disabled={!next}
              onClick={() => setPage((prev) => prev + 1)}
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
