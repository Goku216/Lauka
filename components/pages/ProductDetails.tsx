"use client";

import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Minus, Plus, Star, Truck, Shield, MapPin, ArrowLeft, Loader2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { toast } from 'sonner';



const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API;

export default function ProductDetail({ id }: { id: string | undefined }) {
  const { addItem , items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [showFullImage, setShowFullImage] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [cartQuantity, setCartQuantity] = useState(0)

  // Fetch product details
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}/`);
        if (!response.ok) {
          throw new Error('Product not found');
        }

        const data: Product = await response.json();
        setProduct(data);
        setSelectedImage(data.image);
        console.log("Quantity", data.stock)
        // Fetch related products by category
        if (data.category) {
          fetchRelatedProducts(data.category, data.reference_id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch related products
  const fetchRelatedProducts = async (category: string, currentProductId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${category}/by-category/?page_size=4`);
      if (!response.ok) return;

      const data = await response.json();
      const products = data.results || data;
      
      // Filter out current product and limit to 4
      const filtered = products
        .filter((p: Product) => p.reference_id !== currentProductId)
        .slice(0, 4);
      
      setRelatedProducts(filtered);
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };


 const handleAddToCart = () => {
  if (!product) return;

  const existingCartItem = items.find(
    (item) => item.product.reference_id === product.reference_id
  );

  const CartQuantity = existingCartItem?.quantity || 0;
  
  const remainingStock = product.stock - CartQuantity;

  setCartQuantity(CartQuantity)

  if (remainingStock <= 0) {
    toast.error("No stock Available!");
    return;
  }

  const quantityToAdd = Math.min(quantity, remainingStock);

  for (let i = 0; i < quantityToAdd; i++) {
    addItem(product);
  }
};


  // Get all images (main image + additional images)
  const getAllImages = (): string[] => {
    if (!product) return [];


    console.log("Products", product)
    
    const allImages = [product.image];
    
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        const imageUrl = typeof img === 'string' ? img : img.image;
        if (imageUrl && imageUrl !== product.image) {
          allImages.push(imageUrl);
        }
      });
    }

    console.log("Images", allImages)
    
    return allImages;
  };

  const allImages = getAllImages();

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (!product?.discount_price || !product?.price) return null;
    const price = parseFloat(product.price);
    const discountPrice = parseFloat(product.discount_price);
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const discountPercentage = getDiscountPercentage();

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-16 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <Layout>
        <div className="container-custom py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {error || 'Product Not Found'}
          </h1>
          <Link href="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          {' / '}
          <Link href="/products" className="hover:text-primary">Products</Link>
          {' / '}
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <div 
                className="aspect-square rounded-3xl overflow-hidden bg-muted cursor-pointer"
                onClick={() => setShowFullImage(true)}
              >
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountPercentage && (
                  <span className="badge-discount text-base px-3 py-1">
                    {discountPercentage}% OFF
                  </span>
                )}
                {product.is_new && (
                  <span className="badge-new text-base px-3 py-1">NEW</span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer border-2 transition-all ${
                      selectedImage === img
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-secondary text-secondary" />
                  <span className="font-medium">{product.rating || 0}</span>
                  <span className="text-muted-foreground">({product.reviews || 0} reviews)</span>
                </div>
                <span className={product.in_stock ? 'text-primary' : 'text-destructive'}>
                  {product.in_stock ? '✓ In Stock' : '✕ Out of Stock'}
                </span>
                {product.stock > 0 && (
                  <span className="text-muted-foreground text-sm">
                    ({product.stock} available)
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                रू {product.discount_price || product.price}
              </span>
              {product.discount_price && product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  रू {product.price}
                </span>
              )}
              {product.unit && (
                <span className="text-muted-foreground">per /{product.unit}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags && (
              <div className="flex flex-wrap gap-2">
                {product.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                className="btn-primary flex-1 text-lg"
                onClick={handleAddToCart}
                disabled={!product.in_stock || product.stock <= cartQuantity}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="bg-accent p-6 rounded-2xl space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Delivery Area</p>
                  <p className="text-sm text-muted-foreground">Available only within Lumbini Province</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Quality Guarantee</p>
                  <p className="text-sm text-muted-foreground">100% fresh & organic products</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.reference_id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <button
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={selectedImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          {/* Image navigation in modal */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(img);
                  }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-primary ring-2 ring-primary'
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}