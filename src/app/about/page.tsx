"use client";

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Users, 
  Heart, 
  Globe, 
  Award, 
  Target, 
  Eye, 
  Lightbulb, 
  Handshake,
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
}

export default function AboutPage() {
  const stats: Stat[] = [
    {
      label: 'Artists Worldwide',
      value: '10,000+',
      icon: Users
    },
    {
      label: 'Artworks Sold',
      value: '50,000+',
      icon: TrendingUp
    },
    {
      label: 'Countries Served',
      value: '75+',
      icon: Globe
    },
    {
      label: 'Customer Satisfaction',
      value: '98%',
      icon: Star
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      bio: 'Former art gallery director with 15+ years in the art world. Passionate about democratizing art access.',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20asian%20woman%20CEO%20confident%20business%20attire&image_size=square',
      linkedin: 'https://linkedin.com/in/sarahchen',
      twitter: 'https://twitter.com/sarahchen',
      email: 'sarah@artmarketplace.com'
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      role: 'CTO',
      bio: 'Tech veteran with expertise in e-commerce platforms and digital marketplaces. Loves combining art and technology.',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20hispanic%20man%20CTO%20tech%20leader%20modern%20office&image_size=square',
      linkedin: 'https://linkedin.com/in/marcusrodriguez',
      twitter: 'https://twitter.com/marcustech'
    },
    {
      id: '3',
      name: 'Elena Kowalski',
      role: 'Head of Artist Relations',
      bio: 'Former artist and curator who understands the challenges artists face. Dedicated to supporting creative communities.',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20european%20woman%20art%20curator%20creative%20professional&image_size=square',
      linkedin: 'https://linkedin.com/in/elenakowalski',
      email: 'elena@artmarketplace.com'
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'Head of Design',
      bio: 'Award-winning designer focused on creating beautiful, intuitive experiences that showcase art in its best light.',
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20asian%20man%20designer%20creative%20modern%20style&image_size=square',
      linkedin: 'https://linkedin.com/in/davidkim',
      twitter: 'https://twitter.com/daviddesigns'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion for Art',
      description: 'We believe art has the power to inspire, heal, and bring people together. Every decision we make is guided by our love for artistic expression.'
    },
    {
      icon: Handshake,
      title: 'Artist-First Approach',
      description: 'Artists are at the heart of everything we do. We provide fair compensation, marketing support, and tools to help them thrive.'
    },
    {
      icon: Shield,
      title: 'Trust & Authenticity',
      description: 'We guarantee the authenticity of every piece and provide secure transactions, building trust between artists and collectors.'
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Art should be accessible to everyone, everywhere. We connect artists and art lovers across borders and cultures.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We continuously innovate to improve the art buying and selling experience through technology and user-centered design.'
    },
    {
      icon: Zap,
      title: 'Empowerment',
      description: 'We empower artists to build sustainable careers and help collectors discover their next favorite piece.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connecting Artists with the World
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              We're building the future of art commerce, where creativity meets opportunity and passion finds its perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  Explore Artworks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/artists">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  Meet Our Artists
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                To democratize the art world by creating a platform where artists can showcase their work to a global audience and art lovers can discover, collect, and support the artists they admire.
              </p>
              <p className="text-gray-600 mb-8">
                We believe that art should be accessible to everyone, regardless of their location or background. Our platform breaks down traditional barriers in the art world, connecting emerging and established artists with collectors, enthusiasts, and art lovers worldwide.
              </p>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Our Vision</h3>
                  <p className="text-gray-600">A world where every artist has the opportunity to share their creativity and build a sustainable career.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=diverse%20group%20of%20artists%20working%20in%20modern%20studio%20collaborative%20creative%20space&image_size=landscape_4_3"
                alt="Artists working together"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape the way we build our platform and community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{value.title}</h3>
                    </div>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're a passionate team of art lovers, technologists, and business professionals working together to transform the art world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="text-center hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
                  
                  <div className="flex justify-center gap-2">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=art%20gallery%20opening%20diverse%20crowd%20viewing%20paintings%20modern%20space&image_size=landscape_4_3"
                alt="Art gallery opening"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2020 by a team of art enthusiasts and technology experts, our platform was born from a simple observation: talented artists around the world were struggling to reach audiences beyond their local communities.
                </p>
                <p>
                  We started with a vision to create a digital space where art could transcend geographical boundaries and where artists could build sustainable careers doing what they love. What began as a small marketplace has grown into a global community of over 10,000 artists and countless art lovers.
                </p>
                <p>
                  Today, we're proud to have facilitated over 50,000 art sales, helping artists earn a living from their passion while bringing beautiful, authentic artwork into homes and spaces around the world.
                </p>
                <p>
                  Our journey is just beginning. We continue to innovate and expand our platform, always with our core mission in mind: empowering artists and making art accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Whether you're an artist looking to showcase your work or an art lover seeking your next favorite piece, we'd love to have you join our growing community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Start Selling Your Art
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                Discover Amazing Art
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}