import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact ARIOSETECH — Get a Free Quote',
  description: 'Get in touch for a free project quote. Email info@ariosetech.com or WhatsApp +92 300 9484 739. Response within 2 hours.',
}

export default function ContactPage() {
  return <ContactClient />
}
