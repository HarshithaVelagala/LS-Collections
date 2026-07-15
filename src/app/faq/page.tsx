"use client";

import PageHeader from "@/components/shared/PageHeader";
import FAQAccordion from "@/components/shared/FAQAccordion";

const orderFaqs = [
  { question: "How do I place an order?", answer: "Browse our collections, select your desired item and click 'Add to Cart'. Proceed to checkout, enter your shipping details, and complete the payment." },
  { question: "Can I modify my order after placing it?", answer: "Orders can be modified within 2 hours of placement. Please contact our customer support immediately." },
  { question: "How can I track my order?", answer: "Once your order is shipped, you will receive a tracking link via email and SMS. You can also track it from the 'Track Order' section in your account." }
];

const shippingFaqs = [
  { question: "Do you offer international shipping?", answer: "Yes, we ship globally. International shipping rates and delivery times vary by location." },
  { question: "How long does delivery take?", answer: "Domestic orders typically take 3-5 business days. International orders can take 7-14 business days." }
];

const returnsFaqs = [
  { question: "What is your return policy?", answer: "We offer a 7-day hassle-free return policy for unused items in their original packaging with tags intact." },
  { question: "How do I initiate a return?", answer: "Log into your account, navigate to 'My Orders', select the order, and click 'Request Return'. You can also contact our support team." }
];

const paymentFaqs = [
  { question: "What payment methods are accepted?", answer: "We accept all major Credit/Debit cards, Net Banking, UPI, and popular digital wallets." },
  { question: "Are my payment details secure?", answer: "Absolutely. Our payment gateways use industry-standard 256-bit encryption to ensure your data is safe." }
];

const productFaqs = [
  { question: "Are your sarees authentic?", answer: "Yes, we source directly from skilled artisans and weavers to ensure 100% authenticity and premium quality." },
  { question: "How do I care for my artificial jewellery?", answer: "Keep jewellery away from perfumes, water, and harsh chemicals. Store them in airtight zip-lock pouches after use." }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="Frequently Asked Questions" 
        description="Find answers to common questions about our products, shipping, and policies."
        breadcrumbs={[
          { label: "Customer Care", href: "#" },
          { label: "FAQ", href: "/faq" }
        ]}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        <section>
          <h2 className="font-serif text-2xl text-gold tracking-widest uppercase mb-6">Orders</h2>
          <FAQAccordion items={orderFaqs} />
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gold tracking-widest uppercase mb-6">Shipping & Delivery</h2>
          <FAQAccordion items={shippingFaqs} />
        </section>
        
        <section>
          <h2 className="font-serif text-2xl text-gold tracking-widest uppercase mb-6">Returns & Exchanges</h2>
          <FAQAccordion items={returnsFaqs} />
        </section>
        
        <section>
          <h2 className="font-serif text-2xl text-gold tracking-widest uppercase mb-6">Payments</h2>
          <FAQAccordion items={paymentFaqs} />
        </section>
        
        <section>
          <h2 className="font-serif text-2xl text-gold tracking-widest uppercase mb-6">Products & Care</h2>
          <FAQAccordion items={productFaqs} />
        </section>

      </div>
    </div>
  );
}
