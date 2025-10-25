"use client";

import { useTranslation } from "@/i18n";

export default function TermsOfServicePage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>{t.legal.termsOfService}</h1>
        <p className="text-muted-foreground">
          {t.legal.lastUpdated}: January 1, 2025
        </p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using TuAgenda (&quot;the Service&quot;), you
            accept and agree to be bound by the terms and provision of this
            agreement. If you do not agree to these Terms of Service, please do
            not use the Service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            TuAgenda provides a cloud-based appointment scheduling and
            management platform designed for service businesses. The Service
            allows businesses to manage appointments, clients, employees,
            services, and payments through a web-based application.
          </p>
        </section>

        <section>
          <h2>3. User Accounts</h2>
          <p>
            To use the Service, you must register for an account. You agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and update your information</li>
            <li>
              Maintain the security of your password and account credentials
            </li>
            <li>Accept responsibility for all activities under your account</li>
            <li>
              Notify us immediately of any unauthorized use of your account
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Subscription and Payment</h2>
          <p>
            TuAgenda offers various subscription plans. By subscribing to a paid
            plan, you agree to:
          </p>
          <ul>
            <li>Pay all fees associated with your chosen subscription plan</li>
            <li>Provide current, complete, and accurate billing information</li>
            <li>
              Authorize automatic recurring payments for your subscription
            </li>
          </ul>
          <p>
            We reserve the right to modify our pricing at any time. Price
            changes will be communicated at least 30 days in advance.
          </p>
        </section>

        <section>
          <h2>5. Acceptable Use Policy</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any laws, regulations, or third-party rights</li>
            <li>Upload or transmit viruses, malware, or malicious code</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>
              Impersonate any person or entity or misrepresent your affiliation
            </li>
          </ul>
        </section>

        <section>
          <h2>6. Data and Privacy</h2>
          <p>
            Your use of the Service is also governed by our Privacy Policy. We
            take data security seriously and implement appropriate measures to
            protect your information. You retain all rights to your data, and
            you may export or delete your data at any time.
          </p>
        </section>

        <section>
          <h2>7. Intellectual Property</h2>
          <p>
            The Service, including its original content, features, and
            functionality, is owned by TuAgenda and is protected by
            international copyright, trademark, patent, trade secret, and other
            intellectual property laws.
          </p>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, TuAgenda shall not be liable
            for any indirect, incidental, special, consequential, or punitive
            damages, or any loss of profits or revenues, whether incurred
            directly or indirectly, or any loss of data, use, goodwill, or other
            intangible losses.
          </p>
        </section>

        <section>
          <h2>9. Service Availability</h2>
          <p>
            We strive to maintain 99.9% uptime but do not guarantee
            uninterrupted access to the Service. We may temporarily suspend
            access for maintenance, updates, or unforeseen circumstances.
          </p>
        </section>

        <section>
          <h2>10. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account and access
            to the Service at our sole discretion, without notice, for conduct
            that we believe violates these Terms of Service or is harmful to
            other users, us, or third parties, or for any other reason.
          </p>
        </section>

        <section>
          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will
            notify users of any material changes via email or through the
            Service. Your continued use of the Service after such modifications
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of the jurisdiction in which TuAgenda operates, without
            regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2>13. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please
            contact us at:
          </p>
          <p>
            Email: legal@tuagenda.com
            <br />
            Address: [Your Business Address]
          </p>
        </section>
      </div>
    </div>
  );
}
