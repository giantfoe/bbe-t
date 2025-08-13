"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Heart, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  Shield, 
  Tag, 
  Gift,
  AlertCircle,
  CheckCircle,
  Info,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CartItemWithArtwork {
  _id: Id<"cart">;
  userId: Id<"users">;
  artworkId: Id<"artworks">;
  quantity: number;
  addedAt: number;
  artwork: {
    _id: Id<"artworks">;
    title: string;
    price: number;
    images: string[];
    category: string;
    medium: string;
    dimensions: string;
    isAvailable: boolean;
    artistId: Id<"users">;
    artist: {
      _id: Id<"users">;
      name: string;
      profileImage?: string;
      isVerified: boolean;
    } | null;
  };
}

export default function CartPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Get Convex user ID from Clerk user ID
  const convexUserId = useQuery(
    api.users.getConvexUserIdByClerkId,
    user ? { clerkId: user.id } : "skip"
  );

  // Fetch cart items from Convex
  const cartItems = useQuery(
    api.cart.getUserCart,
    user ? { clerkUserId: user.id } : "skip"
  ) as CartItemWithArtwork[] | undefined;

  // Convex mutations
  const updateCartQuantity = useMutation(api.cart.updateCartQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);

  // Initialize selected items when cart loads
  useEffect(() => {
    if (cartItems) {
      const availableItemIds = cartItems
        .filter(item => item.artwork.isAvailable)
        .map(item => item._id);
      setSelectedItems(availableItemIds);
    }
  }, [cartItems]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const updateQuantity = async (itemId: string, artworkId: Id<"artworks">, newQuantity: number) => {
    if (newQuantity < 1 || !user) return;
    
    setIsUpdating(itemId);
    try {
      await updateCartQuantity({
        clerkUserId: user.id,
        artworkId,
        quantity: newQuantity
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const removeItem = async (itemId: string, artworkId: Id<"artworks">) => {
    if (!user) return;
    
    setIsUpdating(itemId);
    try {
      await removeFromCart({
        clerkUserId: user.id,
        artworkId
      });
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    
    setIsApplyingPromo(true);
    setPromoMessage('');
    
    try {
      // Simulate promo code validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock promo codes for demo
      const promoCodes = {
        'SAVE10': { type: 'percentage', value: 10, message: '10% discount applied!' },
        'SAVE50': { type: 'fixed', value: 50, message: '$50 discount applied!' },
        'WELCOME': { type: 'percentage', value: 15, message: 'Welcome! 15% discount applied!' }
      };
      
      const promo = promoCodes[promoCode.toUpperCase()];
      
      if (promo) {
        if (promo.type === 'percentage') {
          setPromoDiscount(promo.value / 100);
        } else {
          // For fixed discounts, calculate percentage based on subtotal
          setPromoDiscount(Math.min(promo.value / subtotal, 1));
        }
        setPromoMessage(promo.message);
      } else {
        setPromoMessage('Invalid promo code. Please try again.');
        setPromoDiscount(0);
      }
    } catch (error) {
      setPromoMessage('Error applying promo code. Please try again.');
      setPromoDiscount(0);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (!cartItems) return;
    const availableItems = cartItems.filter(item => item.artwork.isAvailable);
    if (selectedItems.length === availableItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(availableItems.map(item => item._id));
    }
  };

  // Calculate totals
  const selectedCartItems = cartItems?.filter(item => selectedItems.includes(item._id) && item.artwork.isAvailable) || [];
  const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.artwork.price * item.quantity), 0);
  const shippingCost = selectedCartItems.length > 0 ? 50 : 0; // Flat shipping rate
  const discountAmount = subtotal * promoDiscount;
  const total = subtotal + shippingCost - discountAmount;

  const availableItems = cartItems?.filter(item => item.artwork.isAvailable) || [];
  const unavailableItems = cartItems?.filter(item => !item.artwork.isAvailable) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/marketplace" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                  <p className="text-gray-600">
                    {cartItems?.length || 0} {(cartItems?.length || 0) === 1 ? 'item' : 'items'} in your cart
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!cartItems || cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Discover amazing artworks and add them to your cart.</p>
            <Link href="/marketplace">
              <Button>
                Explore Marketplace
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Select All */}
              {availableItems.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === availableItems.length && availableItems.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-900">
                        Select all available items ({availableItems.length})
                      </span>
                    </label>
                  </CardContent>
                </Card>
              )}

              {/* Available Items */}
              {availableItems.map((item) => (
                <Card key={item._id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Selection Checkbox */}
                      <div className="p-4 flex items-start">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item._id)}
                          onChange={() => toggleItemSelection(item._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-2"
                        />
                      </div>
                      
                      {/* Image */}
                      <div className="w-32 h-32 flex-shrink-0">
                        <img
                          src={item.artwork.images?.[0] || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20artwork%20placeholder&image_size=square'}
                          alt={item.artwork.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <Link 
                              href={`/artwork/${item.artwork._id}`}
                              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {item.artwork.title}
                            </Link>
                            <Link 
                              href={`/artists/${item.artwork.artistId}`}
                              className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              by {item.artwork.artist?.name || 'Unknown Artist'}
                            </Link>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>{item.artwork.medium}</span>
                              {item.artwork.dimensions && item.artwork.dimensions.width && item.artwork.dimensions.height && item.artwork.dimensions.unit && (
                                <span>
                                  {item.artwork.dimensions.width} × {item.artwork.dimensions.height}
                                  {item.artwork.dimensions.depth && ` × ${item.artwork.dimensions.depth}`} {item.artwork.dimensions.unit}
                                </span>
                              )}
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {item.artwork.category}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              ${item.artwork.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              + $50 shipping
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Qty:</span>
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() => updateQuantity(item._id, item.artwork._id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isUpdating === item._id}
                                className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-3 py-1 text-sm font-medium">
                                {isUpdating === item._id ? '...' : item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item._id, item.artwork._id, item.quantity + 1)}
                                disabled={isUpdating === item._id}
                                className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-600 hover:text-red-600"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(item._id, item.artwork._id)}
                              disabled={isUpdating === item._id}
                              className="text-gray-600 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                          <Truck className="h-3 w-3" />
                          <span>Estimated delivery: 5-7 business days</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Unavailable Items */}
              {unavailableItems.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Unavailable Items</span>
                  </div>
                  
                  {unavailableItems.map((item) => (
                    <Card key={item._id} className="opacity-60">
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className="w-32 h-32 flex-shrink-0">
                            <img
                              src={item.artwork.images?.[0] || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20artwork%20placeholder&image_size=square'}
                              alt={item.artwork.title}
                              className="w-full h-full object-cover grayscale"
                            />
                          </div>
                          
                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{item.artwork.title}</h3>
                                <p className="text-sm text-gray-600">by {item.artwork.artist?.name || 'Unknown Artist'}</p>
                                <p className="text-xs text-red-600 mt-1">Currently unavailable</p>
                              </div>
                              
                              <div className="text-right">
                                <p className="font-bold text-gray-900">
                                  ${item.artwork.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeItem(item._id, item.artwork._id)}
                                disabled={isUpdating === item._id}
                                className="text-gray-600 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Promo Code */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Promo Code</h3>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Button
                          onClick={applyPromoCode}
                          disabled={isApplyingPromo || !promoCode.trim()}
                          size="sm"
                        >
                          {isApplyingPromo ? 'Applying...' : 'Apply'}
                        </Button>
                      </div>
                      
                      {promoMessage && (
                        <div className={cn(
                          'flex items-center gap-2 text-sm p-2 rounded',
                          promoMessage.includes('applied') || promoMessage.includes('discount')
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        )}>
                          {promoMessage.includes('applied') || promoMessage.includes('discount') ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                          {promoMessage}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                    
                    {selectedCartItems.length === 0 ? (
                      <div className="text-center py-4">
                        <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Select items to see order summary</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal ({selectedCartItems.length} items)</span>
                          <span className="font-medium">${subtotal.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium">${shippingCost.toLocaleString()}</span>
                        </div>
                        
                        {promoDiscount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount ({Math.round(promoDiscount * 100)}% off)</span>
                            <span>-${discountAmount.toLocaleString()}</span>
                          </div>
                        )}
                        
                        <div className="border-t pt-3">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="font-bold text-xl text-gray-900">
                              ${total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 pt-4">
                          <Link href={selectedCartItems.length > 0 ? `/checkout?artwork=${selectedCartItems[0].artwork._id}` : "/checkout"}>
                            <Button className="w-full" size="lg" disabled={selectedCartItems.length === 0}>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Proceed to Checkout
                            </Button>
                          </Link>
                          
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <Shield className="h-3 w-3" />
                            <span>Secure checkout with SSL encryption</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Trust Badges */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Why Shop With Us</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Secure Payments</p>
                          <p className="text-xs text-gray-600">SSL encrypted transactions</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Fast Shipping</p>
                          <p className="text-xs text-gray-600">Professional packaging & handling</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Authenticity Guaranteed</p>
                          <p className="text-xs text-gray-600">Certificate of authenticity included</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}