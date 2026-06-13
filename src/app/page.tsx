import Hero from "@/components/home/Hero";
import CategoryCarousel from "@/components/home/CategoryCarousel";
import TrendingProducts from "@/components/home/TrendingProducts";
import TrustSignals from "@/components/home/TrustSignals";
import Stats from "@/components/home/Stats";
import About from "@/components/home/About";
import Services from "@/components/home/Services";
import Process from "@/components/home/Process";
import Products from "@/components/home/Products";
import RFQ from "@/components/home/RFQ";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CategoryCarousel />
      <TrustSignals />
      <About />
      <TrendingProducts />
      <Stats />
      <Services />
      <Process />
      <Products />
      <RFQ />
    </main>
  );
}
