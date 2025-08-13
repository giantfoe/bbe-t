"use client";

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  HelpCircle, 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Users,
  CreditCard,
  Truck,
  Shield,
  Settings,
  AlertCircle,
  CheckCircle,
  Send,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  articles: number;
}

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const supportCategories: SupportCategory[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of buying and selling art on our platform',
      icon: BookOpen,
      articles: 12
    },
    {
      id: 'buying',
      title: 'Buying Art',
      description: 'Everything about purchasing, payments, and delivery',
      icon: CreditCard,
      articles: 18
    },
    {
      id: 'selling',
      title: 'Selling Art',
      description: 'Guide for artists to list and sell their artwork',
      icon: Users,
      articles: 15
    },
    {
      id: 'shipping',
      title: 'Shipping & Delivery',
      description: 'Information about shipping, tracking, and returns',
      icon: Truck,
      articles: 8
    },
    {
      id: 'account',
      title: 'Account & Settings',
      description: 'Manage your profile, preferences, and security',
      icon: Settings,
      articles: 10
    },
    {
      id: 'security',
      title: 'Security & Trust',
      description: 'Safety measures, authenticity, and fraud prevention',
      icon: Shield,
      articles: 6
    }
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I create an account?',
      answer: 'You can create an account by clicking the "Sign Up" button in the top right corner of any page. You can sign up using your email address or through social media accounts like Google or Facebook.',
      category: 'getting-started'
    },
    {
      id: '2',
      question: 'How do I purchase artwork?',
      answer: 'To purchase artwork, browse our marketplace, click on any piece you like, and click "Add to Cart" or "Buy Now". You can pay using credit cards, PayPal, or other supported payment methods.',
      category: 'buying'
    },
    {
      id: '3',
      question: 'How do I list my artwork for sale?',
      answer: 'Artists can list artwork by going to the "Upload" page, filling out the artwork details, uploading high-quality images, and setting a price. Our team reviews all submissions before they go live.',
      category: 'selling'
    },
    {
      id: '4',
      question: 'What are the shipping costs?',
      answer: 'Shipping costs vary based on the size, weight, and destination of the artwork. Costs are calculated automatically at checkout and include professional packaging and insurance.',
      category: 'shipping'
    },
    {
      id: '5',
      question: 'How do I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your orders in your account dashboard under "My Orders".',
      category: 'shipping'
    },
    {
      id: '6',
      question: 'What is your return policy?',
      answer: 'We offer a 14-day return policy for most items. Artwork must be returned in original condition and packaging. Custom or personalized pieces may not be eligible for returns.',
      category: 'buying'
    },
    {
      id: '7',
      question: 'How do you ensure artwork authenticity?',
      answer: 'All artwork comes with a certificate of authenticity. We verify artist identities and work with trusted partners to ensure the authenticity of every piece sold on our platform.',
      category: 'security'
    },
    {
      id: '8',
      question: 'How do I change my account settings?',
      answer: 'You can update your account settings by going to your profile page and clicking "Settings". From there, you can update your personal information, payment methods, and notification preferences.',
      category: 'account'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      // TODO: Implement actual contact form submission with Convex
      // For now, we'll show a success message
      setSubmitMessage('Thank you for contacting us! We\'ll get back to you within 24 hours.');
      setContactForm({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: '',
        priority: 'medium'
      });
    } catch (error) {
      setSubmitMessage('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How can we help you?
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Find answers to common questions, browse our help articles, or get in touch with our support team.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-lg shadow-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Contact Options */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Get Help Quickly</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
                <Button className="w-full">
                  Start Chat
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  <Clock className="inline h-3 w-3 mr-1" />
                  Available 9 AM - 6 PM EST
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">Send us a detailed message</p>
                <Button variant="outline" className="w-full">
                  Send Email
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  <Clock className="inline h-3 w-3 mr-1" />
                  Response within 24 hours
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-4">Call us for urgent matters</p>
                <Button variant="outline" className="w-full">
                  +1 (555) 123-4567
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  <Clock className="inline h-3 w-3 mr-1" />
                  Mon-Fri 9 AM - 6 PM EST
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Help Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{category.articles} articles</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {supportCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
            
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
                <p className="text-gray-600">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <Card key={faq.id}>
                    <CardContent className="p-0">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
                          {expandedFAQ === faq.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="px-6 pb-6">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Still need help?</h3>
                <p className="text-gray-600 mb-6">Send us a message and we&apos;ll get back to you as soon as possible.</p>
                
                {submitMessage && (
                  <div className={cn(
                    'mb-4 p-3 rounded-lg flex items-center gap-2 text-sm',
                    submitMessage.includes('error') || submitMessage.includes('Error')
                      ? 'bg-red-50 text-red-700'
                      : 'bg-green-50 text-green-700'
                  )}>
                    {submitMessage.includes('error') || submitMessage.includes('Error') ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {submitMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmitContact} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={contactForm.category}
                      onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="general">General Question</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="shipping">Shipping & Delivery</option>
                      <option value="account">Account Issues</option>
                      <option value="artist">Artist Support</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={contactForm.priority}
                      onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Please provide as much detail as possible..."
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Resources */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <Video className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
                <p className="text-gray-600 mb-4">Watch step-by-step guides for common tasks</p>
                <Button variant="outline" className="w-full">
                  Watch Videos
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">User Guide</h3>
                <p className="text-gray-600 mb-4">Comprehensive documentation and guides</p>
                <Button variant="outline" className="w-full">
                  Read Guide
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community Forum</h3>
                <p className="text-gray-600 mb-4">Connect with other users and share tips</p>
                <Button variant="outline" className="w-full">
                  Join Forum
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}