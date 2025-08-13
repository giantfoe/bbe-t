"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Heart, 
  Share2, 
  Star,
  Grid3X3,
  List,
  Filter,
  Search
} from "lucide-react";
import { ArtworkCard } from "@/components/artwork/ArtworkCard";

// Mock data removed - now using real Convex data

export default function ArtistProfilePage() {
  const params = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch artist profile and artworks from Convex
  const artistId = params.id as Id<"users">;
  const artistProfile = useQuery(api.users.getArtistProfile, { artistId });
  const artistArtworks = useQuery(api.artworks.getArtworksByArtist, { 
    artistId,
    isAvailable: undefined // Get all artworks (available and sold)
  });

  // Loading state
  if (artistProfile === undefined || artistArtworks === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading artist profile...</p>
        </div>
      </div>
    );
  }

  // Artist not found
  if (!artistProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Artist Not Found</h1>
          <p className="text-gray-600 mb-4">The artist you're looking for doesn't exist.</p>
          <Link href="/marketplace" className="text-blue-600 hover:text-blue-700">
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const artist = artistProfile;
  const artworks = artistArtworks || [];

  const handleFollow = async () => {
    try {
      // In a real implementation, you would:
      // 1. Call Convex mutation to follow/unfollow the artist
      // 2. Update the UI based on the result
      
      // Example of what the real implementation would look like:
      // if (isFollowing) {
      //   await unfollowArtist({ artistId: params.id, userId: user.id });
      // } else {
      //   await followArtist({ artistId: params.id, userId: user.id });
      // }
      
      // For demo purposes, just toggle the state
      setIsFollowing(!isFollowing);
      
      // Show feedback to user
      const action = isFollowing ? 'unfollowed' : 'followed';
      alert(`You have ${action} ${artist.name}!`);
    } catch (error) {
      console.error('Follow/unfollow failed:', error);
      alert('Failed to update follow status. Please try again.');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${artist.name} - Artist Profile`,
        text: `Check out ${artist.name}'s amazing artwork collection`,
        url: window.location.href
      });
    }
  };

  // Filter and sort artworks
  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === "all" || 
      (filterBy === "available" && artwork.isAvailable) ||
      (filterBy === "sold" && !artwork.isAvailable) ||
      (filterBy === "featured" && artwork.isFeatured);
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "popular":
        return (b.likes || 0) - (a.likes || 0);
      case "newest":
      default:
        return new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gray-200">
        <Image
          src={artist.coverImage}
          alt={`${artist.name} cover`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      {/* Artist Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white overflow-hidden">
                <Image
                  src={artist.profileImage}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
              {artist.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-white fill-current" />
                </div>
              )}
            </div>

            {/* Artist Details */}
            <div className="flex-1 mt-4 md:mt-0">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{artist.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {artist.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {new Date(artist.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex space-x-6 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{artist.stats?.totalArtworks || 0}</div>
                        <div className="text-sm text-gray-600">Artworks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">0</div>
                        <div className="text-sm text-gray-600">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{artist.stats?.totalSales || 0}</div>
                        <div className="text-sm text-gray-600">Sales</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-4 md:mt-0">
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        isFollowing
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <Users className="h-4 w-4 mr-2 inline" />
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Bio */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{artist.bio}</p>
              
              {/* Specialties */}
              {artist.specialties && artist.specialties.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Summary */}
              {artist.stats && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Artist Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Total Sales</div>
                      <div className="text-lg font-semibold text-gray-900">{artist.stats.totalSales}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Average Rating</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {artist.stats.averageRating > 0 ? `${artist.stats.averageRating}/5` : 'No ratings yet'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Connect</h2>
              <div className="space-y-3">
                {artist.website && (
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    🌐 Website
                  </a>
                )}
                {artist.socialLinks?.instagram && (
                  <a
                    href={`https://instagram.com/${artist.socialLinks.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    📷 {artist.socialLinks.instagram}
                  </a>
                )}
                {artist.socialLinks?.twitter && (
                  <a
                    href={`https://twitter.com/${artist.socialLinks.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    🐦 {artist.socialLinks.twitter}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Artworks Section */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <h2 className="text-2xl font-semibold text-gray-900">Artworks ({filteredArtworks.length})</h2>
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search artworks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Artworks</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="featured">Featured</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Artworks Grid/List */}
          <div className="p-6">
            {filteredArtworks.length > 0 ? (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {filteredArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork._id}
                    artwork={{
                      ...artwork,
                      id: artwork._id,
                      image: artwork.imageUrl,
                      artist: {
                        _id: artist._id,
                        name: artist.name,
                        profileImage: artist.profileImage,
                        isVerified: artist.isVerified,
                      },
                      stats: {
                        likes: artwork.likes || 0,
                        views: artwork.views || 0,
                      },
                      availability: artwork.isAvailable ? "available" : "sold",
                    }}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}