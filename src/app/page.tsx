import Navbar from "@/components/shared/Navbar";
import HeroBanner from "@/components/home/HeroBanner";
// import FeatureStrip from "@/components/home/FeatureStrip";
// import CategoryCard from "@/components/home/CategoryCard"; // Categories
// import NewArrivalsCarousel from "@/components/home/NewArrivalsCarousel";
// import BestSellersSection from "@/components/home/BestSellersSection"; // Best Sellers
// import CollectionsSection from "@/components/home/CollectionsSection";
// import CustomerReviewsCarousel from "@/components/home/CustomerReviewsCarousel"; // Testimonials
// import Footer from "@/components/shared/Footer"; // Footer contains Newsletter

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen bg-background font-sans overflow-hidden">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1 overflow-hidden">
        {/* SECTION 1: Hero Banner (Dark Luxury) */}
        <HeroBanner />

        {/* Temporarily hidden sections - commented out for visual layout refinement */}
        {/* <FeatureStrip /> */}
        {/* <CategoryCard /> */}
        {/* <NewArrivalsCarousel /> */}
        {/* <BestSellersSection /> */}
        {/* <CollectionsSection /> */}
        {/* <CustomerReviewsCarousel /> */}
      </main>

      {/* Footer commented out for minimal layout (includes Newsletter) */}
      {/* <Footer hideNewsletter={false} /> */}
    </div>
  );
}

