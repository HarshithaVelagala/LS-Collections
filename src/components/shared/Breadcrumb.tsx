import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: { label: string; href: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-serif tracking-widest uppercase">
      <Link href="/" className="text-zinc-500 hover:text-gold transition-colors">
        Home
      </Link>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2">
          <ChevronRight className="h-3 w-3 text-zinc-700" />
          {index === items.length - 1 ? (
            <span className="text-gold font-semibold" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link href={item.href} className="text-zinc-500 hover:text-gold transition-colors">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
