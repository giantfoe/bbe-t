"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Search, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  Star,
  Eye,
  Heart,
  Calendar,
  User,
  Palette,
  TrendingUp,
  Crown,
  Bookmark,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

// Collection interface matching Convex data structure
interface Collection {
  _id: string;
  name: string;
  description?: string;
  coverImage?: string;
  user: {
    _id: string;
    name: string;
    profileImage?: string;
  } | null;
  userId: string;
  artworkIds: string[];
  artworkCount: number;
  previewArtworks: {
    _id: string;
    title: string;
    images: {
      url: string;
      alt: string;
      isPrimary: boolean;
    }[];
  }[];
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
}



const categories = ['All', 'Abstract', 'Contemporary', 'Digital', 'Landscape', 'Portrait', 'Photography'];
const themes = ['All', 'Contemporary', 'Urban', 'Futuristic', 'Nature', 'Classical', 'Documentary'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'artworks', label: 'Most Artworks' },
  { value: 'value', label: 'Highest Value' },
];

export default function CollectionsPage() {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);

  // Fetch collections from Convex
  const collections = useQuery(api.collections.getPublicCollections) || [];
  const isLoading = collections === undefined;

  // Filter and sort collections
  useEffect(() => {
    if (!collections || collections.length === 0) {
      setFilteredCollections([]);
      return;
    }

    let filtered = collections.filter(collection => {
      const matchesSearch = collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (collection.description && collection.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (collection.user && collection.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Note: category, theme, isFeatured, and tags are not available in the current schema
      // These filters are disabled until the schema is updated
      const matchesCategory = true; // selectedCategory === 'All' || collection.category === selectedCategory;
      const matchesTheme = true; // selectedTheme === 'All' || collection.theme === selectedTheme;
      const matchesFeatured = true; // !featuredOnly || collection.isFeatured;
      
      return matchesSearch && matchesCategory && matchesTheme && matchesFeatured;
    });

    // Sort collections
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'popular':
          // Note: stats.views not available in current schema, sorting by creation date instead
          return b.createdAt - a.createdAt;
        case 'artworks':
          return b.artworkCount - a.artworkCount;
        case 'value':
          // Note: totalValue not available in current schema, sorting by artwork count instead
          return b.artworkCount - a.artworkCount;
        default:
          return 0;
      }
    });

    setFilteredCollections(filtered);
  }, [collections, searchTerm, selectedCategory, selectedTheme, sortBy, featuredOnly]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Curated Art Collections
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover thoughtfully curated collections of exceptional artworks. 
              Each collection tells a unique story through carefully selected pieces.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>

              {/* View Mode */}
              <div className="flex border rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded-l-lg',
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded-r-lg border-l',
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Theme Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {themes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Featured Only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={featuredOnly}
                      onChange={(e) => setFeaturedOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Featured collections only</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading collections...</span>
            </div>
          )}

          {/* Results Header */}
          {!isLoading && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''} found
              </p>
            </div>
          )}

          {/* Collections Grid/List */}
          {!isLoading && viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollections.map((collection) => (
                <Card key={collection._id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={collection.coverImage || '/placeholder-collection.jpg'}
                      alt={collection.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3">
                      <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                        <Bookmark className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex -space-x-2">
                        {collection.previewArtworks.slice(0, 3).map((artwork, index) => (
                          <img
                            key={artwork._id}
                            src={artwork.images[0]?.url || '/placeholder-artwork.jpg'}
                            alt={artwork.title}
                            className="w-8 h-8 rounded border-2 border-white object-cover"
                          />
                        ))}
                        {collection.artworkCount > 3 && (
                          <div className="w-8 h-8 rounded border-2 border-white bg-gray-800 text-white text-xs flex items-center justify-center">
                            +{collection.artworkCount - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{collection.description || 'No description available'}</p>
                      </div>
                      
                      {collection.user && (
                        <div className="flex items-center gap-2">
                          <img
                            src={collection.user.profileImage || '/placeholder-avatar.jpg'}
                            alt={collection.user.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-sm text-gray-600">by {collection.user.name}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Palette className="h-4 w-4" />
                          {collection.artworkCount} artworks
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(collection.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Link href={`/collections/${collection._id}`}>
                          <Button className="w-full" size="sm">
                            View Collection
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !isLoading ? (
            <div className="space-y-4">
              {filteredCollections.map((collection) => (
                <Card key={collection._id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="relative">
                        <img
                          src={collection.coverImage || '/placeholder-collection.jpg'}
                          alt={collection.name}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                            <p className="text-gray-600">{collection.description || 'No description available'}</p>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Bookmark className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                        
                        {collection.user && (
                          <div className="flex items-center gap-2">
                            <img
                              src={collection.user.profileImage || '/placeholder-avatar.jpg'}
                              alt={collection.user.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-sm text-gray-600">Curated by {collection.user.name}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Palette className="h-4 w-4" />
                            {collection.artworkCount} artworks
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(collection.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {collection.isPublic ? 'Public' : 'Private'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-center">
                        <Link href={`/collections/${collection._id}`}>
                          <Button size="sm">
                            View Collection
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}

          {/* Empty State */}
          {!isLoading && filteredCollections.length === 0 && (
            <div className="text-center py-12">
              <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No collections found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedTheme('All');
                  setFeaturedOnly(false);
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}