"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { useTranslation } from "@/i18n"
import { PublicFooter } from "@/components/public-footer"

export default function PrivacyPolicyPage() {
  const { t } = useTranslation()

  return (
    <div className="bg-background min-h-svh">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            TuAgenda
          </a>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h1>{t.legal.privacyPolicy}</h1>
          <p className="text-muted-foreground">
            {t.legal.lastUpdated}: January 1, 2025
          </p>

          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to TuAgenda. We respect your privacy and are committed to
              protecting your personal data. This privacy policy explains how
              we collect, use, disclose, and safeguard your information when
              you use our appointment scheduling and management platform.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <h3>2.1 Information You Provide</h3>
            <p>When you use TuAgenda, we collect information that you provide directly:</p>
            <ul>
              <li>
                <strong>Account Information:</strong> Name, email address,
                phone number, company name, and password
              </li>
              <li>
                <strong>Profile Information:</strong> Business details,
                location, services offered, and employee information
              </li>
              <li>
                <strong>Client Data:</strong> Information about your clients,
                including names, contact details, appointment history, and
                preferences
              </li>
              <li>
                <strong>Payment Information:</strong> Billing details and
                transaction history (payment card information is securely
                processed by our payment providers)
              </li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <ul>
              <li>
                <strong>Usage Data:</strong> Information about how you interact
                with our Service, including pages visited, features used, and
                time spent
              </li>
              <li>
                <strong>Device Information:</strong> IP address, browser type,
                operating system, and device identifiers
              </li>
              <li>
                <strong>Cookies and Tracking:</strong> We use cookies and
                similar technologies to enhance your experience and analyze
                Service usage
              </li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for various purposes:</p>
            <ul>
              <li>
                <strong>Provide and Maintain Service:</strong> To operate and
                maintain the TuAgenda platform
              </li>
              <li>
                <strong>Improve User Experience:</strong> To understand usage
                patterns and enhance features
              </li>
              <li>
                <strong>Communication:</strong> To send important updates,
                notifications, and marketing communications (with your consent)
              </li>
              <li>
                <strong>Customer Support:</strong> To respond to inquiries and
                provide assistance
              </li>
              <li>
                <strong>Security:</strong> To detect, prevent, and address
                technical issues and fraudulent activity
              </li>
              <li>
                <strong>Analytics:</strong> To analyze Service performance and
                user behavior
              </li>
              <li>
                <strong>Compliance:</strong> To comply with legal obligations
                and enforce our Terms of Service
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal information. We may share your
              information in the following circumstances:
            </p>
            <ul>
              <li>
                <strong>Service Providers:</strong> With third-party vendors
                who perform services on our behalf (e.g., hosting, analytics,
                payment processing)
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with any
                merger, sale, or transfer of company assets
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                protect our rights, privacy, safety, or property
              </li>
              <li>
                <strong>With Your Consent:</strong> When you explicitly agree
                to the sharing
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security
              measures to protect your data, including:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection</li>
              <li>Secure data centers with redundancy and backup systems</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100%
              secure. While we strive to protect your data, we cannot guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this policy, unless a longer
              retention period is required by law. When you close your account,
              we will delete or anonymize your data within 90 days, except for
              information we must retain for legal or regulatory purposes.
            </p>
          </section>

          <section>
            <h2>7. Your Rights and Choices</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li>
                <strong>Access:</strong> Request access to your personal data
              </li>
              <li>
                <strong>Correction:</strong> Update or correct inaccurate
                information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                data
              </li>
              <li>
                <strong>Portability:</strong> Receive a copy of your data in a
                structured format
              </li>
              <li>
                <strong>Opt-out:</strong> Unsubscribe from marketing
                communications
              </li>
              <li>
                <strong>Object:</strong> Object to certain processing of your
                data
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us at
              privacy@tuagenda.com.
            </p>
          </section>

          <section>
            <h2>8. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Authenticate your account</li>
              <li>Analyze Service usage and performance</li>
              <li>Provide personalized content and features</li>
            </ul>
            <p>
              You can control cookie settings through your browser preferences.
              Note that disabling cookies may affect Service functionality.
            </p>
          </section>

          <section>
            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your country of residence. We ensure appropriate
              safeguards are in place to protect your data in accordance with
              this policy and applicable laws.
            </p>
          </section>

          <section>
            <h2>10. Children's Privacy</h2>
            <p>
              TuAgenda is not intended for individuals under the age of 18. We
              do not knowingly collect personal information from children. If
              you become aware that a child has provided us with personal data,
              please contact us immediately.
            </p>
          </section>

          <section>
            <h2>11. Third-Party Links</h2>
            <p>
              Our Service may contain links to third-party websites or services
              not operated by us. We are not responsible for the privacy
              practices of these third parties. We encourage you to review
              their privacy policies.
            </p>
          </section>

          <section>
            <h2>12. Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will
              notify you of any material changes by posting the new policy on
              this page and updating the "Last updated" date. We will also send
              you an email notification for significant changes.
            </p>
          </section>

          <section>
            <h2>13. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this
              privacy policy or our data practices, please contact us:
            </p>
            <p>
              Email: privacy@tuagenda.com
              <br />
              Address: [Your Business Address]
              <br />
              Data Protection Officer: dpo@tuagenda.com
            </p>
          </section>

          <section>
            <h2>14. Specific Regional Provisions</h2>
            <h3>For European Economic Area (EEA) Users</h3>
            <p>
              If you are located in the EEA, you have additional rights under
              the General Data Protection Regulation (GDPR), including the
              right to lodge a complaint with your local data protection
              authority.
            </p>

            <h3>For California Residents</h3>
            <p>
              If you are a California resident, you have additional rights
              under the California Consumer Privacy Act (CCPA), including the
              right to know what personal information is collected and the
              right to opt-out of the sale of personal information (note: we do
              not sell personal information).
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
