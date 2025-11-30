"use client";

import { useGetOrdersQuery } from "@/src/lib/api/apiSlice";
import { ProtectedRoute } from "@/src/features/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Package, Calendar, ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { data, isLoading, isError } = useGetOrdersQuery();

  if (isError) {
    return (
      <ProtectedRoute>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-destructive">Failed to load orders.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const orders = data ?? [];

  // Initial skeleton while loading orders
  if (isLoading && !data) {
    return (
      <ProtectedRoute>
        <div className="space-y-8 animate-in fade-in duration-500">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" /> Order History
          </h1>

          <div className="grid gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="border-white/5 bg-card/50">
                <CardHeader className="bg-muted/20 border-b border-white/5 py-4 flex flex-row items-center justify-between">
                  <div className="space-y-2 w-full">
                    <div className="h-4 w-40 rounded bg-muted/40 animate-pulse" />
                    <div className="h-3 w-32 rounded bg-muted/30 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-20 rounded-full bg-primary/10 animate-pulse" />
                    <div className="h-5 w-16 rounded bg-muted/40 animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded bg-muted/30 animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 rounded bg-muted/40 animate-pulse" />
                          <div className="h-3 w-24 rounded bg-muted/30 animate-pulse" />
                        </div>
                      </div>
                      <div className="h-4 w-12 rounded bg-muted/40 animate-pulse" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8 animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" /> Order History
        </h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center border border-dashed border-white/10 rounded-3xl bg-card/30">
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">No orders yet</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
            </div>
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order._id} className="border-white/5 bg-card/50 hover:bg-card transition-colors overflow-hidden">
                <CardHeader className="bg-muted/20 border-b border-white/5 flex flex-row items-center justify-between py-4">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      Order #{order._id?.slice(-8).toUpperCase()}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                        : "Unknown Date"}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Processing
                    </Badge>
                    <span className="font-bold text-lg">
                      ${order.totalPrice?.toFixed(2) ?? "0.00"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded bg-muted/30 flex items-center justify-center overflow-hidden">
                            {/* Placeholder for order item image if available in future */}
                            <Package className="h-6 w-6 text-muted-foreground/50" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {item.product?.title ?? "Product"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity ?? 0} × ${item.priceAtOrder?.toFixed(2) ?? "0.00"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${((item.priceAtOrder ?? 0) * (item.quantity ?? 0)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm font-medium text-primary hover:text-primary bg-transparent hover:bg-primary/5 rounded-full px-4"
                    >
                      View Invoice <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
