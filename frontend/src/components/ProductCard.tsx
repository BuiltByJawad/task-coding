"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAddOrUpdateCartMutation, useGetCartQuery } from "@/src/lib/api/apiSlice";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import { ShoppingCart, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProductDto } from "@/src/lib/api/apiSlice";
import { useAppSelector } from "@/src/lib/store/hooks";

interface ProductCardProps {
    product: ProductDto;
}

export function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const auth = useAppSelector((state) => state.auth);
    const [addToCart, { isLoading }] = useAddOrUpdateCartMutation();
    const { data: cartData } = useGetCartQuery();

    const cartItem = cartData?.cart?.find(item => item.product?._id === product._id);
    const quantityInCart = cartItem?.quantity || 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!product._id) return;

        if (!auth.isAuthenticated) {
            toast.error("Please log in to add items to your cart", {
                description: "Create an account or sign in to save your cart and checkout.",
            });
            const redirectTarget = `/products/${product._id}`;
            router.push(`/login?redirect=${redirectTarget}`);
            return;
        }

        const newQuantity = quantityInCart + 1;

        try {
            await addToCart({ productId: product._id, quantity: newQuantity }).unwrap();
            toast.success("Added to cart", {
                description: `${product.title} quantity updated to ${newQuantity}.`,
                duration: 2000,
            });
        } catch (error) {
            toast.error("Failed to add to cart", {
                description: "Please try again.",
            });
        }
    };

    return (
        <Card className="group h-full flex flex-col overflow-hidden border-white/5 bg-card/50 hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <CardHeader className="p-0">
                <div className="aspect-square relative overflow-hidden bg-muted/30">
                    {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={product.image}
                            alt={product.title ?? "Product"}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-muted/10">
                            No Image
                        </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <Link href={`/products/${product._id}`}>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full h-10 w-10 hover:scale-110 transition-transform bg-white/90 hover:bg-white text-black border-none"
                                title="View Details"
                            >
                                <Eye className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Button
                            size="icon"
                            className="rounded-full h-10 w-10 hover:scale-110 transition-transform bg-primary hover:bg-primary/90 text-white border-none"
                            onClick={handleAddToCart}
                            disabled={isLoading}
                            title="Add to Cart"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <ShoppingCart className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-5 space-y-3">
                <div className="space-y-1">
                    <Link href={`/products/${product._id}`} className="block">
                        <h2 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                            {product.title ?? "Untitled Product"}
                        </h2>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                        {product.description}
                    </p>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-bold text-foreground">
                        ${product.price?.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                        {quantityInCart > 0 && (
                            <Badge variant="outline" className="border-primary/50 text-primary bg-primary/5">
                                {quantityInCart} in Cart
                            </Badge>
                        )}
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                            In Stock
                        </Badge>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0">
                <Button
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                    onClick={handleAddToCart}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {quantityInCart > 0 ? "Add Another" : "Add to Cart"}
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
