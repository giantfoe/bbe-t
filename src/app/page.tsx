"use client";

import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  ArrowRight, 
  Palette, 
  Users, 
  Shield, 
  Star,
  TrendingUp,
  Heart,
  Eye,
  Loader2
} from 'lucide-react';



const categories = [
  { name: 'Abstract', count: 245, color: 'bg-purple-500' },
  { name: 'Contemporary', count: 189, color: 'bg-blue-500' },
  { name: 'Digital', count: 156, color: 'bg-green-500' },
  { name: 'Landscape', count: 134, color: 'bg-orange-500' },
  { name: 'Portrait', count: 98, color: 'bg-red-500' },
  { name: 'Photography', count: 87, color: 'bg-indigo-500' }
];

const stats = [
  { label: 'Artworks', value: '10,000+', icon: Palette },
  { label: 'Artists', value: '2,500+', icon: Users },
  { label: 'Collectors', value: '15,000+', icon: Heart },
  { label: 'Sales', value: '$2.5M+', icon: TrendingUp }
];

export default function HomePage() {
  // Fetch featured artworks from Convex
  const featuredArtworks = useQuery(api.artworks.getFeaturedArtworks, { limit: 8 });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Discover &amp; Collect
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Extraordinary Art
                  </span>
                </h1>
                <p className="text-xl text-gray-300 max-w-lg">
                  Explore a curated marketplace of exceptional artworks from talented artists worldwide. 
                  Buy, sell, and trade with confidence.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/marketplace">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Marketplace
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/sign-up?role=artist">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-black">
                    Start Selling
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <Icon className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="relative">
              {featuredArtworks === undefined ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                </div>
              ) : featuredArtworks && featuredArtworks.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {featuredArtworks.slice(0, 4).map((artwork, index) => (
                    <div 
                      key={artwork._id}
                      className={`relative overflow-hidden rounded-lg ${
                        index === 0 ? 'col-span-2 h-64' : 'h-32'
                      }`}
                    >
                      <img
                        src={artwork.images?.[0]?.url || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20artwork%20placeholder&image_size=square_hd'}
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white">
                        <div className="font-semibold text-sm">{artwork.title}</div>
                        <div className="text-xs opacity-80">{artwork.artist?.name || 'Unknown Artist'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-white">
                  <p>No featured artworks available</p>
                </div>
              )}
            </div>
          
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Artworks
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked masterpieces from our most talented artists
            </p>
          </div>
          
          {featuredArtworks === undefined ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
              <span className="text-gray-600">Loading featured artworks...</span>
            </div>
          ) : featuredArtworks && featuredArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featuredArtworks.slice(0, 8).map((artwork) => (
                <Link key={artwork._id} href={`/artwork/${artwork._id}`}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={artwork.images?.[0]?.url || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20artwork%20placeholder&image_size=square_hd'}
                        alt={artwork.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-3 right-3">
                        <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">{artwork.title}</h3>
                        <p className="text-sm text-gray-600">by {artwork.artist?.name || 'Unknown Artist'}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            ${artwork.price.toLocaleString()}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {artwork.category}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Palette className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No featured artworks available</h3>
              <p className="text-gray-600">Check back later for new featured pieces!</p>
            </div>
          )}
          
          <div className="text-center">
            <Link href="/marketplace">
              <Button size="lg">
                View All Artworks
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-gray-600">
              Find the perfect artwork that matches your style
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/marketplace?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className={`w-12 h-12 ${category.color} rounded-full mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} artworks</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose ArtVault */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ArtVault?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a secure, transparent, and artist-friendly platform for art trading
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Transactions</h3>
              <p className="text-gray-600">
                All transactions are protected with bank-level security and escrow services
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Curated Quality</h3>
              <p className="text-gray-600">
                Every artwork is carefully reviewed to ensure exceptional quality and authenticity
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Artist Support</h3>
              <p className="text-gray-600">
                We provide tools and resources to help artists succeed and grow their careers
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}