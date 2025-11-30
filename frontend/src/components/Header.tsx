"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/src/lib/store/hooks";
import { useGetCartQuery } from "@/src/lib/api/apiSlice";
import { logout } from "@/src/features/auth/authSlice";
import { Button } from "@/src/components/ui/Button";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/src/components/ui/Button"; // Re-using cn utility

export function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAppSelector((state) => state.auth);
  const { data: cartData } = useGetCartQuery(undefined, {
    // Avoid calling cart API when user is not authenticated
    skip: !auth.isAuthenticated,
  });
  // Use query data for cart count as slice might not be synced
  // Use query data for cart count as slice might not be synced
  const cartCount = cartData?.cart?.reduce((acc, item) => acc + (item.quantity || 0), 0) ?? 0;
  const displayCartCount = cartCount > 99 ? "99+" : String(cartCount);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // When the route changes after logout (e.g., to /login), hide the logout loader
  useEffect(() => {
    if (isLoggingOut) {
      setIsLoggingOut(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    dispatch(logout());
    router.push("/login");
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/products", label: "Products", requiresAuth: false },
    { href: "/cart", label: "Cart", requiresAuth: true },
    { href: "/orders", label: "Orders", requiresAuth: true },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tighter text-foreground hover:opacity-90 transition-opacity"
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/40">
            M
          </div>
          <span className="hidden sm:inline-block text-foreground">
            MERN Shop
          </span>
        </Link>

        {/* Desktop Nav - only for authenticated users */}
        {auth.isAuthenticated && (
          <nav className="hidden md:flex items-center gap-8">
            {navLinks
              .filter((link) => !link.requiresAuth || auth.isAuthenticated)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative group",
                    isActive(link.href) ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full",
                      isActive(link.href) ? "w-full" : "w-0"
                    )}
                  />
                </Link>
              ))}
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Cart Icon - only for authenticated users */}
          {auth.isAuthenticated && (
            <Link
              href="/cart"
              className="relative group"
              aria-label={`Cart (${cartCount} items)`}
            >
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl border border-border/70 bg-secondary/70 hover:bg-secondary hover:text-foreground text-foreground shadow-sm cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex min-w-[1.25rem] h-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-extrabold text-primary-foreground">
                    {displayCartCount}
                  </span>
                )}
              </Button>
            </Link>
          )}

          {auth.isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{auth.user?.name || "User"}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/products">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-4 rounded-full bg-transparent text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                >
                  Products
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shine-border"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl p-4 space-y-4 animate-in slide-in-from-top-5">
          <nav className="flex flex-col gap-2">
            {navLinks
              .filter((link) => !link.requiresAuth || auth.isAuthenticated)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
          </nav>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {auth.isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {auth.user?.name}
                </div>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-primary to-accent shine-border"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
    {isLoggingOut && (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )}
  </>
  );
}
