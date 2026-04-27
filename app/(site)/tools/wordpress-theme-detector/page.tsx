import type { Metadata } from 'next'
import WordPressDetectorClient from './WordPressDetectorClient'

export const metadata: Metadata = {
  title: 'WordPress Theme Detector — Find Any WordPress Theme Instantly',
  description: 'Detect the WordPress theme and plugins used by any website. Free tool by ARIOSETECH.',
}

export default function WordPressThemeDetectorPage() {
  return <WordPressDetectorClient />
}
