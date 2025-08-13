"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { 
  CreditCard, 
  Lock, 
  Truck, 
  Shield, 
  ArrowLeft, 
  Check,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  User,
  Loader2
} from "lucide-react";

interface CheckoutItem {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  artist: {
    _id: string;
    name: string;
    isVerified: boolean;
  };
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}



export default function CheckoutPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize state hooks at the top level
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });
  
  // Get artwork ID from URL params
  const artworkId = searchParams.get('artwork');
  
  // Get Convex user ID from Clerk user ID
  const convexUserId = useQuery(
    api.users.getConvexUserIdByClerkId,
    user ? { clerkId: user.id } : "skip"
  );
  
  // Fetch artwork data
  const artwork = useQuery(api.artworks.getArtwork, artworkId ? { id: artworkId } : "skip");
  const createOrder = useMutation(api.orders.createOrder);
  
  // Redirect if not signed in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in?redirect=/checkout');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // Redirect if no artwork ID
  useEffect(() => {
    if (!artworkId) {
      router.push('/marketplace');
    }
  }, [artworkId, router]);
  
  // Show loading if artwork is being fetched or user data is loading
  if (isLoading || !artwork || !isAuthenticated || !convexUserId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }
  
  // Check if artwork is available
  if (!artwork.isAvailable) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Artwork Not Available</h2>
          <p className="text-gray-600 mb-4">This artwork is no longer available for purchase.</p>
          <Link href="/marketplace" className="text-blue-600 hover:text-blue-700">
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }
  
  const checkoutItem: CheckoutItem = {
    _id: artwork._id,
    title: artwork.title,
    price: artwork.price,
    imageUrl: artwork.images[0]?.url || '/placeholder-artwork.jpg',
    artist: {
      _id: artwork.artistId,
      name: artwork.artistName || 'Unknown Artist',
      isVerified: artwork.artistVerified || false
    }
  };

  // Calculate totals
  const subtotal = checkoutItem.price;
  const shipping = 25; // Fixed shipping cost
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      if (!user || !convexUserId) {
        throw new Error('User not authenticated');
      }

      // Validate form data
      if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || 
          !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || 
          !shippingInfo.zipCode || !paymentInfo.cardNumber || !paymentInfo.expiryDate || 
          !paymentInfo.cvv || !paymentInfo.cardholderName) {
        throw new Error('Please fill in all required fields');
      }

      // TODO: Implement actual payment processing with Stripe/PayPal
      // For demo purposes, we'll proceed directly to order creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order in Convex
      const orderId = await createOrder({
        artworkId: checkoutItem._id,
        buyerId: convexUserId,
        artistId: checkoutItem.artist?._id || '',
        totalAmount: total,
        shippingAddress: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postalCode: shippingInfo.zipCode,
          country: shippingInfo.country
        },
        paymentMethod: 'credit_card',
        status: 'confirmed'
      });
      
      // Redirect to success page
      router.push(`/checkout/success?order=${orderId}`);
    } catch (error) {
      console.error("Payment failed:", error);
      setError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= step
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}>
            {step}
          </div>
          {step < 2 && (
            <div className={`w-16 h-1 mx-2 ${
              currentStep > step ? "bg-blue-600" : "bg-gray-200"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const OrderSummary = () => (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      {/* Item */}
      <div className="flex items-center space-x-4 mb-6">
        <Image
          src={checkoutItem.imageUrl}
          alt={checkoutItem.title}
          width={80}
          height={80}
          className="rounded-lg object-cover"
        />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{checkoutItem.title}</h4>
          <p className="text-sm text-gray-600">by {checkoutItem.artist.name}</p>
          {checkoutItem.artist.isVerified && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
              <Check className="h-3 w-3 mr-1" />
              Verified Artist
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">${checkoutItem.price.toLocaleString()}</p>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-2 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">${shipping}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Security Features */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Lock className="h-4 w-4 mr-1" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            <span>Buyer Protection</span>
          </div>
        </div>
      </div>
    </div>
  );

  const ShippingForm = () => (
    <form onSubmit={handleShippingSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              First Name *
            </label>
            <input
              type="text"
              value={shippingInfo.firstName}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={shippingInfo.lastName}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email *
            </label>
            <input
              type="email"
              value={shippingInfo.email}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone
            </label>
            <input
              type="tel"
              value={shippingInfo.phone}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4 inline mr-1" />
            Address *
          </label>
          <input
            type="text"
            value={shippingInfo.address}
            onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Street address"
            required
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <input
              type="text"
              value={shippingInfo.city}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
            <input
              type="text"
              value={shippingInfo.state}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
            <input
              type="text"
              value={shippingInfo.zipCode}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
            <select
              value={shippingInfo.country}
              onChange={(e) => setShippingInfo(prev => ({ ...prev, country: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <Truck className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="font-medium text-blue-900">Shipping Method</h3>
        </div>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="radio" name="shipping" value="standard" defaultChecked className="mr-3" />
            <div className="flex-1">
              <p className="font-medium text-blue-900">Standard Shipping (5-7 business days)</p>
              <p className="text-sm text-blue-700">Insured and tracked</p>
            </div>
            <span className="font-medium text-blue-900">$25</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Continue to Payment
      </button>
    </form>
  );

  const PaymentForm = () => (
    <form onSubmit={handlePaymentSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="h-4 w-4 inline mr-1" />
              Card Number *
            </label>
            <input
              type="text"
              value={paymentInfo.cardNumber}
              onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
              <input
                type="text"
                value={paymentInfo.expiryDate}
                onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
              <input
                type="text"
                value={paymentInfo.cvv}
                onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name *</label>
            <input
              type="text"
              value={paymentInfo.cardholderName}
              onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardholderName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-900 mb-1">Secure Payment</h3>
            <p className="text-sm text-green-700">
              Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Back to Shipping
        </button>
        
        <button
          type="submit"
          disabled={isProcessing}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            `Complete Purchase - $${total.toFixed(2)}`
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <StepIndicator />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        {currentStep === 1 && <ShippingForm />}
        {currentStep === 2 && <PaymentForm />}
      </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}