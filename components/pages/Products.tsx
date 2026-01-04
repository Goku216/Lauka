"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';

import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, Filter, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Product } from '@/types';
import Link from 'next/link';



interface Category {
  name: string;
  slug: string;
  reference_id: string;
  product_count?: number;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

// Configure your API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API;

export default function Products() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // State management
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // API data state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to first page on new search
    }, 800); // 800ms debounce delay

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Adjust this endpoint to match your categories API
        const response = await fetch(`${API_BASE_URL}/categories/`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        
        // Handle if your API returns paginated or direct array
        const categoriesData = data.results || data;
        setCategories(categoriesData);
        console.log(response)
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (inStockOnly) params.append('in_stock', 'true');
      if (priceRange[0] > 0) params.append('min_price', priceRange[0].toString());
      if (priceRange[1] < 1000) params.append('max_price', priceRange[1].toString());
      
      // Handle sorting
      switch (sortBy) {
        case 'price-low':
          params.append('ordering', 'price');
          break;
        case 'price-high':
          params.append('ordering', '-price');
          break;
        case 'rating':
          params.append('ordering', '-rating');
          break;
        case 'newest':
          params.append('ordering', '-created_at');
          break;
      }
      
      params.append('page', currentPage.toString());
      
      let url = `${API_BASE_URL}/products/?${params.toString()}`;
      
      // If filtering by category, use the category endpoint
      if (selectedCategories.length === 1) {
        url = `${API_BASE_URL}/products/${selectedCategories[0]}/by-category/?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data: PaginatedResponse = await response.json();
      
      setProducts(data.results);
      setTotalCount(data.count);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      
      // Calculate total pages
      const itemsPerPage = data.results.length || 10;
      setTotalPages(Math.ceil(data.count / itemsPerPage));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategories, priceRange, inStockOnly, sortBy, currentPage]);

   // Calculate discount percentage



  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug)
        ? prev.filter(c => c !== slug)
        : [...prev, slug]
    );
    setCurrentPage(1); // Reset to first page
  };

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setInStockOnly(false);
    setSortBy('featured');
    setCurrentPage(1);
    router.replace(pathname || '/products');
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="font-semibold mb-4">Categories</h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.reference_id} className="flex items-center gap-2">
              <Checkbox
                id={category.slug}
                checked={selectedCategories.includes(category.reference_id)}
                onCheckedChange={() => toggleCategory(category.reference_id)}
              />
              <label htmlFor={category.slug} className="text-sm cursor-pointer">
                {category.name} {category.product_count && `(${category.product_count})`}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-4">Price Range</h4>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            value={priceRange[0]}
            onChange={(e) => {
              setPriceRange([Number(e.target.value), priceRange[1]]);
              setCurrentPage(1);
            }}
            className="w-20"
          />
          <span>-</span>
          <Input
            type="number"
            placeholder="Max"
            value={priceRange[1]}
            onChange={(e) => {
              setPriceRange([priceRange[0], Number(e.target.value)]);
              setCurrentPage(1);
            }}
            className="w-20"
          />
        </div>
      </div>

      {/* In Stock */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="inStock"
          checked={inStockOnly}
          onCheckedChange={(checked) => {
            setInStockOnly(checked as boolean);
            setCurrentPage(1);
          }}
        />
        <label htmlFor="inStock" className="text-sm cursor-pointer">
          In Stock Only
        </label>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/">Home</Link> / <span className="text-foreground">Products</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 bg-card p-6 rounded-2xl shadow-card">
              <h3 className="font-bold text-lg mb-6">Filters</h3>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">All Products</h1>
                <p className="text-muted-foreground">
                  {loading ? 'Loading...' : `${totalCount} products found`}
                </p>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                  {search && search !== debouncedSearch && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || debouncedSearch || inStockOnly) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map((catId) => (
                  <span
                    key={catId}
                    className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {categories.find(c => c.reference_id === catId)?.name}
                    <button onClick={() => toggleCategory(catId)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {debouncedSearch && (
                  <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm">
                    Search: {debouncedSearch}
                    <button onClick={() => {
                      setSearch('');
                      setDebouncedSearch('');
                    }}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6">
                <p>{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length > 0 ? (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.reference_id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!previousPage || currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="icon"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!nextPage || currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No products found</p>
                <Button onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}