"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Image from "next/image";
import Link from "next/link";
import { toast } from 'sonner';
import { 
  Heart, 
  Share2, 
  ShoppingCart, 
  ArrowLeft,
  ZoomIn,
  Star,
  Shield,
  Truck,
  RotateCcw
} from "lucide-react";



export default function ArtworkDetailsPage() {
  const params = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  
  const { user } = useUser();
  const addToCart = useMutation(api.cart.addToCart);
  const toggleFavorite = useMutation(api.favorites.toggleFavorite);
  
  // Fetch artwork data from Convex
  const artwork = useQuery(api.artworks.getArtwork, {
    id: params.id as any
  });
  
  // Get Convex user ID from Clerk user ID
  const convexUserId = useQuery(
    api.users.getConvexUserIdByClerkId,
    user ? { clerkId: user.id } : "skip"
  );
  
  // Check if artwork is favorited by current user
  const isFavorited = useQuery(
    api.favorites.isArtworkFavorited,
    user && artwork ? { clerkUserId: user.id, artworkId: artwork._id as any } : "skip"
  );
  
  // Loading state
  if (artwork === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading artwork...</p>
        </div>
      </div>
    );
  }
  
  // Not found state
  if (artwork === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Artwork Not Found</h1>
          <p className="text-gray-600 mb-4">The artwork you're looking for doesn't exist.</p>
          <Link 
            href="/marketplace"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
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
        quantity,
      });
      
      toast.success(`Added ${quantity} item(s) to cart successfully!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please sign in to purchase artwork');
      return;
    }
    
    if (!artwork.isAvailable) {
      toast.error('This artwork is no longer available');
      return;
    }
    
    // Implement checkout flow - redirect to checkout page with artwork details
    const checkoutUrl = `/checkout?artworkId=${artwork._id}&quantity=${quantity}&price=${artwork.price}&title=${encodeURIComponent(artwork.title)}&artist=${encodeURIComponent(artwork.artist?.name || '')}`;
    
    toast.info('Redirecting to checkout...');
    window.location.href = checkoutUrl;
  };

  const handleShare = async () => {
    const shareData = {
      title: artwork.title,
      text: `Check out "${artwork.title}" by ${artwork.artist?.name}`,
      url: window.location.href,
    };
    
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/marketplace" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
              <Image
                src={artwork.images[selectedImageIndex]?.url || ''}
                alt={artwork.title}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setShowZoom(true)}
                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {artwork.images.length > 1 && (
              <div className="flex space-x-2">
                {artwork.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${artwork.title} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Artwork Details */}
          <div className="space-y-6">
            {/* Title and Artist */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{artwork.title}</h1>
              {artwork.artist && (
                <Link 
                  href={`/artist/${artwork.artist._id}`}
                  className="inline-flex items-center text-lg text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Image
                    src={artwork.artist.profileImage || '/default-avatar.png'}
                    alt={artwork.artist.name}
                    width={32}
                    height={32}
                    className="rounded-full mr-2"
                  />
                  {artwork.artist.name}
                  {artwork.artist.isVerified && (
                  <Star className="h-4 w-4 ml-1 text-yellow-500 fill-current" />
                  )}
                </Link>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">${artwork.price.toFixed(2)}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={async () => {
                  if (!user || !convexUserId) {
                    toast.error('Please sign in to favorite artworks');
                    return;
                  }
                  
                  setIsTogglingFavorite(true);
                  
                  try {
                    const result = await toggleFavorite({
                      userId: convexUserId,
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
                }}
                disabled={isTogglingFavorite}
                className={`p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFavorited
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <div className="flex-1" />
              <span className="text-sm text-gray-600">Available</span>
            </div>

            {/* Purchase Section */}
            <div className="border-t pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !artwork.isAvailable}
                    className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isAddingToCart ? 'Adding...' : !artwork.isAvailable ? 'Unavailable' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Artwork Info */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Artwork Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 text-gray-900">{artwork.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Medium:</span>
                  <span className="ml-2 text-gray-900">{artwork.medium}</span>
                </div>
                {artwork.dimensions && artwork.dimensions.width && artwork.dimensions.height && artwork.dimensions.unit && (
                  <div>
                    <span className="text-gray-500">Dimensions:</span>
                    <span className="ml-2 text-gray-900">
                      {artwork.dimensions.width} × {artwork.dimensions.height}
                      {artwork.dimensions.depth && ` × ${artwork.dimensions.depth}`} {artwork.dimensions.unit}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Year:</span>
                  <span className="ml-2 text-gray-900">{artwork.yearCreated}</span>
                </div>
                <div>
                  <span className="text-gray-500">Edition:</span>
                  <span className="ml-2 text-gray-900">
                    {artwork.edition ? `${artwork.edition.current} of ${artwork.edition.total}` : 'Original'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Certificate:</span>
                  <span className="ml-2 text-gray-900">Not included</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{artwork.description}</p>
            </div>

            {/* Tags */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Shipping & Returns */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Shipping & Returns</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Truck className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-gray-700">
                    Free shipping • 5-7 days
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <RotateCcw className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-gray-700">
                    Returns accepted within 30 days
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-gray-700">Authenticity guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {showZoom && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Image
              src={artwork.images[selectedImageIndex]?.url || ''}
              alt={artwork.title}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}