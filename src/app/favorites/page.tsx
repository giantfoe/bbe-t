"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { 
  Heart, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SortAsc, 
  Eye, 
  Share2, 
  ShoppingCart,
  Calendar,
  User,
  Tag,
  Trash2,
  Download,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FavoriteWithArtwork {
  _id: Id<"favorites">;
  userId: Id<"users">;
  artworkId: Id<"artworks">;
  createdAt: number;
  artwork: {
    _id: Id<"artworks">;
    title: string;
    description?: string;
    price: number;
    images?: string[];
    category?: string;
    medium?: string;
    dimensions?: string;
    isAvailable: boolean;
    artistId: Id<"users">;
    artist: {
      _id: Id<"users">;
      name: string;
      profileImage?: string;
      isVerified?: boolean;
    } | null;
  };
}

export default function FavoritesPage() {
  const { user } = useUser();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isRemoving, setIsRemoving] = useState(false);

  // Fetch user's favorites from Convex
  const favorites = useQuery(
    api.favorites.getUserFavorites,
    user ? { clerkUserId: user.id } : "skip"
  ) as FavoriteWithArtwork[] | undefined;

  const removeFromFavorites = useMutation(api.favorites.removeFromFavorites);



  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (favorites === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter(item => {
      const matchesSearch = item.artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (item.artwork.artist?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.artwork.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.artwork.title.localeCompare(b.artwork.title);
        case 'artist':
          return (a.artwork.artist?.name || '').localeCompare(b.artwork.artist?.name || '');
        case 'price':
          return a.artwork.price - b.artwork.price;
        case 'dateAdded':
        default:
          return b.createdAt - a.createdAt;
      }
    });

  const categories = ['all', ...Array.from(new Set(favorites.map(item => item.artwork.category).filter(Boolean)))];

  const handleRemoveFromFavorites = async (favoriteIds: string[]) => {
    setIsRemoving(true);
    try {
      // Remove each favorite
      for (const favoriteId of favoriteIds) {
        const favorite = favorites.find(f => f._id === favoriteId);
        if (favorite && user) {
          await removeFromFavorites({
            clerkUserId: user.id,
            artworkId: favorite.artworkId,
          });
        }
      }
      setSelectedItems([]);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredFavorites.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFavorites.map(item => item._id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
                <p className="text-gray-600">
                  {favorites.length} {favorites.length === 1 ? 'artwork' : 'artworks'} saved
                </p>
              </div>
            </div>
            
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedItems.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveFromFavorites(selectedItems)}
                  disabled={isRemoving}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {isRemoving ? 'Removing...' : 'Remove'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="dateAdded">Date Added</option>
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="price">Price</option>
          </select>
          
          {/* View Mode */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {filteredFavorites.length > 0 && (
          <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredFavorites.length && filteredFavorites.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">
                Select all ({filteredFavorites.length})
              </span>
            </label>
            
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchQuery || filterCategory !== 'all' ? 'No matching favorites' : 'No favorites yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start exploring artworks and save your favorites here.'}
            </p>
            <Link href="/marketplace">
              <Button>
                Explore Marketplace
              </Button>
            </Link>
          </div>
        ) : (
          <div className={cn(
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          )}>
            {filteredFavorites.map((favorite) => (
              <Card key={favorite._id} className={cn(
                'group hover:shadow-lg transition-all duration-200',
                viewMode === 'list' && 'flex-row'
              )}>
                <CardContent className={cn(
                  'p-0',
                  viewMode === 'list' && 'flex'
                )}>
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(favorite._id)}
                      onChange={() => handleSelectItem(favorite._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white shadow-sm"
                    />
                  </div>
                  
                  {/* Image */}
                  <div className={cn(
                    'relative overflow-hidden',
                    viewMode === 'grid' ? 'aspect-square rounded-t-lg' : 'w-48 h-32 rounded-l-lg flex-shrink-0'
                  )}>
                    <img
                      src={favorite.artwork.images?.[0] || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20artwork%20placeholder&image_size=square'}
                      alt={favorite.artwork.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    
                    {/* Availability Badge */}
                    {!favorite.artwork.isAvailable && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        Sold
                      </div>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Link href={`/artwork/${favorite.artwork._id}`}>
                          <Button size="sm" variant="outline" className="bg-white text-gray-900 hover:bg-gray-100">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-white text-gray-900 hover:bg-gray-100"
                          onClick={() => handleRemoveFromFavorites([favorite._id])}
                        >
                          <Heart className="h-4 w-4 fill-current text-red-600" />
                        </Button>
                        {favorite.artwork.isAvailable && (
                          <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className={cn(
                    'p-4',
                    viewMode === 'list' && 'flex-1'
                  )}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {favorite.artwork.title}
                        </h3>
                        <Link 
                          href={`/artists/${favorite.artwork.artist?._id}`}
                          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          by {favorite.artwork.artist?.name || 'Unknown Artist'}
                        </Link>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ${favorite.artwork.price.toLocaleString()}
                        </p>
                        {!favorite.artwork.isAvailable && (
                          <p className="text-xs text-red-600">Sold</p>
                        )}
                      </div>
                    </div>
                    
                    {viewMode === 'list' && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {favorite.artwork.description || 'No description available'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {favorite.artwork.category || 'Uncategorized'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Added {new Date(favorite.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {favorite.artwork.category || 'Uncategorized'}
                      </span>
                      <span className="text-xs text-gray-500">
                        Added {new Date(favorite.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}