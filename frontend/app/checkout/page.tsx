"use client";

import type { ReactNode } from "react";
import { useGetCartQuery, usePlaceOrderMutation } from "@/src/lib/api/apiSlice";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { useRouter } from "next/navigation";
import { ShieldCheck, CreditCard, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/src/features/auth/ProtectedRoute";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading: isCartLoading } = useGetCartQuery();
  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();

  const handlePlaceOrder = async () => {
    try {
      await placeOrder().unwrap();
      toast.success("Order placed successfully!", { description: "Thank you for your purchase." });
      router.push("/orders");
    } catch (error) {
      toast.error("Failed to place order", { description: "Please try again." });
    }
  };

  let content: ReactNode;

  if (isCartLoading) {
    content = (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading checkout...</p>
        </div>
      </div>
    );
  } else if (!cart || !cart.cart || cart.cart.length === 0) {
    content = (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">Your cart is empty.</p>
        <Button onClick={() => router.push("/products")}>Start Shopping</Button>
      </div>
    );
  } else {
    const subtotal = cart.cart.reduce(
      (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0),
      0
    );
    const shipping = 0;
    const total = subtotal + shipping;

    content = (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
        {/* Left Column - Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Info */}
        <Card className="border-white/5 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input placeholder="123 Main St" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input placeholder="New York" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Postal Code</label>
                <Input placeholder="10001" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="border-white/5 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Card Number</label>
              <Input placeholder="0000 0000 0000 0000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date</label>
                <Input placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CVC</label>
                <Input placeholder="123" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 border-t border-white/5 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              Payments are secure and encrypted.
            </div>
          </CardFooter>
        </Card>
      </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-4">
          <Card className="sticky top-24 border-white/5 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {cart.cart.map((item) => (
                  <div key={item.product?._id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.product?.title}
                    </span>
                    <span className="font-medium">
                      ${((item.product?.price || 0) * (item.quantity || 0)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? "Processing..." : "Place Order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return <ProtectedRoute>{content}</ProtectedRoute>;
}
