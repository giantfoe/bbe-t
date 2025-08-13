"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
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
  Users,
  Eye,
  Heart,
  CheckCircle,
  MapPin,
  Calendar,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Artist {
  _id: Id<'users'>;
  name: string;
  email: string;
  role: 'artist';
  bio?: string;
  profileImage?: string;
  location?: string;
  website?: string;
  isVerified: boolean;
  createdAt: number;
  artworkCount: number;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

const specialties = ['All', 'Abstract', 'Contemporary', 'Digital Art', 'Landscape', 'Portrait', 'Photography', 'Urban Art', 'Classical'];
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'artworks', label: 'Most Artworks' },
];

export default function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);

  // Fetch artists from Convex
  const artists = useQuery(
    api.users.getArtists,
    { limit: 50, isVerified: verifiedOnly || undefined }
  ) as Artist[] | undefined;

  // Filter and sort artists
  useEffect(() => {
    if (!artists) return;

    let filtered = artists.filter(artist => {
      const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (artist.bio && artist.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (artist.location && artist.location.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Note: We'll need to add specialties to the user schema or derive from artworks
      const matchesSpecialty = selectedSpecialty === 'All'; // For now, show all
      
      const matchesVerified = !verifiedOnly || artist.isVerified;
      
      return matchesSearch && matchesSpecialty && matchesVerified;
    });

    // Sort artists
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'popular':
          // For now, sort by artwork count as a proxy for popularity
          return b.artworkCount - a.artworkCount;
        case 'rating':
          // We'll need to add rating to the artist data
          return 0;
        case 'artworks':
          return b.artworkCount - a.artworkCount;
        default:
          return 0;
      }
    });

    setFilteredArtists(filtered);
  }, [artists, searchTerm, selectedSpecialty, sortBy, verifiedOnly]);

  // Show loading state
  if (artists === undefined) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading artists...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Talented Artists
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our community of creative professionals from around the world. 
              Find your next favorite artist and discover unique artworks.
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
                placeholder="Search artists..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Specialty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
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

                {/* Verified Only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Verified artists only</span>
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
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {filteredArtists.length} artist{filteredArtists.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Artists Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtists.map((artist) => (
                <Card key={artist._id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={artist.profileImage || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20artist%20portrait%20creative%20studio&image_size=landscape_16_9'}
                      alt={`${artist.name} cover`}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="absolute -bottom-6 left-6">
                      <img
                        src={artist.profileImage || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20artist%20portrait%20creative&image_size=square'}
                        alt={artist.name}
                        className="w-12 h-12 rounded-full border-4 border-white object-cover"
                      />
                    </div>
                  </div>
                  <CardContent className="pt-8 pb-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {artist.name}
                          {artist.isVerified && (
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          )}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-600">-</span>
                        </div>
                      </div>
                      
                      {artist.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2">{artist.bio}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {artist.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {artist.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {artist.artworkCount}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Link href={`/artists/${artist._id}`}>
                          <Button className="w-full" size="sm">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArtists.map((artist) => (
                <Card key={artist._id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <img
                        src={artist.profileImage || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20artist%20portrait%20creative&image_size=square'}
                        alt={artist.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            {artist.name}
                            {artist.isVerified && (
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            )}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm text-gray-600">-</span>
                          </div>
                        </div>
                        
                        {artist.bio && (
                          <p className="text-gray-600">{artist.bio}</p>
                        )}
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          {artist.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {artist.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {artist.artworkCount} artworks
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined {new Date(artist.createdAt).getFullYear()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Link href={`/artists/${artist._id}`}>
                          <Button size="sm">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredArtists.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No artists found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialty('All');
                  setVerifiedOnly(false);
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