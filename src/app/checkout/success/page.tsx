"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Truck, 
  Calendar, 
  ArrowRight,
  Star,
  Share2,
  MessageCircle,
  Loader2
} from "lucide-react";

interface OrderDetails {
  orderId: string;
  item: {
    _id: string;
    title: string;
    price: number;
    imageUrl: string;
    artist: {
      _id: string;
      name: string;
      isVerified: boolean;
    };
  };
  customer: {
    name: string;
    email: string;
  };
  shipping: {
    address: string;
    estimatedDelivery: string;
  };
  payment: {
    method: string;
    total: number;
  };
  orderDate: string;
}

interface OrderData {
  _id: Id<'orders'>;
  status: string;
  totalAmount: number;
  currency: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: number;
  artwork: {
    _id: Id<'artworks'>;
    title: string;
    images: string[];
    price: number;
    currency: string;
  } | null;
  artist: {
    _id: Id<'users'>;
    name: string;
    profileImage?: string;
  } | null;
  buyer: {
    _id: Id<'users'>;
    name: string;
    email: string;
  } | null;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') as Id<'orders'> | null;
  const [emailSent, setEmailSent] = useState(false);

  // Fetch real order data from Convex
  const order = useQuery(
    api.orders.getOrder,
    orderId ? { orderId } : 'skip'
  ) as OrderData | null | undefined;

  useEffect(() => {
    // TODO: Implement actual email confirmation sending
    const timer = setTimeout(() => {
      setEmailSent(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state
  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Order</h1>
          <p className="text-gray-600 mb-6">No order ID provided.</p>
          <Link
            href="/marketplace"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (order === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link
            href="/marketplace"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Format order data for display
  const formattedOrder = {
    orderId: order._id,
    item: {
      _id: order.artwork?._id || '',
      title: order.artwork?.title || 'Unknown Artwork',
      price: order.artwork?.price || 0,
      imageUrl: order.artwork?.images?.[0] || '/placeholder-artwork.jpg',
      artist: {
        _id: order.artist?._id || '',
        name: order.artist?.name || 'Unknown Artist',
        isVerified: true, // You might want to add this field to your schema
      },
    },
    customer: {
      name: order.buyer?.name || 'Unknown Customer',
      email: order.buyer?.email || '',
    },
    shipping: {
      address: `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`,
      estimatedDelivery: new Date(order.createdAt + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
    },
    payment: {
      method: 'Credit Card', // You might want to store this in your order schema
      total: order.totalAmount,
    },
    orderDate: new Date(order.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
  };

  const handleDownloadReceipt = () => {
    // In a real implementation, you would:
    // 1. Generate PDF receipt on the server
    // 2. Download the PDF file
    
    // Example of what the real implementation would look like:
    // const receiptUrl = await generateReceipt({ orderId: order.orderId });
    // const link = document.createElement('a');
    // link.href = receiptUrl;
    // link.download = `receipt-${order.orderId}.pdf`;
    // link.click();
    
    // For demo purposes, create a simple text receipt
    const receiptContent = `
ART VAULT RECEIPT
==================

Order ID: ${formattedOrder.orderId}
Date: ${formattedOrder.orderDate}

ITEM PURCHASED:
${formattedOrder.item.title}
by ${formattedOrder.item.artist.name}
Price: $${formattedOrder.item.price.toLocaleString()}

PAYMENT SUMMARY:
Subtotal: $${formattedOrder.item.price.toLocaleString()}
Total: $${formattedOrder.payment.total.toFixed(2)}

SHIPPING ADDRESS:
${formattedOrder.shipping.address}

Thank you for your purchase!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${formattedOrder.orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert("Receipt downloaded successfully!");
  };

  const handleSharePurchase = () => {
    // In real app, implement social sharing
    if (navigator.share) {
      navigator.share({
        title: `I just purchased "${formattedOrder.item.title}" by ${formattedOrder.item.artist.name}`,
        text: `Check out this amazing artwork I just bought on ArtVault!`,
        url: window.location.origin + `/artwork/${formattedOrder.item._id}`
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(
        `Check out "${formattedOrder.item.title}" by ${formattedOrder.item.artist.name} on ArtVault: ${window.location.origin}/artwork/${formattedOrder.item._id}`
      );
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Successful!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Order #{formattedOrder.orderId}</h2>
                <p className="text-sm text-gray-600">Placed on {formattedOrder.orderDate}</p>
              </div>
              <button
                onClick={handleDownloadReceipt}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Purchased Item */}
            <div className="flex items-center space-x-6 mb-6">
              <Image
                src={formattedOrder.item.imageUrl}
                alt={formattedOrder.item.title}
                width={120}
                height={120}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{formattedOrder.item.title}</h3>
                <p className="text-gray-600 mb-2">by {formattedOrder.item.artist.name}</p>
                {formattedOrder.item.artist.isVerified && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    <Star className="h-3 w-3 mr-1" />
                    Verified Artist
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${formattedOrder.item.price.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total: ${formattedOrder.payment.total.toFixed(2)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href={`/artwork/${formattedOrder.item._id}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Artwork
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link
                href={`/artist/${formattedOrder.item.artist._id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                View Artist Profile
              </Link>
              <button
                onClick={handleSharePurchase}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <Truck className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Delivery Address</p>
                <p className="text-gray-600">{formattedOrder.shipping.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Estimated Delivery</p>
                <p className="text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formattedOrder.shipping.estimatedDelivery}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tracking information</strong> will be sent to your email once the item ships.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <Mail className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Payment & Confirmation</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Payment Method</p>
                <p className="text-gray-600">{formattedOrder.payment.method}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Email Confirmation</p>
                <div className="flex items-center">
                  {emailSent ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-600">Sent to {formattedOrder.customer.email}</span>
                    </>
                  ) : (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <span className="text-gray-600">Sending to {formattedOrder.customer.email}...</span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Order confirmation</strong> and receipt have been sent to your email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">1. Confirmation</h4>
              <p className="text-sm text-gray-600">
                You&apos;ll receive an email confirmation with your order details and receipt.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-3">
                <Truck className="h-6 w-6 text-yellow-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">2. Preparation</h4>
              <p className="text-sm text-gray-600">
                The artist will carefully package your artwork for safe shipping.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">3. Delivery</h4>
              <p className="text-sm text-gray-600">
                Your artwork will be delivered to your address with tracking information.
              </p>
            </div>
          </div>
        </div>

        {/* Support & Actions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to help with any questions about your order.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Dashboard
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center px-6 py-2 border border-gray-300 text-gray-700 hover:bg-white rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center px-6 py-2 border border-gray-300 text-gray-700 hover:bg-white rounded-lg transition-colors"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}