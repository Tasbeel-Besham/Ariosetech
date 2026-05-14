import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | ARIOSETECH',
  description: 'Learn how ARIOSETECH collects, uses, and protects your personal information.',
}

const hs = { fontFamily: 'var(--font-display)' } as const
const hm = { fontFamily: 'var(--font-mono)' } as const
const hb = { fontFamily: 'var(--font-body)' } as const

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: '40px' }}>
    <h2 style={{ ...hs, fontSize: 'clamp(1.1rem,2vw,1.4rem)', fontWeight: 700, color: 'var(--text)', marginBottom: '12px' }}>
      {title}
    </h2>
    <div style={{ ...hb, fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.8 }}>
      {children}
    </div>
  </section>
)

export default function PrivacyPolicyPage() {
  return (
    <main style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{ ...hm, fontSize: '11px', color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Legal
          </p>
          <h1 style={{ ...hs, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '16px', letterSpacing: '-0.03em' }}>
            Privacy Policy
          </h1>
          <p style={{ ...hb, fontSize: '15px', color: 'var(--text-3)' }}>
            Last updated: January 2025
          </p>
        </div>

        <Section title="1. Introduction">
          <p>
            ARIOSETECH (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website ariosetech.com or engage our services.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p style={{ marginBottom: '12px' }}>We may collect the following types of information:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            {[
              'Personal identification information (name, email address, phone number)',
              'Business information (company name, website URL, project requirements)',
              'Payment information (processed securely through third-party payment providers)',
              'Usage data (pages visited, time spent, browser type, IP address)',
              'Communications (emails, contact form submissions, chat messages)',
            ].map((item, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p style={{ marginBottom: '12px' }}>We use the information we collect to:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            {[
              'Provide, operate, and improve our web development services',
              'Respond to your enquiries and provide customer support',
              'Send project updates, proposals, and service-related communications',
              'Process payments and manage billing',
              'Send occasional marketing emails (you can unsubscribe at any time)',
              'Comply with legal obligations',
            ].map((item, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="4. Sharing Your Information">
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share your data with trusted service providers who assist us in operating our business (such as hosting providers, payment processors, and analytics tools), provided they agree to keep your information confidential. We may also disclose your information if required by law.
          </p>
        </Section>

        <Section title="5. Cookies">
          <p>
            Our website uses cookies to enhance your browsing experience, analyse site traffic, and personalise content. You can choose to disable cookies through your browser settings, though some features of our site may not function properly as a result. By continuing to use our site, you consent to our use of cookies.
          </p>
        </Section>

        <Section title="6. Data Security">
          <p>
            We implement industry-standard security measures to protect your personal information, including SSL encryption, secure server infrastructure, and restricted access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="7. Data Retention">
          <p>
            We retain your personal information for as long as necessary to provide our services and fulfil the purposes outlined in this policy, unless a longer retention period is required by law. Project-related data is typically retained for 3 years after project completion.
          </p>
        </Section>

        <Section title="8. Your Rights">
          <p style={{ marginBottom: '12px' }}>Depending on your location, you may have the right to:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
            {[
              'Access the personal data we hold about you',
              'Request correction of inaccurate data',
              'Request deletion of your personal data',
              'Object to or restrict our processing of your data',
              'Data portability (receive your data in a structured format)',
              'Withdraw consent where processing is based on consent',
            ].map((item, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
            ))}
          </ul>
          <p style={{ marginTop: '12px' }}>
            To exercise any of these rights, please contact us at <a href="mailto:info@ariosetech.com" style={{ color: 'var(--primary)' }}>info@ariosetech.com</a>.
          </p>
        </Section>

        <Section title="9. Third-Party Links">
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies before providing any personal information.
          </p>
        </Section>

        <Section title="10. Children's Privacy">
          <p>
            Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.
          </p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
          </p>
        </Section>

        <Section title="12. Contact Us">
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div style={{ marginTop: '16px', padding: '20px 24px', background: 'var(--bg-2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <p style={{ marginBottom: '6px' }}><strong>ARIOSETECH</strong></p>
            <p style={{ marginBottom: '6px' }}>95 College Road, Block E Block D PCSIR Staff Colony, Lahore, 54770</p>
            <p style={{ marginBottom: '6px' }}>Email: <a href="mailto:info@ariosetech.com" style={{ color: 'var(--primary)' }}>info@ariosetech.com</a></p>
            <p>WhatsApp: <a href="https://wa.me/923009484739" style={{ color: 'var(--primary)' }}>+92 300 9484 739</a></p>
          </div>
        </Section>

        <div style={{ paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
          <Link href="/" style={{ ...hm, fontSize: '13px', color: 'var(--primary)', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>

      </div>
    </main>
  )
}
