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
import { mockCategories } from '@/lib/mock-data';
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import { productApi, ProductResponse, ProductFormData } from '@/service/productApi';
import { validateProductForm, validateProductFiles, ValidationError } from '@/lib/validation/productValidation';
import { toast } from 'sonner';
import { getCategories } from '@/service/categoryApi';
import { Categories } from '@/types/productTypes';
import { set } from 'zod';



export default function Products() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  
  // Form state matching backend structure
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    is_available: true,
    category: '',
    sku: '',
    discount_price: '',
    tags: '',
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);


  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    console.log('Categories loaded in useEffect:', categories);
  }, [currentPage]);


  const fetchCategories = async () => {
    try { 
      const categories = await getCategories();
      setCategories(categories);
      console.log('Fetched categories:', categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

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
    
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        is_available: product.is_available,
        category: product.category.reference_id, // Use reference_id from category object
        sku: product.sku,
        discount_price: product.discount_price ? product.discount_price.toString() : '',
        tags: product.tags || '',
      });
      setThumbnailPreview(product.thumbnail || '');
      // Convert images array to preview URLs
      setAdditionalImagePreviews(
        product.images ? product.images.map(img => img.image) : []
      );
    } else {
      setEditingProduct(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      is_available: true,
      category: '',
      sku: '',
      discount_price: '',
      tags: '',
    });
    setThumbnail(null);
    setThumbnailPreview('');
    setAdditionalImages([]);
    setAdditionalImagePreviews([]);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (additionalImages.length + files.length > 5) {
      toast.error('You can upload a maximum of 5 additional images');
      return;
    }

    setAdditionalImages([...additionalImages, ...files]);
    
    const newPreviews: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setAdditionalImagePreviews([...additionalImagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
    setAdditionalImagePreviews(additionalImagePreviews.filter((_, i) => i !== index));
  };

  const getFieldError = (fieldName: string) => {
    return validationErrors.find(err => err.field === fieldName)?.message;
  };

  const handleSubmit = async () => {
    // Validate form
    const formErrors = validateProductForm(formData);
    const fileErrors = validateProductFiles(thumbnail || undefined, additionalImages);
    const allErrors = [...formErrors, ...fileErrors];

    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    setValidationErrors([]);
    setSubmitting(true);

    try {
      const apiData: ProductFormData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        is_available: formData.is_available,
        category: formData.category,
        sku: formData.sku.trim().toUpperCase(),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : undefined,
        thumbnail: thumbnail || undefined,
        additional_images: additionalImages.length > 0 ? additionalImages : undefined,
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
      setSubmitting(false);
    }
  };

  const handleDelete = async (reference_id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productApi.deleteProduct(reference_id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product. Please try again.');
    }
  };

  const columns = [
    { 
      key: 'name', 
      title: 'Name',
      render: (product: ProductResponse) => (
        <div className="flex items-center gap-3">
          {product.thumbnail && (
            <img 
              src={product.thumbnail} 
              alt={product.name}
              className="w-10 h-10 rounded-md object-cover"
            />
          )}
          <span className="font-medium">{product.name}</span>
        </div>
      ),
    },
    { key: 'sku', title: 'SKU' },
    { 
      key: 'price', 
      title: 'Price',
      render: (product: ProductResponse) => (
        <div className="space-y-1">
          <div className="font-semibold">${parseFloat(product.price).toFixed(2)}</div>
          {product.discount_price && parseFloat(product.discount_price) > 0 && (
            <div className="text-sm text-green-600">
              Sale: ${parseFloat(product.discount_price).toFixed(2)}
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
        <Badge variant={product.is_available ? 'default' : 'secondary'}>
          {product.is_available ? 'Available' : 'Unavailable'}
        </Badge>
      ),
    },
    {
      key: 'category',
      title: 'Category',
      render: (product: ProductResponse) => (
        <Badge variant="outline">
          {product.category.name}
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
            disabled={submitting}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleDelete(product.reference_id)}
            disabled={submitting}
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
          <Button onClick={() => handleOpenModal()} disabled={loading || submitting}>
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
                />
                {getFieldError('description') && (
                  <p className="text-sm text-destructive">{getFieldError('description')}</p>
                )}
              </div>

              {/* SKU */}
              <div className="space-y-2">
                <Label htmlFor="sku">
                  SKU <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                  placeholder="e.g., PRD123"
                  className={getFieldError('sku') ? 'border-destructive' : ''}
                />
                <p className="text-xs text-muted-foreground">
                  Letters, numbers, hyphens, and underscores only
                </p>
                {getFieldError('sku') && (
                  <p className="text-sm text-destructive">{getFieldError('sku')}</p>
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

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="electronics, phone (comma-separated)"
                  className={getFieldError('tags') ? 'border-destructive' : ''}
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
                  checked={formData.is_available}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, is_available: checked })
                  }
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
                  />
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, or WebP (max 5MB)
                  </p>
                  {getFieldError('thumbnail') && (
                    <p className="text-sm text-destructive">{getFieldError('thumbnail')}</p>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              <div className="space-y-2">
                <Label>Additional Images (max 5)</Label>
                <div className="space-y-3">
                  {additionalImagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {additionalImagePreviews.map((preview, index) => (
                        <div key={index} className="relative inline-block">
                          <img 
                            src={preview} 
                            alt={`Additional ${index + 1}`}
                            className="w-24 h-24 rounded-lg object-cover border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => removeAdditionalImage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {additionalImages.length < 5 && (
                    <Input
                      ref={additionalImagesInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      multiple
                      onChange={handleAdditionalImagesChange}
                      className="cursor-pointer"
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG, or WebP (max 5MB each)
                  </p>
                  {getFieldError('additional_images') && (
                    <p className="text-sm text-destructive">{getFieldError('additional_images')}</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingProduct ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingProduct ? 'Update Product' : 'Create Product'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}