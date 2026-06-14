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
import { Plus, Pencil, Trash2, Icon, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/Admin/AdminLayout";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/service/categoryApi";
import { CategoryResponse } from "@/service/productApi";



export default function Categories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    isActive: false,
  });

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
    setPreviewImage(category.logo); // ← add this
  } else {
    setEditingCategory(null);
    setFormData({ name: "", logo: "", isActive: false });
    setPreviewImage("");             // ← add this
  }
  setSelectedImage(null);           // ← also reset selected file
  setIsModalOpen(true);
};

  const handleSubmit = async () => {
    if (!formData.name) return;
    try {
      setUploading(true);
    const payload = new FormData();

    payload.append("name", formData.name);
    payload.append("is_active", formData.isActive.toString());

    if (selectedImage) {
      payload.append("logo", selectedImage);
    }

    if (editingCategory) {
      await updateCategory(editingCategory.reference_id, payload);
      toast.success("Category updated successfully");
    } else {
      await createCategory(payload);
      toast.success("Category created successfully");
    }

    fetchCategories();
    setIsModalOpen(false);
  }   catch (error : any) {
      toast.error(error.message || "An error occurred");

  } finally {
      setUploading(false);
  }
  };
  const handleDelete = async (reference_id: string) => {
    // Open confirmation dialog and store the id to delete if confirmed
    setPendingDeleteId(reference_id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;

    try {
      await deleteCategory(pendingDeleteId);
      toast.success("Product deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product. Please try again.");
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenModal(category)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(category.reference_id)}
          >
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
            <p className="text-muted-foreground">
              Organize your products into categories
            </p>
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

        {/* Create/Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Name</Label>
                <Input
                  id="cat-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Category name"
                />
              </div>
              <div className="space-y-2">
                <Label>Category Image</Label>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedImage(file);
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                />

                {previewImage && (
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
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button disabled={uploading} onClick={handleSubmit}>
                {editingCategory ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {showDeleteConfirm && (
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <div className="flex flex-col">
              <p>Are you sure you want to delete this product?</p>
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
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
