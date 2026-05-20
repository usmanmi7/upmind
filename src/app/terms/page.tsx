"use client"

import PublicNavbar from "@/components/PublicNavbar"
import PublicFooter from "@/components/PublicFooter"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">Terms & Conditions</h1>
          <p className="text-sm text-muted-foreground mb-12">Last updated: January 1, 2024</p>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-heading font-semibold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using the Upmind platform (&ldquo;Service&rdquo;), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Upmind provides a strategic consulting platform for startups, including access to consultants, AI-powered insights, resource libraries, roadmap tools, and document management. The Service is provided &ldquo;as is&rdquo; and we reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To use certain features, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Providing accurate and complete registration information</li>
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">4. Subscription Plans & Payments</h2>
              <p className="text-muted-foreground leading-relaxed">
                Paid plans are billed in advance on a monthly or annual basis. All fees are non-refundable except as expressly set forth in our refund policy. We reserve the right to change our pricing at any time, with 30 days notice for existing subscribers. Auto-renewal can be disabled at any time from your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">5. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality of the Service are owned by Upmind and protected by international copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our Service without prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">6. User Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of any content you submit, post, or display on the Service. By submitting content, you grant Upmind a worldwide, non-exclusive, royalty-free license to use, reproduce, and process that content solely for the purpose of providing the Service to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">7. Prohibited Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use the Service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any portion of the Service</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Share your account credentials with others</li>
                <li>Scrape or harvest data from the Service</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, Upmind shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly. Our total liability shall not exceed the amount paid by you for the Service in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">9. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                Either party may terminate the account at any time. Upon termination, your right to use the Service will immediately cease. We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-semibold">10. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms, please contact us at legal@upmind.io or write to us at: Upmind, Inc., 123 Innovation Drive, San Francisco, CA 94105.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
