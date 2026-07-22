"use client";
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DataTable } from '@/components/Admin/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import { productApi, ProductResponse, ProductPayload } from '@/service/productApi';
import { validateProductForm, ValidationError } from '@/lib/validation/productValidation';
import { validateImageFile, compressImage, MAX_UPLOAD_SIZE_MB } from '@/service/imageUtils';
import { uploadFilesToR2 } from '@/service/uploadApi';
import { toast } from 'sonner';
import { getCategories } from '@/service/categoryApi';
import { Categories } from '@/types/productTypes';

const MAX_ADDITIONAL_IMAGES = 5;

export default function Products() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitStage, setSubmitStage] = useState<'idle' | 'uploading' | 'saving'>('idle');
  const [compressing, setCompressing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

  const isBusy = compressing || submitStage !== 'idle';

  // Form state matching backend structure
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    in_stock: true,
    category: '',
    discount_price: '',
    tags: '',
    unit: '',
    is_featured: false,
    is_new: false,
  });

  // Thumbnail: `thumbnail` holds a NEW file only (replaced by user); thumbnailPreview
  // shows either the existing product image URL or a blob preview of the new file.
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

  // Additional images are split into:
  // - existingAdditionalImages: object keys / URLs already on R2, kept unless user removes them
  // - newAdditionalImageFiles: freshly selected Files, compressed client-side, uploaded on submit
  const [existingAdditionalImages, setExistingAdditionalImages] = useState<string[]>([]);
  const [newAdditionalImageFiles, setNewAdditionalImageFiles] = useState<File[]>([]);
  const [newAdditionalImagePreviews, setNewAdditionalImagePreviews] = useState<string[]>([]);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      const { categories } = await getCategories();
      setCategories(categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProducts({
        page: currentPage,
        limit: 10,
      });
      setProducts(response.products || []);
      setTotalItems(response.total || 0);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to fetch products');
      setProducts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: ProductResponse) => {
    setValidationErrors([]);

    const matchedCategory = categories.find(
      (category) => category.slug === product?.category
    );

    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.original_price?.toString(),
        stock: product.stock.toString(),
        in_stock: product.in_stock,
        category: matchedCategory?.reference_id || "", // Use reference_id from category object
        discount_price: product.discount_price ? product.discount_price.toString() : '',
        tags: product.tags || '',
        unit: product.unit || '',
        is_featured: product.is_featured || false,
        is_new: product.is_new || false,
      });
      setThumbnailPreview(product.image || '');
      setExistingAdditionalImages(
        product.images ? product.images.map(img => img.image) : []
      );
    } else {
      setEditingProduct(null);
      resetForm();
    }

    setThumbnail(null);
    setNewAdditionalImageFiles([]);
    setNewAdditionalImagePreviews([]);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      in_stock: true,
      category: '',
      discount_price: '',
      tags: '',
      unit: '',
      is_featured: false,
      is_new: false,
    });
    setThumbnail(null);
    setThumbnailPreview('');
    setExistingAdditionalImages([]);
    setNewAdditionalImageFiles([]);
    setNewAdditionalImagePreviews([]);
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      e.target.value = '';
      return;
    }

    try {
      setCompressing(true);
      const compressed = await compressImage(file);

      if (compressed.size > 2 * 1024 * 1024) {
        toast.error(`Could not compress image below ${MAX_UPLOAD_SIZE_MB}MB. Try a different image.`);
        return;
      }

      setThumbnail(compressed);
      setThumbnailPreview(URL.createObjectURL(compressed));
    } catch (err) {
      toast.error('Failed to process thumbnail. Please try another file.');
    } finally {
      setCompressing(false);
      e.target.value = '';
    }
  };

  const handleAdditionalImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const totalCount = existingAdditionalImages.length + newAdditionalImageFiles.length + files.length;
    if (totalCount > MAX_ADDITIONAL_IMAGES) {
      toast.error(`You can upload a maximum of ${MAX_ADDITIONAL_IMAGES} additional images`);
      e.target.value = '';
      return;
    }

    for (const file of files) {
      const validationError = validateImageFile(file);
      if (validationError) {
        toast.error(`${file.name}: ${validationError}`);
        e.target.value = '';
        return;
      }
    }

    try {
      setCompressing(true);
      const compressedFiles: File[] = [];

      for (const file of files) {
        const compressed = await compressImage(file);
        if (compressed.size > 2 * 1024 * 1024) {
          toast.error(`${file.name} could not be compressed below ${MAX_UPLOAD_SIZE_MB}MB. Skipped.`);
          continue;
        }
        compressedFiles.push(compressed);
      }

      setNewAdditionalImageFiles(prev => [...prev, ...compressedFiles]);
      setNewAdditionalImagePreviews(prev => [
        ...prev,
        ...compressedFiles.map(f => URL.createObjectURL(f)),
      ]);
    } catch (err) {
      toast.error('Failed to process one or more images.');
    } finally {
      setCompressing(false);
      e.target.value = '';
    }
  };

  const removeExistingAdditionalImage = (index: number) => {
    setExistingAdditionalImages(existingAdditionalImages.filter((_, i) => i !== index));
  };

  const removeNewAdditionalImage = (index: number) => {
    setNewAdditionalImageFiles(newAdditionalImageFiles.filter((_, i) => i !== index));
    setNewAdditionalImagePreviews(newAdditionalImagePreviews.filter((_, i) => i !== index));
  };

  const getFieldError = (fieldName: string) => {
    return validationErrors.find(err => err.field === fieldName)?.message;
  };

  const handleSubmit = async () => {
    // Validate form
    const formErrors = validateProductForm(formData);

    if (formErrors.length > 0) {
      setValidationErrors(formErrors);
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    setValidationErrors([]);

    try {
      // 1. Upload thumbnail + any new gallery files together in a single presigned-url batch
      let thumbnailKey: string | undefined;
      let newlyUploadedKeys: string[] = [];

      const filesToUpload = [
        ...(thumbnail ? [thumbnail] : []),
        ...newAdditionalImageFiles,
      ];

      if (filesToUpload.length > 0) {
        setSubmitStage('uploading');
        const uploadedKeys = await uploadFilesToR2(filesToUpload);

        if (thumbnail) {
          thumbnailKey = uploadedKeys[0];
          newlyUploadedKeys = uploadedKeys.slice(1);
        } else {
          newlyUploadedKeys = uploadedKeys;
        }
      }

      setSubmitStage('saving');

      const apiData: ProductPayload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        in_stock: formData.in_stock,
        category: formData.category,
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : undefined,
        ...(thumbnailKey ? { image: thumbnailKey } : {}),
        additional_images: [...existingAdditionalImages, ...newlyUploadedKeys],
        unit: formData.unit.trim(),
        is_featured: formData.is_featured,
        is_new: formData.is_new,
      };

      if (editingProduct) {
        await productApi.updateProduct(editingProduct.reference_id, apiData);
        toast.success('Product updated successfully');
      } else {
        await productApi.createProduct(apiData);
        toast.success('Product created successfully');
      }

      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Failed to submit product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit product. Please try again.');
    } finally {
      setSubmitStage('idle');
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
      await productApi.deleteProduct(pendingDeleteId);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product. Please try again.');
    } finally {
      setShowDeleteConfirm(false);
      setPendingDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Name',
      render: (product: ProductResponse) => (
        <div className="flex items-center gap-3">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-10 h-10 rounded-md object-cover"
            />
          )}
          <span className="font-medium">{product.name}</span>
        </div>
      ),
    },
    {
      key: 'price',
      title: 'Price',
      render: (product: ProductResponse) => (
        <div className="space-y-1">
          <div className="font-semibold">Rs. {parseFloat(product.original_price?.toString() || "").toFixed(2)}</div>
          {product.discount_price && parseFloat(product.discount_price) > 0 && (
            <div className="text-sm text-green-600">
              Sale: Rs. {parseFloat(product.price).toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    { key: 'stock', title: 'Stock' },
    {
      key: 'is_available',
      title: 'Status',
      render: (product: ProductResponse) => (
        <Badge variant={product.in_stock ? 'default' : 'secondary'}>
          {product.in_stock ? 'Available' : 'Unavailable'}
        </Badge>
      ),
    },
    {
      key: 'category',
      title: 'Category',
      render: (product: ProductResponse) => (
        <Badge variant="outline">
          {product.category}
        </Badge>
      ),
    },
    {
      key: 'tags',
      title: 'Tags',
      render: (product: ProductResponse) => (
        <div className="flex flex-wrap gap-1">
          {product.tags && product.tags.split(',').slice(0, 2).map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {tag.trim()}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (product: ProductResponse) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenModal(product)}
            disabled={isBusy}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(product.reference_id)}
            disabled={isBusy}
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
            <h2 className="text-2xl font-bold text-foreground">Products</h2>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button onClick={() => handleOpenModal()} disabled={loading || isBusy}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first product
                </p>
                <Button onClick={() => handleOpenModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <DataTable
                data={products}
                columns={columns}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                pageSize={10}
                isLoading={loading}
                serverPagination={true}
              />
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  className={getFieldError('name') ? 'border-destructive' : ''}
                  disabled={isBusy}
                />
                {getFieldError('name') && (
                  <p className="text-sm text-destructive">{getFieldError('name')}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={4}
                  className={getFieldError('description') ? 'border-destructive' : ''}
                  disabled={isBusy}
                />
                {getFieldError('description') && (
                  <p className="text-sm text-destructive">{getFieldError('description')}</p>
                )}
              </div>

              {/* Price and Discount Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className={getFieldError('price') ? 'border-destructive' : ''}
                    disabled={isBusy}
                  />
                  {getFieldError('price') && (
                    <p className="text-sm text-destructive">{getFieldError('price')}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount_price">Discount Price</Label>
                  <Input
                    id="discount_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    placeholder="0.00"
                    className={getFieldError('discount_price') ? 'border-destructive' : ''}
                    disabled={isBusy}
                  />
                  {getFieldError('discount_price') && (
                    <p className="text-sm text-destructive">{getFieldError('discount_price')}</p>
                  )}
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label htmlFor="stock">
                  Stock Quantity <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  className={getFieldError('stock') ? 'border-destructive' : ''}
                  disabled={isBusy}
                />
                {getFieldError('stock') && (
                  <p className="text-sm text-destructive">{getFieldError('stock')}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  disabled={isBusy}
                >
                  <SelectTrigger className={getFieldError('category') ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.reference_id} value={cat.reference_id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError('category') && (
                  <p className="text-sm text-destructive">{getFieldError('category')}</p>
                )}
              </div>

              {/* Unit */}
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., kg, pcs, liters"
                  className={getFieldError('unit') ? 'border-destructive' : ''}
                  disabled={isBusy}
                />
                {getFieldError('unit') && (
                  <p className="text-sm text-destructive">{getFieldError('unit')}</p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="electronics, phone (comma-separated)"
                  className={getFieldError('tags') ? 'border-destructive' : ''}
                  disabled={isBusy}
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas (max 10 tags)
                </p>
                {getFieldError('tags') && (
                  <p className="text-sm text-destructive">{getFieldError('tags')}</p>
                )}
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="is_available">Product Availability</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this product available for purchase
                  </p>
                </div>
                <Switch
                  id="is_available"
                  checked={formData.in_stock}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, in_stock: checked })
                  }
                  disabled={isBusy}
                />
              </div>

              {/* Thumbnail */}
              <div className="space-y-2">
                <Label>Thumbnail Image</Label>
                <div className="space-y-3">
                  {thumbnailPreview && (
                    <div className="relative inline-block">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-32 h-32 rounded-lg object-cover border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => {
                          setThumbnail(null);
                          setThumbnailPreview('');
                          if (thumbnailInputRef.current) {
                            thumbnailInputRef.current.value = '';
                          }
                        }}
                        disabled={isBusy}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                  <Input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleThumbnailChange}
                    className="cursor-pointer"
                    disabled={isBusy}
                  />
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, or WebP — max {MAX_UPLOAD_SIZE_MB}MB (larger images are compressed automatically)
                  </p>
                  {getFieldError('thumbnail') && (
                    <p className="text-sm text-destructive">{getFieldError('thumbnail')}</p>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              <div className="space-y-2">
                <Label>Additional Images (max {MAX_ADDITIONAL_IMAGES})</Label>
                <div className="space-y-3">
                  {(existingAdditionalImages.length > 0 || newAdditionalImagePreviews.length > 0) && (
                    <div className="flex flex-wrap gap-2">
                      {existingAdditionalImages.map((url, index) => (
                        <div key={`existing-${index}`} className="relative inline-block">
                          <img
                            src={url}
                            alt={`Additional ${index + 1}`}
                            className="w-24 h-24 rounded-lg object-cover border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => removeExistingAdditionalImage(index)}
                            disabled={isBusy}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      {newAdditionalImagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative inline-block">
                          <img
                            src={preview}
                            alt={`New additional ${index + 1}`}
                            className="w-24 h-24 rounded-lg object-cover border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => removeNewAdditionalImage(index)}
                            disabled={isBusy}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {existingAdditionalImages.length + newAdditionalImageFiles.length < MAX_ADDITIONAL_IMAGES && (
                    <Input
                      ref={additionalImagesInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      multiple
                      onChange={handleAdditionalImagesChange}
                      className="cursor-pointer"
                      disabled={isBusy}
                    />
                  )}

                  {compressing && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Compressing image(s)...
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, or WebP — max {MAX_UPLOAD_SIZE_MB}MB each (larger images are compressed automatically)
                  </p>
                  {getFieldError('additional_images') && (
                    <p className="text-sm text-destructive">{getFieldError('additional_images')}</p>
                  )}
                </div>
              </div>

              {/* Additional options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_featured">Featured Product</Label>
                    <p className="text-sm text-muted-foreground">
                      Mark this product as featured
                    </p>
                  </div>
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_featured: checked })
                    }
                    disabled={isBusy}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_new">New Arrival</Label>
                    <p className="text-sm text-muted-foreground">
                      Mark this product as a new arrival
                    </p>
                  </div>
                  <Switch
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_new: checked })
                    }
                    disabled={isBusy}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isBusy}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isBusy}>
                {submitStage === 'uploading' && (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading images...
                  </>
                )}
                {submitStage === 'saving' && (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingProduct ? 'Updating...' : 'Creating...'}
                  </>
                )}
                {submitStage === 'idle' && (
                  editingProduct ? 'Update Product' : 'Create Product'
                )}
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
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}