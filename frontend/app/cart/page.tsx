"use client";

import {
  useGetCartQuery,
  useAddOrUpdateCartMutation,
  useRemoveCartItemMutation,
} from "@/src/lib/api/apiSlice";
import { ProtectedRoute } from "@/src/features/auth/ProtectedRoute";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { QuantitySelector } from "@/src/components/ui/QuantitySelector";
import { Trash2, ShoppingBag, ArrowRight, CreditCard } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { data, isLoading, isError, refetch } = useGetCartQuery();
  const [addOrUpdateCart] = useAddOrUpdateCartMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  const cart = data?.cart ?? [];

  const handleQuantityChange = async (id?: string, productId?: string, quantity?: number) => {
    if (!productId || !quantity) return;
    try {
      await addOrUpdateCart({ productId, quantity }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemove = async (id?: string) => {
    if (!id) return;
    try {
      await removeCartItem(id).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const total = cart.reduce((sum, item) => {
    const price = item.product?.price ?? 0;
    const qty = item.quantity ?? 0;
    return sum + price * qty;
  }, 0);

  if (isError) {
    return (
      <ProtectedRoute>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-destructive">Failed to load cart.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // While the cart is loading for the first time (no data yet), show a skeleton
  if (isLoading && !data) {
    return (
      <ProtectedRoute>
        <div className="space-y-8 animate-in fade-in duration-500">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-primary" /> Your Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Skeleton Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {[1, 2].map((i) => (
                <Card
                  key={i}
                  className="flex flex-col sm:flex-row items-center gap-4 p-4 border-white/5 bg-card/50"
                >
                  <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-muted/40 animate-pulse" />

                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="h-4 w-2/3 rounded bg-muted/40 animate-pulse mx-auto sm:mx-0" />
                    <div className="h-3 w-1/3 rounded bg-muted/30 animate-pulse mx-auto sm:mx-0" />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-10 w-24 rounded-full bg-muted/40 animate-pulse" />
                    <div className="h-8 w-8 rounded-full bg-muted/40 animate-pulse" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Skeleton Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-white/10 bg-card/80 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <div className="h-5 w-24 rounded bg-muted/40 animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-3 w-20 rounded bg-muted/30 animate-pulse" />
                      <div className="h-3 w-16 rounded bg-muted/30 animate-pulse" />
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                    <div className="h-4 w-16 rounded bg-muted/40 animate-pulse" />
                    <div className="h-4 w-20 rounded bg-muted/40 animate-pulse" />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 w-full rounded-full bg-muted/40 animate-pulse" />
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8 animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" /> Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center border border-dashed border-white/10 rounded-3xl bg-card/30">
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Your cart is empty</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Looks like you haven't added anything to your cart yet.
              </p>
            </div>
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item._id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border-white/5 bg-card/50 hover:bg-card transition-colors">
                  <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-muted/30 overflow-hidden">
                    {item.product?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.product.image}
                        alt={item.product.title ?? "Product"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <h3 className="font-semibold text-foreground">
                      {item.product?.title ?? "Unnamed product"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Unit Price: ${item.product?.price?.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <QuantitySelector
                        value={item.quantity ?? 1}
                        onChange={(value) =>
                          handleQuantityChange(item._id, item.product?._id, value)
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(item._id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-white/10 bg-card/80 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/checkout" className="w-full">
                    <Button size="lg" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25">
                      Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <CreditCard className="h-3 w-3" /> Secure Checkout
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
