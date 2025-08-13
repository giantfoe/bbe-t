"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Heart, Eye, ShoppingCart, Verified } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

// Helper function to format dimensions object as string
const formatDimensions = (dimensions: Dimensions): string => {
  if (dimensions.depth) {
    return `${dimensions.width} × ${dimensions.height} × ${dimensions.depth} ${dimensions.unit}`;
  }
  return `${dimensions.width} × ${dimensions.height} ${dimensions.unit}`;
};

interface Artist {
  _id: string;
  name: string;
  profileImage?: string;
  isVerified?: boolean;
}

interface ArtworkStats {
  views: number;
  likes: number;
}

interface Dimensions {
  width: number;
  height: number;
  depth?: number;
  unit: "cm" | "in";
}

interface Artwork {
  _id: string;
  title: string;
  description?: string;
  price: number;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  category: string;
  medium?: string;
  dimensions?: Dimensions;
  isAvailable: boolean;
  isFeatured?: boolean;
  tags?: string[];
  artist: Artist;
  stats?: ArtworkStats; // Made optional since it's not in the schema
}

interface ArtworkCardProps {
  artwork: Artwork;
  viewMode?: 'grid' | 'list';
  showQuickActions?: boolean;
  className?: string;
}

export function ArtworkCard({ 
  artwork, 
  viewMode = 'grid', 
  showQuickActions = true,
  className 
}: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  
  const { user } = useUser();
  const addToCart = useMutation(api.cart.addToCart);
  const toggleFavorite = useMutation(api.favorites.toggleFavorite);
  
  // Check if artwork is favorited by current user
  const favorites = useQuery(
    api.favorites.getUserFavorites,
    user ? { clerkUserId: user.id } : "skip"
  );
  const isFavorited = favorites ? favorites.some(fav => fav?.artwork?._id === artwork._id) : false;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to favorite artworks');
      return;
    }
    
    setIsTogglingFavorite(true);
    
    try {
      const result = await toggleFavorite({
        clerkUserId: user.id,
        artworkId: artwork._id as any,
      });
      
      if (result.action === 'added') {
        toast.success('Added to favorites!');
      } else {
        toast.success('Removed from favorites!');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites. Please try again.');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to add items to your cart');
      return;
    }
    
    if (!artwork.isAvailable) {
      toast.error('This artwork is no longer available');
      return;
    }
    
    setIsAddingToCart(true);
    
    try {
      await addToCart({
        clerkUserId: user.id,
        artworkId: artwork._id as any,
        quantity: 1,
      });
      
      toast.success(`Added "${artwork.title}" to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please sign in to purchase');
      return;
    }
    
    // Navigate to checkout with this specific artwork
    window.location.href = `/checkout?artwork=${artwork._id}`;
  };

  if (viewMode === 'list') {
    return (
      <Link href={`/artwork/${artwork._id}`}>
        <Card className={cn(
          "group cursor-pointer hover:shadow-lg transition-all duration-200",
          className
        )}>
          <div className="flex gap-4 p-4">
            <div className="relative w-32 h-32 flex-shrink-0">
              <img
                src={artwork.images?.[0]?.url || '/placeholder-image.jpg'}
                alt={artwork.images?.[0]?.alt || artwork.title}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
              />
              {artwork.isFeatured && (
                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  Featured
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {artwork.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">by {artwork.artist.name}</span>
                    {artwork.artist.isVerified && (
                      <Verified className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  {artwork.medium && artwork.dimensions && (
                    <p className="text-xs text-gray-500">
                      {artwork.medium} • {formatDimensions(artwork.dimensions)}
                    </p>
                  )}
                </div>
                
                {showQuickActions && (
                  <button 
                    onClick={handleLike}
                    disabled={isTogglingFavorite}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Heart 
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                      )} 
                    />
                  </button>
                )}
              </div>
              
              {artwork.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {artwork.description}
                </p>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(artwork.price)}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {artwork.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{artwork.stats?.views || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{artwork.stats?.likes || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/artwork/${artwork._id}`}>
      <Card 
        className={cn(
          "group cursor-pointer hover:shadow-lg transition-all duration-200",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={artwork.images?.[0]?.url || '/placeholder-image.jpg'}
            alt={artwork.images?.[0]?.alt || artwork.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay with quick actions */}
          {showQuickActions && (
            <div className={cn(
              "absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isAddingToCart || !artwork.isAvailable}
                className="bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                size="sm"
                onClick={handleBuyNow}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Buy Now
              </Button>
            </div>
          )}
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {artwork.isFeatured && (
              <div className="bg-primary text-white text-xs px-2 py-1 rounded">
                Featured
              </div>
            )}
            {!artwork.isAvailable && (
              <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                Sold
              </div>
            )}
          </div>
          
          {/* Like button */}
          {showQuickActions && (
            <div className="absolute top-3 right-3">
              <button 
                onClick={handleLike}
                disabled={isTogglingFavorite}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart 
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                  )} 
                />
              </button>
            </div>
          )}
          
          {/* Stats overlay */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-3 text-white text-sm">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{artwork.stats?.views || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{artwork.stats?.likes || 0}</span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
              {artwork.title}
            </h3>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">by {artwork.artist.name}</span>
              {artwork.artist.isVerified && (
                <Verified className="h-4 w-4 text-blue-500" />
              )}
            </div>
            
            {artwork.medium && artwork.dimensions && (
              <p className="text-xs text-gray-500">
                {artwork.medium} • {formatDimensions(artwork.dimensions)}
              </p>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(artwork.price)}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {artwork.category}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}