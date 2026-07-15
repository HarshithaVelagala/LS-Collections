"use client";

import PageHeader from "@/components/shared/PageHeader";
import ContactCard from "@/components/shared/ContactCard";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="Contact Us" 
        description="We are here to assist you with any inquiries regarding our collections or your orders."
        breadcrumbs={[
          { label: "Company", href: "#" },
          { label: "Contact Us", href: "/contact" }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Form */}
          <div>
            <h2 className="font-serif text-2xl text-foreground tracking-widest uppercase mb-8">Send a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-light text-muted-foreground">Full Name</label>
                  <input type="text" id="name" className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-light" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-light text-muted-foreground">Email Address</label>
                  <input type="email" id="email" className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-light" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-light text-muted-foreground">Subject</label>
                <input type="text" id="subject" className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-light" required />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-light text-muted-foreground">Message</label>
                <textarea id="message" rows={6} className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all font-light resize-none" required></textarea>
              </div>
              
              <Button type="submit" className="bg-gold hover:bg-gold-light text-luxury-black font-serif tracking-widest uppercase px-8 py-6 rounded-sm w-full md:w-auto transition-all duration-300">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Details & Info */}
          <div className="space-y-8">
            <h2 className="font-serif text-2xl text-foreground tracking-widest uppercase mb-8">Get in Touch</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ContactCard 
                icon={MapPin}
                title="Our Boutique"
                details={
                  <>
                    <p>123 Luxury Avenue</p>
                    <p>Mumbai, Maharashtra 400001</p>
                    <p>India</p>
                  </>
                }
                delay={0.1}
              />
              <ContactCard 
                icon={Clock}
                title="Business Hours"
                details={
                  <>
                    <p>Monday – Saturday</p>
                    <p className="text-gold">10:00 AM – 8:00 PM</p>
                    <p>Sunday: Closed</p>
                  </>
                }
                delay={0.2}
              />
              <ContactCard 
                icon={Phone}
                title="Phone"
                details={
                  <>
                    <p>+91 98765 43210</p>
                    <p>+91 12345 67890</p>
                  </>
                }
                delay={0.3}
              />
              <ContactCard 
                icon={Mail}
                title="Email"
                details={
                  <>
                    <p>support@lscollections.com</p>
                    <p>sales@lscollections.com</p>
                  </>
                }
                delay={0.4}
              />
            </div>

            {/* Social & WhatsApp */}
            <div className="pt-8 border-t border-purple-royal/10 text-center">
              <h3 className="font-serif text-lg text-foreground tracking-wider uppercase mb-6">Connect With Us</h3>
              <div className="flex justify-center gap-6">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/30 transition-all duration-300 group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/30 transition-all duration-300 group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-green-500 hover:border-green-500/30 transition-all duration-300 group">
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

          </div>
        </div>
        
        {/* Google Map Placeholder */}
        <div className="mt-24 w-full h-96 bg-muted border border-border relative overflow-hidden flex flex-col items-center justify-center text-muted-foreground">
          <MapPin className="w-12 h-12 mb-4 opacity-50" />
          <p className="font-serif tracking-widest uppercase">Google Maps Integration Placeholder</p>
        </div>
      </div>
    </div>
  );
}
