import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions governing use of ARIOSETECH services and website.',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="font-display text-[clamp(1.1rem,2vw,1.4rem)] font-bold text-[var(--text)] mb-3">
      {title}
    </h2>
    <div className="font-body text-[15px] text-text-2 leading-[1.8]">
      {children}
    </div>
  </section>
)

export default function TermsOfServicePage() {
  return (
    <main className="pt-[120px] pb-[80px]">
      <div className="container max-w-[800px] mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="font-mono text-[11px] text-primary tracking-[0.1em] uppercase mb-3">
            Legal
          </p>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold text-[var(--text)] mb-4 tracking-[-0.03em]">
            Terms of Service
          </h1>
          <p className="font-body text-[15px] text-text-3">
            Last updated: January 2025
          </p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using the services provided by ARIOSETECH (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services or website. These terms apply to all clients, visitors, and users of our services.
          </p>
        </Section>

        <Section title="2. Services">
          <p className="mb-3">
            ARIOSETECH provides professional web development services including but not limited to:
          </p>
          <ul className="pl-5 mt-2">
            {[
              'WordPress website development, maintenance, and support',
              'WooCommerce store development and optimisation',
              'Shopify store development and management',
              'SEO services (website SEO, local SEO, technical SEO, content SEO)',
              'Speed optimisation, security hardening, and migration services',
            ].map((item, i) => (
              <li key={i} className="mb-2">{item}</li>
            ))}
          </ul>
          <p className="mt-3">
            All services are subject to separate project agreements, proposals, or statements of work that outline specific deliverables, timelines, and pricing.
          </p>
        </Section>

        <Section title="3. Project Agreements & Payment">
          <p className="mb-3">
            All projects require a signed proposal or agreement before work commences. Unless otherwise specified:
          </p>
          <ul className="pl-5 mt-2">
            {[
              'A 50% deposit is required to begin any project',
              'The remaining balance is due upon project completion before final delivery',
              'Monthly maintenance and SEO services are billed in advance',
              'All prices are in USD unless otherwise agreed',
              'Invoices are due within 7 days of issue',
            ].map((item, i) => (
              <li key={i} className="mb-2">{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="4. Pricing &amp; Quotations">
          <p>
            All projects are quoted on a fixed-price basis. Before work begins, we provide an itemised quotation setting out the agreed scope and the total cost. The quoted price is the price you pay for that scope &mdash; we do not add charges mid-project for work covered by the agreed quotation.
          </p>
          <p>
            Where you request work outside the agreed scope (a &ldquo;change request&rdquo;), we will quote that separately for your written approval before proceeding. No additional work is carried out, or charged for, without your approval.
          </p>
          <p>
            Quotations are typically issued within 24 hours of receiving your project requirements and remain valid for 30 days from the date of issue. Ongoing services such as maintenance plans, SEO retainers, hosting, and third-party licence fees are billed separately and are not included in a project quotation unless expressly stated.
          </p>
        </Section>

        <Section title="5. Client Responsibilities">
          <p className="mb-3">To ensure timely project delivery, clients are responsible for:</p>
          <ul className="pl-5 mt-2">
            {[
              'Providing all necessary content, assets, and login credentials promptly',
              'Responding to questions and approvals within a reasonable timeframe',
              'Ensuring all provided content does not infringe third-party intellectual property rights',
              'Maintaining secure access credentials for any shared accounts',
            ].map((item, i) => (
              <li key={i} className="mb-2">{item}</li>
            ))}
          </ul>
          <p className="mt-3">
            Delays caused by late client responses may result in revised project timelines.
          </p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            Upon receipt of final payment, all custom code and design elements created specifically for your project are transferred to you. We retain the right to display the completed work in our portfolio unless otherwise agreed in writing. Third-party plugins, themes, or tools used in your project remain subject to their respective licences.
          </p>
        </Section>

        <Section title="7. Confidentiality">
          <p>
            Both parties agree to keep confidential any proprietary information shared during the course of the project. We will not share your business information, login credentials, or project details with any third party without your explicit consent, except where required by law.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            ARIOSETECH shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability to you for any claim shall not exceed the total amount paid by you to us in the three months preceding the claim. We are not liable for third-party service failures (hosting, payment gateways, plugins) beyond our control.
          </p>
        </Section>

        <Section title="9. Warranties & Disclaimers">
          <p>
            We warrant that our services will be performed with reasonable skill and care. We do not guarantee specific business results (e.g. traffic, revenue, or search rankings) from our services, as these depend on many external factors. All third-party software (WordPress, Shopify, plugins) is provided &quot;as is&quot; under their respective licences.
          </p>
        </Section>

        <Section title="10. Post-Launch Support">
          <p>
            All development projects include 30 days of free post-launch support covering bug fixes and minor adjustments directly related to our work. This does not include new feature requests, content updates, or issues caused by third-party changes after delivery.
          </p>
        </Section>

        <Section title="11. Termination">
          <p>
            Either party may terminate a project with written notice. If you terminate a project mid-way, you are responsible for payment of all work completed to the date of termination. Any deposit paid is applied against work already carried out.
          </p>
        </Section>

        <Section title="12. Governing Law">
          <p>
            These Terms of Service are governed by the laws of Pakistan. Any disputes shall first be attempted to be resolved amicably. If unresolved, disputes shall be subject to the jurisdiction of the courts of Lahore, Pakistan.
          </p>
        </Section>

        <Section title="13. Changes to Terms">
          <p>
            We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of our services after changes constitutes your acceptance of the new terms.
          </p>
        </Section>

        <Section title="14. Contact Us">
          <p>For any questions about these Terms of Service, please contact us:</p>
          <div className="mt-4 py-5 px-6 bg-bg-2 rounded-xl border border-border">
            <p className="mb-[6px]"><strong>ARIOSETECH</strong></p>
            <p className="mb-[6px]">95 College Road, Block E Block D PCSIR Staff Colony, Lahore, 54770</p>
            <p className="mb-[6px]">Email: <a href="mailto:info@ariosetech.com" className="text-primary">info@ariosetech.com</a></p>
            <p>WhatsApp: <a href="https://wa.me/923009484739" className="text-primary">+92 300 9484 739</a></p>
          </div>
        </Section>

        <div className="pt-8 border-t border-border">
          <Link href="/" className="font-mono text-[13px] text-primary no-underline">
            ← Back to Home
          </Link>
        </div>

      </div>
    </main>
  )
}
