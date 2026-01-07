"use client";

import { ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { ProductResponse } from "@/service/productApi";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [cartQuantity, setCartQuantity] = useState(0);

  const handleAddToCart = () => {
    const existingCartItem = items.find(
      (item) => item.product.reference_id === product.reference_id
    );

    const CartQuantity = existingCartItem?.quantity || 0;
    setCartQuantity(CartQuantity);

    if (CartQuantity >= product.stock) {
      toast.error("No more stock available");
      return;
    }

    addItem(product);
  };

  return (
    <div className="card-product group overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/products/${product.reference_id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount_price && (
            <span className="badge-discount">
              {product.discount_percentage}% OFF
            </span>
          )}
          {product.is_new && <span className="badge-new">NEW</span>}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 bg-card/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card">
          <Heart className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-3 left-3 right-3 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
            disabled={!product.in_stock || product.stock <= cartQuantity}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/products/${product.reference_id}`}>
          <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mb-2">{product.unit}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-secondary text-secondary" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          {product.discount_price ? (
            <>
              <span className="text-lg font-bold text-primary">
                रू {product.discount_price}
              </span>
              {product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  रू {product.price}
                </span>
              )}
            </>
          ) : (
            <>
              <span className="text-lg font-bold text-primary">
                रू {product.price}
              </span>
            </>
          )}
        </div>

        {!product.in_stock && (
          <p className="text-sm text-destructive mt-2">Out of Stock</p>
        )}
      </div>
    </div>
  );
}
