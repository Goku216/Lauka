// Validation utilities for product forms

export interface ValidationError {
  field: string;
  message: string;
}

export interface ProductValidationData {
  name: string;
  description: string;
  price: string;
  stock: string;
  sku: string;
  category: string;
  discount_price?: string;
  tags?: string;
}

export const validateProductForm = (data: ProductValidationData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Product name is required' });
  } else if (data.name.length < 3) {
    errors.push({ field: 'name', message: 'Product name must be at least 3 characters' });
  } else if (data.name.length > 200) {
    errors.push({ field: 'name', message: 'Product name must not exceed 200 characters' });
  }

  // Description validation
  if (!data.description || data.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (data.description.length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters' });
  } else if (data.description.length > 2000) {
    errors.push({ field: 'description', message: 'Description must not exceed 2000 characters' });
  }

  // Price validation
  if (!data.price || data.price.trim().length === 0) {
    errors.push({ field: 'price', message: 'Price is required' });
  } else {
    const priceNum = parseFloat(data.price);
    if (isNaN(priceNum)) {
      errors.push({ field: 'price', message: 'Price must be a valid number' });
    } else if (priceNum < 0) {
      errors.push({ field: 'price', message: 'Price cannot be negative' });
    } else if (priceNum === 0) {
      errors.push({ field: 'price', message: 'Price must be greater than 0' });
    } else if (priceNum > 999999.99) {
      errors.push({ field: 'price', message: 'Price is too high' });
    }
  }

  // Stock validation
  if (!data.stock || data.stock.trim().length === 0) {
    errors.push({ field: 'stock', message: 'Stock quantity is required' });
  } else {
    const stockNum = parseInt(data.stock);
    if (isNaN(stockNum)) {
      errors.push({ field: 'stock', message: 'Stock must be a valid number' });
    } else if (stockNum < 0) {
      errors.push({ field: 'stock', message: 'Stock cannot be negative' });
    } else if (!Number.isInteger(stockNum)) {
      errors.push({ field: 'stock', message: 'Stock must be a whole number' });
    }
  }

  // SKU validation
  if (!data.sku || data.sku.trim().length === 0) {
    errors.push({ field: 'sku', message: 'SKU is required' });
  } else if (data.sku.length < 3) {
    errors.push({ field: 'sku', message: 'SKU must be at least 3 characters' });
  } else if (data.sku.length > 50) {
    errors.push({ field: 'sku', message: 'SKU must not exceed 50 characters' });
  } else if (!/^[A-Z0-9-_]+$/i.test(data.sku)) {
    errors.push({ field: 'sku', message: 'SKU can only contain letters, numbers, hyphens, and underscores' });
  }

  // Category validation
  if (!data.category || data.category.trim().length === 0) {
    errors.push({ field: 'category', message: 'Category is required' });
  }

  // Discount price validation (optional)
  if (data.discount_price && data.discount_price.trim().length > 0) {
    const discountNum = parseFloat(data.discount_price);
    if (isNaN(discountNum)) {
      errors.push({ field: 'discount_price', message: 'Discount price must be a valid number' });
    } else if (discountNum < 0) {
      errors.push({ field: 'discount_price', message: 'Discount price cannot be negative' });
    } else if (data.price && !isNaN(parseFloat(data.price)) && discountNum >= parseFloat(data.price)) {
      errors.push({ field: 'discount_price', message: 'Discount price must be less than regular price' });
    }
  }

  // Tags validation (optional)
  if (data.tags && data.tags.trim().length > 0) {
    const tags = data.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    if (tags.length > 10) {
      errors.push({ field: 'tags', message: 'Maximum 10 tags allowed' });
    }
    tags.forEach(tag => {
      if (tag.length > 30) {
        errors.push({ field: 'tags', message: 'Each tag must not exceed 30 characters' });
      }
    });
  }

  return errors;
};

// File validation
export const validateProductFiles = (
  thumbnail?: File,
  additionalImages?: File[]
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  // Validate thumbnail
  if (thumbnail) {
    if (!allowedTypes.includes(thumbnail.type)) {
      errors.push({ 
        field: 'thumbnail', 
        message: 'Thumbnail must be JPEG, PNG, or WebP format' 
      });
    }
    if (thumbnail.size > maxSize) {
      errors.push({ 
        field: 'thumbnail', 
        message: 'Thumbnail size must not exceed 5MB' 
      });
    }
  }

  // Validate additional images
  if (additionalImages && additionalImages.length > 0) {
    if (additionalImages.length > 5) {
      errors.push({ 
        field: 'additional_images', 
        message: 'Maximum 5 additional images allowed' 
      });
    }

    additionalImages.forEach((file, index) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push({ 
          field: 'additional_images', 
          message: `Image ${index + 1} must be JPEG, PNG, or WebP format` 
        });
      }
      if (file.size > maxSize) {
        errors.push({ 
          field: 'additional_images', 
          message: `Image ${index + 1} size must not exceed 5MB` 
        });
      }
    });
  }

  return errors;
};