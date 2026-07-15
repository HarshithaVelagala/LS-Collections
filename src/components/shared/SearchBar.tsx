"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchDropdown from "./SearchDropdown";

export default function SearchBar({ iconClassName }: { iconClassName?: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch logic
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.products || []);
        }
      } catch (error) {
        console.error("Search fetch error", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="relative flex items-center" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className={`flex items-center transition-all duration-300 ${isOpen ? "w-48 sm:w-64" : "w-0 overflow-hidden opacity-0"}`}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search collection..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-10 bg-[#F7F7F7] border border-[#ECECEC] text-foreground rounded-full px-5 text-sm focus:outline-none focus:border-[#C89B6D] focus:ring-1 focus:ring-[#C89B6D]/30 mr-2 transition-all duration-[250ms] ease-in-out placeholder:text-zinc-400"
        />
      </form>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleToggle}
        className={iconClassName || "text-foreground hover:text-[#C89B6D] hover:bg-transparent flex items-center justify-center transition-colors duration-[250ms]"}
      >
        <Search className="h-5 w-5" />
      </Button>

      <SearchDropdown 
        isOpen={isOpen && query.length > 0} 
        query={query} 
        results={results} 
        isLoading={isLoading} 
        onClose={() => setIsOpen(false)} 
      />
    </div>
  );
}
