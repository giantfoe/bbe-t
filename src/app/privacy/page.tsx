"use client";

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  Shield, 
  Calendar, 
  Eye, 
  Lock, 
  Database, 
  Users, 
  Mail, 
  Globe,
  Settings,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Download,
  Trash2,
  Edit,
  Cookie,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Section {
  id: string;
  title: string;
  content: string[];
  icon?: React.ComponentType<any>;
}

export default function PrivacyPage() {
  const lastUpdated = "December 15, 2024";
  const effectiveDate = "January 1, 2025";

  const sections: Section[] = [
    {
      id: "introduction",
      title: "1. Introduction",
      icon: Shield,
      content: [
        "BBE-T (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy and ensuring the security of your personal information.",
        "This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.",
        "By using our platform, you consent to the data practices described in this policy.",
        "We encourage you to read this Privacy Policy carefully and contact us if you have any questions."
      ]
    },
    {
      id: "information-collected",
      title: "2. Information We Collect",
      icon: Database,
      content: [
        "Personal Information: Name, email address, phone number, billing address, and payment information.",
        "Account Information: Username, password, profile picture, and account preferences.",
        "Artwork Information: Images, descriptions, pricing, and metadata for listed artwork.",
        "Transaction Data: Purchase history, payment methods, and transaction details.",
        "Communication Data: Messages, support tickets, and correspondence with us.",
        "Technical Information: IP address, browser type, device information, and usage analytics."
      ]
    },
    {
      id: "how-we-collect",
      title: "3. How We Collect Information",
      icon: Eye,
      content: [
        "Directly from you when you create an account, make purchases, or contact us.",
        "Automatically through cookies, web beacons, and similar tracking technologies.",
        "From third-party services like payment processors and social media platforms.",
        "Through your interactions with our website, mobile app, and email communications.",
        "From public sources and data aggregators where legally permitted."
      ]
    },
    {
      id: "how-we-use",
      title: "4. How We Use Your Information",
      icon: Settings,
      content: [
        "To provide, maintain, and improve our services and platform functionality.",
        "To process transactions, payments, and deliver purchased artwork.",
        "To communicate with you about your account, orders, and platform updates.",
        "To personalize your experience and provide relevant recommendations.",
        "To detect, prevent, and address fraud, security issues, and technical problems.",
        "To comply with legal obligations and enforce our terms of service.",
        "To conduct research and analytics to improve our services."
      ]
    },
    {
      id: "information-sharing",
      title: "5. Information Sharing and Disclosure",
      icon: Users,
      content: [
        "We do not sell, trade, or rent your personal information to third parties.",
        "Service Providers: We share information with trusted partners who assist in operating our platform.",
        "Payment Processors: Financial information is shared with secure payment processing services.",
        "Legal Requirements: We may disclose information when required by law or to protect our rights.",
        "Business Transfers: Information may be transferred in connection with mergers or acquisitions.",
        "With Your Consent: We may share information for other purposes with your explicit consent."
      ]
    },
    {
      id: "data-security",
      title: "6. Data Security",
      icon: Lock,
      content: [
        "We implement industry-standard security measures to protect your information.",
        "All sensitive data is encrypted in transit and at rest using advanced encryption protocols.",
        "We regularly monitor our systems for vulnerabilities and security threats.",
        "Access to personal information is restricted to authorized personnel only.",
        "We conduct regular security audits and penetration testing.",
        "In the event of a data breach, we will notify affected users promptly as required by law."
      ]
    },
    {
      id: "cookies",
      title: "7. Cookies and Tracking Technologies",
      icon: Cookie,
      content: [
        "We use cookies to enhance your browsing experience and analyze website usage.",
        "Essential Cookies: Required for basic website functionality and security.",
        "Analytics Cookies: Help us understand how visitors interact with our website.",
        "Marketing Cookies: Used to deliver relevant advertisements and track campaign effectiveness.",
        "You can control cookie preferences through your browser settings.",
        "Disabling certain cookies may limit website functionality."
      ]
    },
    {
      id: "your-rights",
      title: "8. Your Privacy Rights",
      icon: CheckCircle,
      content: [
        "Access: You have the right to request access to your personal information.",
        "Correction: You can request correction of inaccurate or incomplete information.",
        "Deletion: You may request deletion of your personal information, subject to legal requirements.",
        "Portability: You can request a copy of your data in a machine-readable format.",
        "Opt-out: You can unsubscribe from marketing communications at any time.",
        "Restriction: You may request restriction of processing in certain circumstances."
      ]
    },
    {
      id: "data-retention",
      title: "9. Data Retention",
      icon: Calendar,
      content: [
        "We retain personal information only as long as necessary for the purposes outlined in this policy.",
        "Account information is retained while your account is active and for a reasonable period after closure.",
        "Transaction records are kept for legal and accounting purposes as required by law.",
        "Marketing data is retained until you opt-out or as required for legitimate business purposes.",
        "We regularly review and delete information that is no longer necessary."
      ]
    },
    {
      id: "international-transfers",
      title: "10. International Data Transfers",
      icon: Globe,
      content: [
        "Your information may be transferred to and processed in countries other than your own.",
        "We ensure appropriate safeguards are in place for international data transfers.",
        "We comply with applicable data protection laws and regulations.",
        "Standard contractual clauses and adequacy decisions are used where required.",
        "You consent to such transfers by using our services."
      ]
    },
    {
      id: "children-privacy",
      title: "11. Children's Privacy",
      icon: Users,
      content: [
        "Our services are not intended for children under the age of 13.",
        "We do not knowingly collect personal information from children under 13.",
        "If we become aware that we have collected information from a child under 13, we will delete it promptly.",
        "Parents or guardians who believe their child has provided information should contact us immediately.",
        "Users between 13 and 18 must have parental consent to use our services."
      ]
    },
    {
      id: "third-party-links",
      title: "12. Third-Party Links and Services",
      icon: ExternalLink,
      content: [
        "Our website may contain links to third-party websites and services.",
        "We are not responsible for the privacy practices of these third parties.",
        "We encourage you to read the privacy policies of any third-party sites you visit.",
        "Third-party integrations are governed by their respective privacy policies.",
        "We may use third-party analytics and advertising services subject to their privacy policies."
      ]
    },
    {
      id: "mobile-app",
      title: "13. Mobile Application",
      icon: Smartphone,
      content: [
        "Our mobile app may collect additional information such as device identifiers and location data.",
        "Push notifications can be controlled through your device settings.",
        "Camera and photo access is only used for uploading artwork images with your permission.",
        "Location services may be used to provide relevant local content and services.",
        "App usage analytics help us improve functionality and user experience."
      ]
    },
    {
      id: "changes",
      title: "14. Changes to This Privacy Policy",
      icon: Edit,
      content: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices.",
        "We will notify you of any material changes by posting the updated policy on our website.",
        "We may also send you an email notification for significant changes.",
        "Your continued use of our services after changes constitutes acceptance of the updated policy.",
        "We encourage you to review this policy periodically."
      ]
    },
    {
      id: "contact",
      title: "15. Contact Information",
      icon: Mail,
      content: [
        "If you have questions or concerns about this Privacy Policy, please contact us:",
        "Email: privacy@bbe-t.com",
        "Address: [Company Address]",
        "Phone: +1 (555) 123-4567",
        "Data Protection Officer: dpo@bbe-t.com",
        "We will respond to your privacy inquiries within 30 days."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you use BBE-T.
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

        {/* Quick Actions */}
        <Card className="mb-12 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Manage Your Privacy</h2>
            <p className="text-gray-600 mb-6">
              Take control of your personal information with these quick actions:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <Download className="h-4 w-4" />
                Download My Data
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <Edit className="h-4 w-4" />
                Update Preferences
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

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

        {/* Privacy Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Lock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure by Design</h3>
              <p className="text-gray-600 text-sm">Your data is encrypted and protected with industry-leading security measures.</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Transparent Practices</h3>
              <p className="text-gray-600 text-sm">We clearly explain what data we collect and how we use it.</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Control</h3>
              <p className="text-gray-600 text-sm">You have full control over your personal information and privacy settings.</p>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Policy Sections */}
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
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions About Your Privacy?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our privacy team is here to help. If you have any questions about this policy or how we handle your data, 
              please don&apos;t hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/support">
                  Contact Privacy Team
                  <Mail className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/terms">
                  Terms of Service
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            This Privacy Policy was last updated on {lastUpdated} and becomes effective on {effectiveDate}.
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