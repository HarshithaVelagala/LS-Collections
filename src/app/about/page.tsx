"use client";

import PageHeader from "@/components/shared/PageHeader";
import InfoSection from "@/components/shared/InfoSection";
import PromiseCard from "@/components/shared/PromiseCard";
import { ShieldCheck, Sparkles, CreditCard, Truck, RefreshCw } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="About Us" 
        description="Discover the heritage, craftsmanship, and vision behind LS Collections."
        breadcrumbs={[
          { label: "Company", href: "#" },
          { label: "About Us", href: "/about" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* Company Story */}
        <InfoSection 
          title="Our Story"
          content={
            <>
              <p>
                Founded on the principles of classic elegance and unparalleled craftsmanship, LS Collections emerged from a deep-rooted passion for traditional Indian attire and modern luxury. Our journey began with a simple yet profound vision: to bring the finest sarees and exquisite artificial jewellery to women who appreciate the true artistry of ethnic fashion.
              </p>
              <p>
                Over the years, we have meticulously curated our collections, traveling across regions to source authentic materials and collaborate with master artisans. Every piece in our collection tells a story of heritage, dedication, and the timeless beauty of Indian culture.
              </p>
            </>
          }
        />

        {/* Vision & Mission */}
        <InfoSection 
          title="Vision & Mission"
          imageOnRight={true}
          imageSrc="/images/about-vision.jpg"
          content={
            <>
              <h3 className="text-gold font-serif text-xl mb-2">Our Vision</h3>
              <p className="mb-6">
                To be the premier destination for luxury ethnic wear globally, celebrated for our commitment to quality, authenticity, and the revival of traditional craftsmanship in a contemporary world.
              </p>
              <h3 className="text-gold font-serif text-xl mb-2">Our Mission</h3>
              <p>
                We strive to empower women with fashion that is both timeless and empowering. By offering meticulously handcrafted sarees and jewellery, we aim to preserve cultural heritage while providing an exceptional shopping experience built on trust, quality, and personalized service.
              </p>
            </>
          }
        />

        {/* Craftsmanship */}
        <InfoSection 
          title="The Craftsmanship"
          imageOnRight={false}
          imageSrc="/images/about-craft.jpg"
          content={
            <>
              <p>
                At LS Collections, craftsmanship is not just a process; it is our philosophy. We partner directly with skilled weavers and artisans whose techniques have been passed down through generations. From the intricate zari work on our Banarasi silk sarees to the delicate meenakari detailing in our Kundan jewellery, every product is a testament to human skill.
              </p>
              <p>
                We take pride in our ethical sourcing and our commitment to supporting local artisan communities, ensuring that the art of traditional weaving and jewellery making continues to thrive.
              </p>
            </>
          }
        />

        {/* Our Promise Section */}
        <div className="py-16 border-t border-purple-royal/10">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-white tracking-widest uppercase mb-4">Our Promise</h2>
            <div className="h-[1px] w-16 bg-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <PromiseCard 
              icon={Sparkles} 
              title="Premium Quality" 
              description="Only the finest fabrics and materials."
              delay={0.1}
            />
            <PromiseCard 
              icon={ShieldCheck} 
              title="Trusted Craftsmanship" 
              description="Authentic artisan techniques."
              delay={0.2}
            />
            <PromiseCard 
              icon={CreditCard} 
              title="Secure Payments" 
              description="100% encrypted transactions."
              delay={0.3}
            />
            <PromiseCard 
              icon={Truck} 
              title="Fast Delivery" 
              description="Insured and rapid shipping."
              delay={0.4}
            />
            <PromiseCard 
              icon={RefreshCw} 
              title="Easy Returns" 
              description="Hassle-free 7-day policy."
              delay={0.5}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
