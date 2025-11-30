"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/src/lib/api/apiSlice";
import { useAppDispatch } from "@/src/lib/store/hooks";
import { setCredentials } from "@/src/features/auth/authSlice";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/Card";
import Link from "next/link";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await login(values).unwrap();

      if (typeof window !== "undefined") {
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
        }
      }

      dispatch(setCredentials(result));
      toast.success("Welcome back!", { description: "You have successfully logged in." });
      router.push("/products");
    } catch (err: any) {
      toast.error("Login failed", { description: err?.data?.message || "Please check your credentials." });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Branding/Hero */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-primary/20 via-background to-accent/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 -mt-20 -ml-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 -mb-20 -mr-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold mb-8 shadow-lg shadow-primary/25">
            M
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Welcome back to <br />
            <span className="text-gradient">MERN Shop</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover the latest trends in fashion, electronics, and more. Sign in to access your personalized dashboard.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-4 sm:p-8 bg-background">
        <Card className="w-full max-w-md border-white/5 bg-card/50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-9"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" htmlFor="password">
                    Password
                  </label>       
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center">
                  {(error as any)?.data?.message || "Login failed. Please check your credentials."}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
