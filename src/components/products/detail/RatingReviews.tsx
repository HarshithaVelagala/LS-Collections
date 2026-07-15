"use client";

import { Star, CheckCircle } from "lucide-react";

interface RatingReviewsProps {
  reviews: any[];
  averageRating: string;
  totalReviews: number;
}

export default function RatingReviews({ reviews, averageRating, totalReviews }: RatingReviewsProps) {
  // Generate a mock rating breakdown based on totalReviews
  const breakdown = [
    { stars: 5, percentage: totalReviews > 0 ? 80 : 0 },
    { stars: 4, percentage: totalReviews > 0 ? 15 : 0 },
    { stars: 3, percentage: totalReviews > 0 ? 5 : 0 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 },
  ];

  return (
    <section className="mt-24 border-t border-border pt-16">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Rating Summary */}
        <div className="w-full md:w-1/3 space-y-6">
          <div>
            <h2 className="text-2xl font-serif tracking-wider text-foreground uppercase mb-2">
              Client Reviews
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold text-gold">{averageRating}</span>
              <div className="flex flex-col gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(Number(averageRating)) ? "fill-gold text-gold" : "fill-zinc-800 text-zinc-800"}`} />
                  ))}
                </div>
                <span className="text-xs text-zinc-400">Based on {totalReviews} reviews</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            {breakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12 text-xs text-zinc-300">
                  <span>{item.stars}</span>
                  <Star className="h-3 w-3 fill-gold text-gold" />
                </div>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[10px] text-zinc-500">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="w-full md:w-2/3">
          {totalReviews === 0 ? (
            <div className="bg-card p-8 border border-border text-center text-sm font-light text-muted-foreground h-full flex items-center justify-center">
              No reviews yet for this product. Be the first to share your luxury experience.
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((rev: any, index: number) => (
                <div key={index} className="bg-card p-6 border border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center border border-border">
                        <span className="text-gold font-serif font-bold">
                          {rev.user ? rev.user.charAt(0).toUpperCase() : "A"}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-serif font-bold text-foreground tracking-wide">
                          {rev.user}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex gap-0.5">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="h-2.5 w-2.5 fill-gold text-gold" />
                            ))}
                          </div>
                          <span className="flex items-center gap-1 text-[9px] text-emerald-400 tracking-wider uppercase font-bold">
                            <CheckCircle className="h-2.5 w-2.5" /> Verified Purchase
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-light">
                      {new Date(rev.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <p className="text-sm font-light text-muted-foreground italic leading-relaxed">"{rev.comment}"</p>
                  
                  {/* Optional Mock Customer Images */}
                  {index === 0 && (
                    <div className="flex gap-2 mt-4">
                      <div className="h-16 w-16 bg-muted border border-border rounded-sm"></div>
                      <div className="h-16 w-16 bg-muted border border-border rounded-sm"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
