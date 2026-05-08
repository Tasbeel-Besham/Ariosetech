import InteractiveHeroSection from '@/components/sections/InteractiveHeroSection'

type Props = {
  eyebrow?: string; headline?: string; subheadline?: string; supportingText?: string
  ctaPrimaryLabel?: string; ctaPrimaryHref?: string
  ctaSecondaryLabel?: string; ctaSecondaryHref?: string
  trust?: string
}

type Tok = { t: 'com' | 'kw' | 'fn' | 'attr' | 'str' | 'v'; v: string }

const SHOPIFY_CODE: Tok[][] = [
  [{ t: 'com', v: '{% comment %} Ariosetech Shopify Theme {% endcomment %}' }],
  [],
  [{ t: 'kw', v: '{% schema %}' }],
  [{ t: 'v', v: '  {' }],
  [{ t: 'v', v: '    ' }, { t: 'str', v: '"name"' }, { t: 'v', v: ': ' }, { t: 'str', v: '"Conversion Optimized"' }, { t: 'v', v: ',' }],
  [{ t: 'v', v: '    ' }, { t: 'str', v: '"settings"' }, { t: 'v', v: ': [' }],
  [{ t: 'v', v: '      { ' }, { t: 'str', v: '"type"' }, { t: 'v', v: ': ' }, { t: 'str', v: '"header"' }, { t: 'v', v: ', ' }, { t: 'str', v: '"content"' }, { t: 'v', v: ': ' }, { t: 'str', v: '"Performance"' }, { t: 'v', v: ' }' }],
  [{ t: 'v', v: '    ]' }],
  [{ t: 'v', v: '  }' }],
  [{ t: 'kw', v: '{% endschema %}' }],
  [],
  [{ t: 'com', v: '{% comment %} Result: 99 PageSpeed · 150% Lift {% endcomment %}' }]
]

export default function BuilderHeroSection(props: Props) {
  const isShopify = props.headline?.toLowerCase().includes('shopify') || props.eyebrow?.toLowerCase().includes('shopify')
  
  return (
    <InteractiveHeroSection
      eyebrow={props.eyebrow}
      headline={props.headline}
      subheadline={props.supportingText ? props.subheadline : undefined}
      desc={props.supportingText || props.subheadline}
      trust={props.trust}
      ctaPrimaryLabel={props.ctaPrimaryLabel}
      ctaPrimaryHref={props.ctaPrimaryHref}
      ctaSecondaryLabel={props.ctaSecondaryLabel}
      ctaSecondaryHref={props.ctaSecondaryHref}
      codeFilename={isShopify ? 'ariosetech-store / theme.liquid' : undefined}
      codeLines={isShopify ? SHOPIFY_CODE : undefined}
    />
  )
}
