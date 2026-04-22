import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation
} from "../../store/api.js";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image_url: ""
};

const AdminCategories = () => {
  const { data: categories } = useGetCategoriesQuery();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await updateCategory({ id: editingId, ...form }).unwrap();
      } else {
        await createCategory(form).unwrap();
      }
      resetForm();
    } catch (error) {
      // noop
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image_url: category.image_url || category.image || ""
    });
  };

  return (
    <AdminLayout title="Categories">
      <div className="grid gap-8 lg:grid-cols-[360px,1fr]">
        <form onSubmit={handleSubmit} className="lux-card space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">
            {editingId ? "Edit Category" : "Add Category"}
          </p>
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Category name"
            className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
            required
          />
          <input
            value={form.slug}
            onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
            placeholder="Slug"
            className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
            required
          />
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Description"
            className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none min-h-[120px]"
          />
          <input
            value={form.image_url}
            onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
            placeholder="Image URL"
            className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-ink outline-none"
          />
          <div className="flex gap-3">
            <button className="lux-button flex-1">{editingId ? "Update" : "Create"}</button>
            {editingId && (
              <button type="button" className="lux-outline" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="lux-card space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-sand">Category List</p>
            <p className="text-xs uppercase tracking-[0.3em] text-sand">Total {categories?.length || 0}</p>
          </div>
          <div className="space-y-4">
            {categories?.map((category) => (
              <div key={category.id} className="flex items-start gap-4 border-b border-black/10 pb-4">
                <img
                  src={category.image_url || category.image}
                  alt={category.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-display">{category.name}</p>
                  <p className="text-xs text-sand">{category.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em]"
                    onClick={() => startEdit(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-full border border-red-400/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-red-300"
                    onClick={() => deleteCategory(category.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
