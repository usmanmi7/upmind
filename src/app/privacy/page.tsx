"use client"

import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">Last updated: January 1, 2024</p>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-heading font-semibold">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Upmind, Inc. (&ldquo;Upmind,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Account information (name, email, phone number)</li>
                <li>Profile information (company name, role, industry)</li>
                <li>Startup data (business plans, roadmaps, documents)</li>
                <li>Communication data (messages with consultants)</li>
                <li>Payment information (processed securely through our payment provider)</li>
                <li>Usage data (features used, pages visited, session duration)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide and maintain our services</li>
                <li>Personalize your experience and provide tailored recommendations</li>
                <li>Connect you with appropriate consultants</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Communicate about products, services, and events</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Detect and prevent fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">4. Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell your personal data. We share your information only with: your assigned consultants (as needed to provide services), service providers who process data on our behalf, law enforcement when required by law, and business partners with your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures including encryption (AES-256), secure data centers, regular security audits, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Data portability — receive your data in a structured format</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">7. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to collect information about your browsing activities. You can control cookies through your browser settings. Essential cookies are required for the service to function properly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at privacy@upmind.io or write to us at: Upmind, Inc., 123 Innovation Drive, San Francisco, CA 94105.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
