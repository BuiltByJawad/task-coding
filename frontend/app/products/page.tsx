"use client";

import Link from "next/link";
import { useGetProductsQuery } from "@/src/lib/api/apiSlice";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { ProductCard } from "@/src/components/ProductCard";

export default function ProductsPage() {
  const { data, isLoading, isError } = useGetProductsQuery();

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive">Failed to load products.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const products = data ?? [];

  if (isLoading && !data) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="h-8 w-40 rounded bg-muted/40 animate-pulse" />
            <div className="mt-2 h-4 w-64 rounded bg-muted/30 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 rounded-full bg-primary/10 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="group h-full flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-card/50"
            >
              <div className="aspect-square bg-muted/40 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 rounded bg-muted/40 animate-pulse" />
                <div className="h-3 w-full rounded bg-muted/30 animate-pulse" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-5 w-16 rounded bg-muted/40 animate-pulse" />
                  <div className="h-5 w-20 rounded-full bg-muted/30 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">All Products</h1>
          <p className="text-muted-foreground mt-1">
            Explore our premium collection of digital and physical assets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-sm border-primary/20 bg-primary/5 text-primary">
            {products.length} Items
          </Badge>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center border border-dashed border-white/10 rounded-3xl bg-card/30">
          <p className="text-lg font-medium text-foreground">No products found</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            Check back later as we add more items to our collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
