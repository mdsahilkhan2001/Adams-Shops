import { useEffect, useRef, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useUploadImageMutation
} from "../../store/api.js";
import { validateImageFile } from "../../utils/format.js";

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
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploadedImagePath, setUploadedImagePath] = useState("");
  const [imageError, setImageError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [uploadImage] = useUploadImageMutation();

  useEffect(() => {
    if (!editingId) {
      return;
    }

    const category = (Array.isArray(categories) ? categories : categories?.results || []).find(
      (item) => String(item.id) === String(editingId)
    );

    if (category) {
      const preview = category.image_url || category.image || "";
      setForm({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        image_url: preview
      });
      setImagePreview(preview);
      setUploadedImagePath("");
      setImageError("");
    }
  }, [editingId, categories]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImagePreview("");
    setUploadedImagePath("");
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
      setForm((prev) => ({ ...prev, image_url: result.path }));
      setUploadedImagePath(result.path);
      setImagePreview(result.url);
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
    setForm((prev) => ({ ...prev, image_url: "" }));
    setImagePreview("");
    setUploadedImagePath("");
    setImageError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setNotice("");

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      image_url: form.image_url
    };

    try {
      if (editingId) {
        await updateCategory({ id: editingId, ...payload }).unwrap();
        resetForm();
        setNotice("Category updated successfully.");
      } else {
        await createCategory(payload).unwrap();
        resetForm();
        setNotice("Category created successfully.");
      }
    } catch (error) {
      setErrorMessage(
        error?.data?.detail ||
          error?.data?.message ||
          error?.data?.file ||
          "Category could not be saved."
      );
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    const preview = category.image_url || category.image || "";
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image_url: preview
    });
    setImagePreview(preview);
    setUploadedImagePath("");
    setImageError("");
  };

  const categoryItems = Array.isArray(categories) ? categories : categories?.results || [];

  return (
    <AdminLayout title="Categories">
      <div className="grid gap-8 lg:grid-cols-[360px,1fr]">
        <form onSubmit={handleSubmit} className="lux-card space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">
            {editingId ? "Edit Category" : "Add Category"}
          </p>
          {notice && <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{notice}</p>}
          {errorMessage && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
          )}
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

          <div className="rounded-3xl border border-dashed border-black/10 bg-slate-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-24 w-24 overflow-hidden rounded-2xl bg-white shadow-sm">
                {imagePreview ? (
                  <img src={imagePreview} alt="Category preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-slate-400">
                    No image selected
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">Category image</p>
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
                    disabled={!imagePreview}
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
            <p className="text-xs uppercase tracking-[0.3em] text-sand">Category List</p>
            <p className="text-xs uppercase tracking-[0.3em] text-sand">
              Total {categoryItems.length}
            </p>
          </div>
          <div className="space-y-4">
            {categoryItems.map((category) => (
              <div key={category.id} className="flex items-start gap-4 border-b border-black/10 pb-4">
                <img
                  src={category.image_url || category.image}
                  alt={category.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-display">{category.name}</p>
                  <p className="text-xs text-sand">{category.slug}</p>
                  <p className="text-xs text-sand">Display order {category.display_order || 0}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.2em]"
                    onClick={() => startEdit(category)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
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
