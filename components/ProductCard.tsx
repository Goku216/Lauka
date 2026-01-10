"use client";

import { ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { productApi, ProductResponse } from "@/service/productApi";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { WishlistResponse } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [cartQuantity, setCartQuantity] = useState(0);
  const [wishlist, setWishlist] = useState<WishlistResponse | undefined>()


  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await productApi.getWishlist()
        setWishlist(res)
      }
      catch(error: any){
        console.log(error.message)
      }
    }

    fetchWishlist()
  }, [])

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

const handleWishlistToggle = async () => {
  if (isInWishlist) {
    await handleRemoveWishlist();
  } else {
    await handleAddWishlist();
  }
};


const handleAddWishlist = async () => {
  try {
    const res = await productApi.addToWishlist(product.reference_id);

    setWishlist(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        count: prev.count + 1,
        results: [
          ...prev.results,
          {
            wishlist_id: crypto.randomUUID(), // temporary
            product,
          },
        ],
      };
    });

    toast.success(res.message);
  } catch (error: any) {
    toast.error(error.message);
  }
};

const handleRemoveWishlist = async () => {
  try {
    await productApi.removeFromWishlist(product.reference_id);

    setWishlist(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        count: prev.count - 1,
        results: prev.results.filter(
          item => item.product.reference_id !== product.reference_id
        ),
      };
    });

    toast.success("Removed from wishlist");
  } catch (error: any) {
    toast.error(error.message);
  }
};


  const isInWishlist = wishlist?.results.some(
  item => item.product.reference_id === product.reference_id
) ?? false;


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
              {Number(product.discount_percentage)?.toFixed(0)}% OFF
            </span>
          )}
          {product.is_new && <span className="badge-new">NEW</span>}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}

          className={cn(
            "absolute top-3 right-3 bg-card/90 p-2 rounded-full transition-opacity hover:bg-card cursor-pointer",
            isInWishlist ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isInWishlist
                ? "fill-destructive text-destructive"
                : "text-muted-foreground hover:text-destructive"
            )}
          />
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
                रू {product.price}
              </span>
              {product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  रू {product.original_price}
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
