"use client";

import { useState } from "react";
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Image from "next/image";
import Link from "next/link";
import { 
  User, 
  Heart, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Eye, 
  Plus,
  Settings,
  CreditCard,
  Star,
  Calendar,
  DollarSign,
  Upload,
  Edit3,
  Trash2
} from "lucide-react";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";

// All mock data removed - now using real Convex data

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userRole, setUserRole] = useState<"buyer" | "artist">("buyer"); // In real app, get from auth
  
  const { user } = useUser();
  
  // Fetch user's favorite artworks from Convex
  const userFavorites = useQuery(
    api.favorites.getUserFavorites,
    user?.id ? { clerkUserId: user.id } : "skip"
  );
  
  // Get Convex user ID from Clerk user ID for other APIs that still need it
  const convexUserId = useQuery(
    api.users.getConvexUserIdByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );
  
  // Fetch user statistics from Convex
  const userStats = useQuery(
    api.users.getUserStats,
    convexUserId ? { userId: convexUserId } : "skip"
  );
  
  // Fetch user's recent orders from Convex
  const userOrders = useQuery(
    api.orders.getUserOrders,
    convexUserId ? { userId: convexUserId } : "skip"
  );
  
  // Create current user object from Clerk user data
  const currentUser = user ? {
    _id: user.id,
    id: user.id,
    name: user.fullName || user.firstName || 'User',
    email: user.primaryEmailAddress?.emailAddress || '',
    profileImage: user.imageUrl || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20user%20avatar%20portrait&image_size=square',
    role: userRole,
    joinedDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    isVerified: user.hasVerifiedEmailAddress || false
  } : null;

  // Show loading state if no user
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const BuyerDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900">{userStats?.purchases || 0}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Favorites</p>
              <p className="text-2xl font-bold text-gray-900">{userStats?.favorites || 0}</p>
            </div>
            <Heart className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Following</p>
              <p className="text-2xl font-bold text-gray-900">{userStats?.following || 0}</p>
            </div>
            <User className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${userStats?.spent ? userStats.spent.toLocaleString() : '0'}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Purchases</h2>
            <Link href="/dashboard/purchases" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
        </div>
        <div className="p-6">
          {userOrders === undefined ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading purchases...</span>
            </div>
          ) : userOrders && userOrders.length > 0 ? (
            <div className="space-y-4">
              {userOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <Image
                    src={order.artwork?.images?.[0] || '/placeholder-artwork.jpg'}
                    alt={order.artwork?.title || 'Artwork'}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{order.artwork?.title || 'Unknown Artwork'}</h3>
                    <p className="text-sm text-gray-600">by {order.artist?.name || 'Unknown Artist'}</p>
                    <p className="text-sm text-gray-500">Purchased on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${order.totalAmount}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'delivered' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'confirmed'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
              <p className="text-gray-600 mb-4">Start exploring artworks and make your first purchase!</p>
              <Link 
                href="/marketplace"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Artworks
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Favorites */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Favorite Artworks</h2>
            <Link href="/dashboard/favorites" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
        </div>
        <div className="p-6">
          {userFavorites === undefined ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading favorites...</span>
            </div>
          ) : userFavorites && userFavorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userFavorites.slice(0, 6).map((favorite) => (
                favorite?.artwork ? (
                  <ArtworkCard 
                    key={favorite.artwork._id} 
                    artwork={{
                      ...favorite.artwork,
                      imageUrl: favorite.artwork.images?.[0] || '/placeholder-artwork.jpg'
                    }} 
                    viewMode="grid" 
                  />
                ) : null
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-4">Start exploring artworks and add them to your favorites!</p>
              <Link 
                href="/marketplace"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Artworks
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Fetch artist profile data for artist dashboard
  const artistProfile = useQuery(
    api.users.getArtistProfile,
    convexUserId ? { artistId: convexUserId } : "skip"
  );

  const ArtistDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Artworks</p>
              <p className="text-2xl font-bold text-gray-900">{artistProfile?.stats?.totalArtworks || 0}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{artistProfile?.stats?.totalSales || 0}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Followers</p>
              <p className="text-2xl font-bold text-gray-900">{artistProfile?.stats?.followers || 0}</p>
            </div>
            <User className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{artistProfile?.stats?.averageRating ? artistProfile.stats.averageRating.toFixed(1) : '0.0'}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/upload"
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <div className="text-center">
              <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Upload New Artwork</p>
            </div>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">View Analytics</p>
            </div>
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-center">
              <Settings className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Edit Profile</p>
            </div>
          </Link>
        </div>
      </div>

      {/* My Artworks */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Artworks</h2>
            <Link href="/dashboard/artworks" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage All
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {artistProfile?.artworks && artistProfile.artworks.length > 0 ? (
              artistProfile.artworks.slice(0, 5).map((artwork) => (
                <div key={artwork._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <Image
                    src={Array.isArray(artwork.images) && artwork.images.length > 0 
                      ? (typeof artwork.images[0] === 'string' ? artwork.images[0] : artwork.images[0]?.url || '/placeholder-artwork.jpg')
                      : '/placeholder-artwork.jpg'}
                    alt={artwork.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{artwork.title}</h3>
                    <p className="text-sm text-gray-600">{artwork.category}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">
                        <Eye className="h-4 w-4 inline mr-1" />
                        {artwork.stats?.views || 0} views
                      </span>
                      <span className="text-sm text-gray-500">
                        <Heart className="h-4 w-4 inline mr-1" />
                        {artwork.stats?.likes || 0} likes
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${artwork.price}</p>
                    <p className="text-sm text-gray-600">
                      {artwork.isAvailable ? 'Available' : 'Sold'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No artworks uploaded yet</p>
                <Link
                  href="/upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First Artwork
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src={currentUser.profileImage}
                alt={currentUser.name}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
                <p className="text-gray-600">{currentUser.email}</p>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    currentUser.role === 'artist' 
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {currentUser.role === 'artist' ? 'Artist' : 'Collector'}
                  </span>
                  {currentUser.isVerified && (
                    <Star className="h-4 w-4 text-yellow-500 ml-2" />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              {/* Role Toggle for Demo */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setUserRole("buyer")}
                  className={`px-4 py-2 text-sm font-medium ${
                    userRole === "buyer"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Buyer View
                </button>
                <button
                  onClick={() => setUserRole("artist")}
                  className={`px-4 py-2 text-sm font-medium ${
                    userRole === "artist"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Artist View
                </button>
              </div>
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {userRole === "buyer" ? <BuyerDashboard /> : <ArtistDashboard />}
      </div>
    </div>
  );
}