"use client";

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  FileText, 
  Calendar, 
  AlertTriangle, 
  Shield, 
  CreditCard, 
  Users, 
  Mail, 
  ExternalLink,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Section {
  id: string;
  title: string;
  content: string[];
  icon?: React.ComponentType<any>;
}

export default function TermsPage() {
  const lastUpdated = "December 15, 2024";
  const effectiveDate = "January 1, 2025";

  const sections: Section[] = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: CheckCircle,
      content: [
        "By accessing and using the BBE-T platform (\"Service\"), you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service.",
        "These Terms of Service (\"Terms\") govern your use of our website located at bbe-t.com and any related services provided by BBE-T.",
        "We reserve the right to update and change the Terms of Service from time to time without notice. Any new features that augment or enhance the current Service shall be subject to the Terms of Service."
      ]
    },
    {
      id: "definitions",
      title: "2. Definitions",
      icon: FileText,
      content: [
        "\"Platform\" refers to the BBE-T website, mobile applications, and all related services.",
        "\"User\" refers to any individual who accesses or uses our Service.",
        "\"Artist\" refers to users who create and list artwork for sale on our platform.",
        "\"Buyer\" refers to users who purchase artwork through our platform.",
        "\"Content\" refers to all text, graphics, images, music, software, audio, video, information, and other materials.",
        "\"Artwork\" refers to any creative work listed for sale on our platform."
      ]
    },
    {
      id: "eligibility",
      title: "3. User Eligibility",
      icon: Users,
      content: [
        "You must be at least 18 years old to use this Service.",
        "You must provide accurate and complete registration information.",
        "You are responsible for maintaining the security of your account and password.",
        "You may not use our service for any illegal or unauthorized purpose.",
        "You must not, in the use of the Service, violate any laws in your jurisdiction."
      ]
    },
    {
      id: "artist-obligations",
      title: "4. Artist Obligations",
      icon: Users,
      content: [
        "Artists must own or have proper licensing for all artwork they list.",
        "All artwork descriptions must be accurate and not misleading.",
        "Artists are responsible for setting appropriate prices for their work.",
        "Artists must respond to buyer inquiries in a timely manner.",
        "Artists agree to our commission structure as outlined in our fee schedule.",
        "Artists must provide high-quality images that accurately represent their artwork."
      ]
    },
    {
      id: "buyer-obligations",
      title: "5. Buyer Obligations",
      icon: CreditCard,
      content: [
        "Buyers must provide accurate payment and shipping information.",
        "Buyers are responsible for understanding the artwork they are purchasing.",
        "All sales are final unless otherwise specified in our return policy.",
        "Buyers must not use purchased artwork for commercial purposes without proper licensing.",
        "Buyers agree to pay all applicable taxes and fees."
      ]
    },
    {
      id: "intellectual-property",
      title: "6. Intellectual Property Rights",
      icon: Shield,
      content: [
        "The Service and its original content, features, and functionality are and will remain the exclusive property of BBE-T and its licensors.",
        "Artists retain ownership of their original artwork but grant BBE-T a license to display and market their work.",
        "Users may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service without prior written consent.",
        "We respect the intellectual property rights of others and expect our users to do the same."
      ]
    },
    {
      id: "payments",
      title: "7. Payments and Fees",
      icon: CreditCard,
      content: [
        "BBE-T charges a commission on all successful sales as outlined in our fee schedule.",
        "Payment processing fees may apply and will be clearly disclosed.",
        "Artists will receive payment within 7-14 business days after successful delivery confirmation.",
        "All prices are listed in USD unless otherwise specified.",
        "Refunds are subject to our return policy and may take 5-10 business days to process.",
        "We reserve the right to change our fee structure with 30 days notice."
      ]
    },
    {
      id: "prohibited-conduct",
      title: "8. Prohibited Conduct",
      icon: AlertTriangle,
      content: [
        "Users may not engage in any activity that interferes with or disrupts the Service.",
        "Users may not attempt to gain unauthorized access to any portion of the Service.",
        "Users may not upload or transmit viruses or any other type of malicious code.",
        "Users may not engage in any form of harassment, abuse, or hate speech.",
        "Users may not create fake accounts or impersonate others.",
        "Users may not engage in any fraudulent activities or money laundering.",
        "Users may not list counterfeit, stolen, or illegally obtained artwork."
      ]
    },
    {
      id: "content-policy",
      title: "9. Content Policy",
      icon: FileText,
      content: [
        "All content must comply with applicable laws and regulations.",
        "Content must not infringe on the rights of third parties.",
        "We reserve the right to remove any content that violates our policies.",
        "Users are solely responsible for the content they post.",
        "Content must not contain explicit, offensive, or inappropriate material.",
        "We may monitor content but are not obligated to do so."
      ]
    },
    {
      id: "privacy",
      title: "10. Privacy and Data Protection",
      icon: Shield,
      content: [
        "Your privacy is important to us. Please review our Privacy Policy for information on how we collect, use, and protect your data.",
        "We implement appropriate security measures to protect your personal information.",
        "We may use your information to improve our services and communicate with you.",
        "We do not sell your personal information to third parties.",
        "You have the right to access, update, or delete your personal information."
      ]
    },
    {
      id: "termination",
      title: "11. Account Termination",
      icon: AlertTriangle,
      content: [
        "We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms.",
        "You may terminate your account at any time by contacting our support team.",
        "Upon termination, your right to use the Service will cease immediately.",
        "We reserve the right to refuse service to anyone for any reason at any time.",
        "Termination does not relieve you of any obligations incurred prior to termination."
      ]
    },
    {
      id: "disclaimers",
      title: "12. Disclaimers and Limitation of Liability",
      icon: AlertTriangle,
      content: [
        "The Service is provided on an \"as is\" and \"as available\" basis without any warranties of any kind.",
        "We do not warrant that the Service will be uninterrupted, timely, secure, or error-free.",
        "We are not responsible for any damages arising from the use of our Service.",
        "Our total liability shall not exceed the amount paid by you for the Service in the 12 months preceding the claim.",
        "Some jurisdictions do not allow the exclusion of certain warranties, so some of the above exclusions may not apply to you."
      ]
    },
    {
      id: "governing-law",
      title: "13. Governing Law and Dispute Resolution",
      icon: Shield,
      content: [
        "These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction].",
        "Any disputes arising from these Terms shall be resolved through binding arbitration.",
        "You agree to waive your right to a jury trial and to participate in class action lawsuits.",
        "The arbitration shall be conducted in [Location] in accordance with the rules of [Arbitration Organization].",
        "The prevailing party shall be entitled to recover reasonable attorneys&apos; fees and costs."
      ]
    },
    {
      id: "changes",
      title: "14. Changes to Terms",
      icon: Calendar,
      content: [
        "We reserve the right to modify these Terms at any time.",
        "We will provide notice of material changes by posting the updated Terms on our website.",
        "Your continued use of the Service after changes constitutes acceptance of the new Terms.",
        "If you do not agree to the modified Terms, you must stop using the Service.",
        "We encourage you to review these Terms periodically."
      ]
    },
    {
      id: "contact",
      title: "15. Contact Information",
      icon: Mail,
      content: [
        "If you have any questions about these Terms, please contact us at:",
        "Email: legal@bbe-t.com",
        "Address: [Company Address]",
        "Phone: +1 (555) 123-4567",
        "We will respond to your inquiries within 5 business days."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Please read these terms carefully before using our platform. By using BBE-T, you agree to be bound by these terms and conditions.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Last Updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Effective Date: {effectiveDate}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Quick Navigation */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mb-12 border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Important Notice</h3>
                <p className="text-amber-800 text-sm leading-relaxed">
                  These Terms of Service constitute a legally binding agreement between you and BBE-T. 
                  Please read them carefully and contact us if you have any questions. By using our platform, 
                  you acknowledge that you have read, understood, and agree to be bound by these terms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.id} id={section.id} className="scroll-mt-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    {Icon && (
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {section.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions About These Terms?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              If you have any questions or concerns about these Terms of Service, please don&apos;t hesitate to contact our legal team.
        We&apos;re here to help clarify any aspects of our agreement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/support">
                  Contact Support
                  <Mail className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/privacy">
                  Privacy Policy
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            This document was last updated on {lastUpdated} and becomes effective on {effectiveDate}.
          </p>
          <p className="mt-2">
            © 2024 BBE-T. All rights reserved.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}