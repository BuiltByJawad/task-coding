"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/Button";
import { ArrowRight, Star, ShieldCheck, Truck, Zap } from "lucide-react";
import { useGetProductsQuery } from "@/src/lib/api/apiSlice";
import { ProductCard } from "@/src/components/ProductCard";

export default function Home() {
	const { data: products, isLoading } = useGetProductsQuery();
	const featuredProducts = products?.slice(0, 4) || [];

	return (
		<div className="flex flex-col gap-16 pb-10">
			{/* Hero Section */}
			<section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/5 border border-white/5 p-8 md:p-16 lg:p-24 text-center md:text-left">
				<div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
				<div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

				<div className="relative z-10 max-w-3xl space-y-8">
					<div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
						<span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
						New Collection 2025
					</div>

					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
						Elevate Your <br />
						<span className="text-gradient">Digital Lifestyle</span>
					</h1>

					<p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
						Discover a curated selection of premium tech essentials designed to enhance your daily workflow and entertainment.
					</p>

					<div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
						<Link href="/products">
							<Button size="lg" className="rounded-full px-8 text-base h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25">
								Shop Now <ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
						<Link href="/register">
							<Button
								variant="outline"
								size="lg"
								className="rounded-full px-8 text-base h-12 border-white/20 bg-white/10 text-foreground hover:bg-primary/10 hover:text-foreground hover:border-primary/30 backdrop-blur-sm"
							>
								Join Membership
							</Button>
						</Link>
					</div>

					<div className="pt-8 flex items-center gap-8 text-sm text-muted-foreground justify-center md:justify-start">
						<div className="flex items-center gap-2">
							<div className="flex -space-x-2">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
										U{i}
									</div>
								))}
							</div>
							<div className="flex flex-col">
								<div className="flex text-yellow-500">
									<Star className="h-3 w-3 fill-current" />
									<Star className="h-3 w-3 fill-current" />
									<Star className="h-3 w-3 fill-current" />
									<Star className="h-3 w-3 fill-current" />
									<Star className="h-3 w-3 fill-current" />
								</div>
								<span className="text-xs">10k+ Happy Customers</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{[
					{ icon: Zap, title: "Instant Delivery", desc: "Get your digital assets immediately after purchase." },
					{ icon: ShieldCheck, title: "Secure Payment", desc: "100% secure transactions with top-tier encryption." },
					{ icon: Truck, title: "Global Shipping", desc: "We ship physical goods to over 100+ countries." },
				].map((feature, i) => (
					<div key={i} className="group p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
						<div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
							<feature.icon className="h-6 w-6 text-primary" />
						</div>
						<h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
						<p className="text-sm text-muted-foreground">{feature.desc}</p>
					</div>
				))}
			</section>

			{/* Featured Products Preview */}
			<section className="space-y-8">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-3xl font-bold tracking-tight text-foreground">Trending Now</h2>
						<p className="text-muted-foreground mt-1">Top picks for this week</p>
					</div>
					<Link href="/products">
						<Button
							variant="ghost"
							className="text-primary bg-transparent hover:bg-primary/10 hover:text-foreground rounded-full px-4"
						>
							View All <ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{isLoading ? (
						// Skeleton Loading
						[1, 2, 3, 4].map((i) => (
							<div key={i} className="group relative rounded-2xl border border-white/5 bg-card overflow-hidden">
								<div className="aspect-square bg-muted/50 animate-pulse" />
								<div className="p-4 space-y-2">
									<div className="h-4 w-2/3 rounded bg-muted/50 animate-pulse" />
									<div className="h-4 w-1/3 rounded bg-muted/50 animate-pulse" />
									<div className="pt-2 flex items-center justify-between">
										<div className="h-5 w-16 rounded bg-primary/10 animate-pulse" />
										<div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
									</div>
								</div>
							</div>
						))
					) : (
						featuredProducts.map((product) => (
							<ProductCard key={product._id} product={product} />
						))
					)}
				</div>
			</section>
		</div>
	);
}
