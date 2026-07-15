import { Metadata } from "next";
import PageHeader from "@/components/shared/PageHeader";
import FAQAccordion from "@/components/shared/FAQAccordion";
import FadeInReveal from "@/components/shared/FadeInReveal";
import { 
  Droplets, 
  Wind, 
  Sun, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  Thermometer,
  Archive,
  Shirt,
  Diamond
} from "lucide-react";

export const metadata: Metadata = {
  title: "Care Guide | LS Collections",
  description: "Learn how to preserve the beauty and longevity of your luxury sarees and exquisite jewellery with our comprehensive care guide.",
};

const sareeCare = [
  {
    icon: <Archive className="h-6 w-6 text-gold mb-3" />,
    title: "Storage Tips",
    description: "Always store sarees in a pure cotton cloth or muslin bag to allow the fabric to breathe. Avoid plastic covers.",
  },
  {
    icon: <Droplets className="h-6 w-6 text-gold mb-3" />,
    title: "Washing Instructions",
    description: "For silk and zari work, avoid hand or machine washing. Only use professional dry cleaning services.",
  },
  {
    icon: <Thermometer className="h-6 w-6 text-gold mb-3" />,
    title: "Ironing Recommendations",
    description: "Iron on low heat with a protective cotton cloth over the saree. Never iron directly on zari work.",
  },
  {
    icon: <Shirt className="h-6 w-6 text-gold mb-3" />,
    title: "Dry Cleaning Guidance",
    description: "Seek professional dry cleaners experienced with luxury ethnic wear for optimal preservation.",
  },
];

const jewelleryCare = [
  {
    icon: <Sparkles className="h-6 w-6 text-gold mb-3" />,
    title: "Cleaning Instructions",
    description: "Gently wipe with a soft, dry cotton cloth after each use to remove natural oils and makeup.",
  },
  {
    icon: <Archive className="h-6 w-6 text-gold mb-3" />,
    title: "Storage Recommendations",
    description: "Store in individual zip-lock bags or soft pouches to prevent scratches and oxidation.",
  },
  {
    icon: <Sun className="h-6 w-6 text-gold mb-3" />,
    title: "Moisture Protection",
    description: "Keep away from water and high humidity. Always remove jewellery before swimming or showering.",
  },
  {
    icon: <Wind className="h-6 w-6 text-gold mb-3" />,
    title: "Chemical Precautions",
    description: "Apply perfumes, lotions, and hairspray before wearing your jewellery to avoid chemical reactions.",
  },
];

const faqs = [
  {
    question: "How often should I dry clean my silk saree?",
    answer: "It is recommended to dry clean your silk saree only when absolutely necessary, usually after 2-3 wears or if there are visible stains, to preserve its natural sheen."
  },
  {
    question: "Can I use naphthalene balls for storing sarees?",
    answer: "We strongly advise against using naphthalene balls as they can react with zari and cause discoloration. Use dried neem leaves or silica gel packets instead."
  },
  {
    question: "How do I prevent my artificial jewellery from tarnishing?",
    answer: "The best way to prevent tarnishing is to keep the jewellery dry, avoid direct contact with perfumes, and store it in an airtight container or zip-lock bag."
  },
  {
    question: "Is it safe to iron an embroidered saree?",
    answer: "Always iron an embroidered saree on the reverse side or place a soft muslin cloth over the embroidery before ironing on a low-heat setting."
  }
];

export default function CareGuidePage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <PageHeader 
        title="Care Guide" 
        description="Expert recommendations to preserve the elegance of your luxury collections."
        breadcrumbs={[
          { label: "Customer Care", href: "#" },
          { label: "Care Guide", href: "/care-guide" }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
        
        {/* Saree Care Section */}
        <FadeInReveal>
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl md:text-4xl text-gold tracking-widest uppercase mb-4">Saree Care</h2>
              <p className="text-zinc-400 font-light leading-relaxed">
                Your exquisite sarees require delicate handling to maintain their vibrant colors, intricate weaves, and timeless appeal. Follow these essential care instructions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sareeCare.map((item, index) => (
                <div key={index} className="bg-card/80 border border-border p-8 rounded-lg hover:border-gold/30 transition-all duration-300">
                  {item.icon}
                  <h3 className="font-serif text-lg tracking-wider text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeInReveal>

        {/* Jewellery Care Section */}
        <FadeInReveal>
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl md:text-4xl text-gold tracking-widest uppercase mb-4">Jewellery Care</h2>
              <p className="text-zinc-400 font-light leading-relaxed">
                Protect the brilliance of your statement pieces. Proper care ensures your jewellery remains a shining part of your collection for years to come.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {jewelleryCare.map((item, index) => (
                <div key={index} className="bg-card/80 border border-border p-8 rounded-lg hover:border-gold/30 transition-all duration-300">
                  {item.icon}
                  <h3 className="font-serif text-lg tracking-wider text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeInReveal>

        {/* Premium Care Tips Section */}
        <FadeInReveal>
          <div className="relative bg-gradient-to-r from-purple-royal/10 to-transparent border border-purple-royal/20 p-8 md:p-12 rounded-lg overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Diamond className="h-6 w-6 text-gold" />
                  <h2 className="font-serif text-2xl md:text-3xl text-gold tracking-widest uppercase">Premium Care</h2>
                </div>
                <p className="text-zinc-300 font-light leading-relaxed">
                  For your most treasured pieces, we recommend going the extra mile. Long-term preservation requires consistency and attention to detail.
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-zinc-400 font-light text-sm">
                    <Shield className="h-5 w-5 text-gold shrink-0" />
                    <span><strong>Long-term Preservation:</strong> Refold your silk sarees every 3-4 months to prevent deep creasing and fabric tearing along the fold lines.</span>
                  </li>
                  <li className="flex gap-3 text-zinc-400 font-light text-sm">
                    <Shield className="h-5 w-5 text-gold shrink-0" />
                    <span><strong>Luxury Fabric Handling:</strong> Never hang heavily embroidered sarees. Always store them flat to maintain their shape and prevent stretching.</span>
                  </li>
                  <li className="flex gap-3 text-zinc-400 font-light text-sm">
                    <Shield className="h-5 w-5 text-gold shrink-0" />
                    <span><strong>Gold Plated Jewellery:</strong> Wipe clean after every use to remove sweat. Store with anti-tarnish strips to preserve the gold plating longer.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </FadeInReveal>

        {/* Do's and Don'ts */}
        <FadeInReveal>
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="font-serif text-3xl md:text-4xl text-gold tracking-widest uppercase mb-4">Care Do's & Don'ts</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted/80 border border-green-500/20 p-8 rounded-lg">
                <h3 className="font-serif text-xl tracking-wider text-green-400 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" /> The Do's
                </h3>
                <ul className="space-y-4 text-zinc-300 font-light">
                  <li className="flex gap-3 items-start">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"></div>
                    <p>Always air your sarees in the shade after wearing them before storing.</p>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"></div>
                    <p>Wear your jewellery as the last step in your dressing routine.</p>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"></div>
                    <p>Use padded hangers if you absolutely must hang lightweight sarees.</p>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"></div>
                    <p>Separate heavy zari sarees with butter paper to avoid friction.</p>
                  </li>
                </ul>
              </div>

              <div className="bg-muted/80 border border-red-500/20 p-8 rounded-lg">
                <h3 className="font-serif text-xl tracking-wider text-red-400 mb-6 flex items-center gap-2">
                  <XCircle className="h-6 w-6" /> The Don'ts
                </h3>
                <ul className="space-y-4 text-zinc-300 font-light">
                  <li className="flex gap-3 items-start">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
                    <p>Never spray perfume directly on zari work or artificial jewellery.</p>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
                    <p>Avoid drying your ethnic wear under direct sunlight.</p>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
                    <p>Never store different types of fabrics or jewellery pieces together.</p>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
                    <p>Do not use regular detergents or bleach on delicate traditional wear.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </FadeInReveal>

        {/* FAQ Section */}
        <FadeInReveal>
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="font-serif text-3xl md:text-4xl text-gold tracking-widest uppercase mb-4">Common Questions</h2>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <FAQAccordion items={faqs} />
            </div>
          </div>
        </FadeInReveal>

      </div>
    </div>
  );
}
