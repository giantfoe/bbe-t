"use client";

import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArtworkCard } from '@/components/artwork/ArtworkCard';
import { 
  Search, 
  Grid3X3, 
  List, 
  SlidersHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Get unique categories and mediums from Convex data
const getUniqueValues = (artworks: any[], field: string) => {
  const values = artworks?.map(artwork => artwork[field]).filter(Boolean) || [];
  return ['All', ...Array.from(new Set(values))];
};

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMedium, setSelectedMedium] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  
  // Fetch artworks from Convex
  const artworks = useQuery(api.artworks.getArtworks, {
    paginationOpts: { numItems: 50 },
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    minPrice: priceRange.min ? parseInt(priceRange.min) : undefined,
    maxPrice: priceRange.max ? parseInt(priceRange.max) : undefined,
    isAvailable: availabilityFilter === 'available' ? true : undefined
  });
  
  // Get dynamic categories and mediums from the fetched data
  const categories = getUniqueValues(artworks?.page || [], 'category');
  const mediums = getUniqueValues(artworks?.page || [], 'medium');
  
  const [filteredArtworks, setFilteredArtworks] = useState<any[]>([]);

  // Filter and sort artworks
  useEffect(() => {
    if (!artworks?.page) return;
    
    let filtered = artworks.page.filter(artwork => {
      const matchesSearch = artwork.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artwork.artist?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artwork.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || artwork.category === selectedCategory;
      
      const matchesMedium = selectedMedium === 'All' || artwork.medium === selectedMedium;
      
      const matchesPrice = (!priceRange.min || artwork.price >= parseInt(priceRange.min)) &&
                          (!priceRange.max || artwork.price <= parseInt(priceRange.max));
      
      const matchesAvailability = availabilityFilter === 'all' || 
                                 (availabilityFilter === 'available' && artwork.isAvailable) ||
                                 (availabilityFilter === 'sold' && !artwork.isAvailable);
      
      return matchesSearch && matchesCategory && matchesMedium && matchesPrice && matchesAvailability;
    });

    // Sort artworks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          return b.stats.likes - a.stats.likes;
        case 'oldest':
          return a._id.localeCompare(b._id);
        default: // newest
          return b._id.localeCompare(a._id);
      }
    });

    setFilteredArtworks(filtered);
  }, [artworks, searchTerm, selectedCategory, selectedMedium, priceRange, sortBy, availabilityFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedMedium('All');
    setPriceRange({ min: '', max: '' });
    setAvailabilityFilter('all');
    setSortBy('newest');
  };

  // Loading state
  if (artworks === undefined) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading artworks...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-gray-600 mt-2">
                Discover exceptional artworks from talented artists worldwide
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search artworks, artists, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={cn(
            "lg:w-64 space-y-6",
            showFilters ? "block" : "hidden lg:block"
          )}>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Clear All
                </button>
              </div>
              
              {/* Categories */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        selectedCategory === category
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Medium */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900">Medium</h4>
                <div className="space-y-2">
                  {mediums.map((medium) => (
                    <button
                      key={medium}
                      onClick={() => setSelectedMedium(medium)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        selectedMedium === medium
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {medium}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900">Price Range</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>
              
              {/* Availability */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900">Availability</h4>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Artworks' },
                    { value: 'available', label: 'Available Now' },
                    { value: 'sold', label: 'Sold' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAvailabilityFilter(option.value)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        availabilityFilter === option.value
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>
                  
                  <span className="text-sm text-gray-600">
                    Showing {filteredArtworks.length} of {artworks?.length || 0} artworks
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  
                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-md">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "p-2 text-sm",
                        viewMode === 'grid'
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "p-2 text-sm border-l border-gray-300",
                        viewMode === 'list'
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Artworks Grid/List */}
            {filteredArtworks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedCategory !== 'All' || selectedMedium !== 'All' || 
                   priceRange.min || priceRange.max || availabilityFilter !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'No artworks are currently available.'}
                </p>
                {(searchTerm || selectedCategory !== 'All' || selectedMedium !== 'All' || 
                  priceRange.min || priceRange.max || availabilityFilter !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className={cn(
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-6'
                )}>
                  {filteredArtworks.map((artwork) => (
                    <ArtworkCard
                      key={artwork._id}
                      artwork={artwork}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Load More Button - Only show if we have results and potentially more data */}
                {filteredArtworks.length > 0 && filteredArtworks.length >= 20 && (
                  <div className="flex justify-center mt-12">
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8"
                    >
                      Load More Artworks
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}