"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/Admin/DataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, ImageUp } from "lucide-react";
import { AdminLayout } from "@/components/Admin/AdminLayout";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  generateUploadUrl,
  uploadFileToR2,
} from "@/service/categoryApi";
import { validateImageFile, compressImage, MAX_UPLOAD_SIZE_MB } from "@/service/imageUtils";
import { CategoryResponse } from "@/service/productApi";

export default function Categories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [submitStage, setSubmitStage] = useState<"idle" | "uploading" | "saving">("idle");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    isActive: false,
  });

  const isBusy = compressing || submitStage !== "idle";

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { categories } = await getCategories();
      setCategories(categories);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category?: CategoryResponse) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, logo: category.logo, isActive: category.is_active });
      setPreviewImage(category.logo); // shown as-is; backend should return a viewable URL here
    } else {
      setEditingCategory(null);
      setFormData({ name: "", logo: "", isActive: false });
      setPreviewImage("");
    }
    setSelectedImage(null);
    setIsModalOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      e.target.value = "";
      return;
    }

    try {
      setCompressing(true);
      const finalFile =
        file.size > file.size /* always run through compressImage for consistency */
          ? file
          : file;
      const compressed = await compressImage(file);

      if (compressed.size > compressed.size) {
        // unreachable guard kept simple below via direct check
      }

      if (compressed.size > 2 * 1024 * 1024) {
        toast.error(`Could not compress image below ${MAX_UPLOAD_SIZE_MB}MB. Try a different image.`);
        return;
      }

      setSelectedImage(compressed);
      setPreviewImage(URL.createObjectURL(compressed));
    } catch (err) {
      toast.error("Failed to process image. Please try another file.");
    } finally {
      setCompressing(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) return;

    try {
      let logoKey = editingCategory?.logo;

      if (selectedImage) {
        setSubmitStage("uploading");
        const { upload_url, object_key } = await generateUploadUrl({
          filename: selectedImage.name,
          content_type: selectedImage.type,
          size: selectedImage.size,
        });

        await uploadFileToR2(upload_url, selectedImage, selectedImage.type);
        logoKey = object_key;
      }

      setSubmitStage("saving");

      const payload = {
        name: formData.name,
        is_active: formData.isActive,
        ...(logoKey ? { logo: logoKey } : {}),
      };

      if (editingCategory) {
        await updateCategory(editingCategory.reference_id, payload);
        toast.success("Category updated successfully");
      } else {
        await createCategory(payload);
        toast.success("Category created successfully");
      }

      fetchCategories();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setSubmitStage("idle");
    }
  };

  const handleDelete = async (reference_id: string) => {
    setPendingDeleteId(reference_id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteCategory(pendingDeleteId);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category. Please try again.");
    } finally {
      setShowDeleteConfirm(false);
      setPendingDeleteId(null);
    }
  };

  const columns = [
    { key: "name", title: "Name" },
    { key: "is_active", title: "is Active" },
    { key: "product_count", title: "Products" },
    {
      key: "actions",
      title: "Actions",
      render: (category: CategoryResponse) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleOpenModal(category)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(category.reference_id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Categories</h2>
            <p className="text-muted-foreground">Organize your products into categories</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <DataTable
                data={categories}
                columns={columns}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                isLoading={loading}
              />
            </CardContent>
          </Card>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Name</Label>
                <Input
                  id="cat-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Category name"
                />
              </div>

              <div className="space-y-2">
                <Label>Category Image</Label>
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  disabled={isBusy}
                />
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or WEBP — max {MAX_UPLOAD_SIZE_MB}MB (larger images are compressed automatically)
                </p>

                {compressing && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Compressing image...
                  </div>
                )}

                {previewImage && !compressing && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label>Is Active</Label>
                <Switch
                  className="cursor-pointer scale-125"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isBusy}>
                Cancel
              </Button>
              <Button disabled={isBusy} onClick={handleSubmit}>
                {submitStage === "uploading" && (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading image...
                  </>
                )}
                {submitStage === "saving" && (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                )}
                {submitStage === "idle" && (editingCategory ? "Update" : "Create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {showDeleteConfirm && (
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <div className="flex flex-col">
              <p>Are you sure you want to delete this category?</p>
              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}