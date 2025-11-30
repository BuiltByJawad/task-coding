"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetProductByIdQuery,
  useAddOrUpdateCartMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
} from "@/src/lib/api/apiSlice";
import { useAppSelector } from "@/src/lib/store/hooks";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { QuantitySelector } from "@/src/components/ui/QuantitySelector";
import { ShoppingCart, Star, Truck, ShieldCheck, Package } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id as string);
  const auth = useAppSelector((state) => state.auth);
  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !auth.isAuthenticated,
  });
  const [addToCart, { isLoading: isAdding }] = useAddOrUpdateCartMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [quantity, setQuantity] = useState(0);

  const cartItem = cartData?.cart?.find((item) => item.product?._id === product?._id);

  useEffect(() => {
    if (cartItem?.quantity && quantity === 0) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem, quantity]);

  const ensureAuthenticated = () => {
    if (!auth.isAuthenticated) {
      if (product?._id) {
        toast.error("Please log in to add items to your cart", {
          description: "Create an account or sign in to save your cart and checkout.",
        });
        router.push(`/login?redirect=/products/${product._id}`);
      }
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!product || !product._id) return;

    if (!ensureAuthenticated()) return;

    try {
      const newQuantity = 1;
      await addToCart({ productId: product._id, quantity: newQuantity }).unwrap();
      setQuantity(newQuantity);
      toast.success("Added to cart", { description: `${product.title} has been added to your cart.` });
    } catch (error: any) {
      if (error?.status === 401) {
        ensureAuthenticated();
        return;
      }

      toast.error("Failed to add to cart", { description: "Please try again." });
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (!product || !product._id) return;

    if (!ensureAuthenticated()) return;

    const safeQuantity = Math.max(0, Math.min(99, newQuantity));

    try {
      if (safeQuantity <= 0) {
        if (cartItem?._id) {
          await removeCartItem(cartItem._id).unwrap();
        }
        setQuantity(0);
        return;
      }

      await addToCart({ productId: product._id, quantity: safeQuantity }).unwrap();
      setQuantity(safeQuantity);
    } catch (error: any) {
      if (error?.status === 401) {
        ensureAuthenticated();
        return;
      }

      toast.error("Failed to update cart", { description: "Please try again." });
    }
  };

  if (isError || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive">Product not found.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-in fade-in duration-500">
      {/* Product Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted/30 border border-white/5 group">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            No Image Available
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge className="bg-white/90 text-black backdrop-blur-md shadow-lg">
            Best Seller
          </Badge>
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {product.title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(128 reviews)</span>
          </div>
          <p className="text-3xl font-bold text-primary">
            ${product.price?.toFixed(2)}
          </p>
        </div>

        <div className="prose prose-invert text-muted-foreground">
          <p>{product.description}</p>
        </div>

        <div className="space-y-6 pt-6 border-t border-white/10">
          {quantity > 0 ? (
            <div className="flex items-end gap-4">
              <div className="space-y-2">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity
                </label>
                <QuantitySelector
                  value={quantity}
                  min={0}
                  max={99}
                  onChange={handleQuantityChange}
                  disabled={isAdding}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-4">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? (
                  "Adding..."
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/30 border border-white/5">
              <Package className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium">In Stock</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/30 border border-white/5">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium">Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/30 border border-white/5">
              <Truck className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium">Free Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
