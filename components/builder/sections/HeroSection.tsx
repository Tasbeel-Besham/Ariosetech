import ServiceHeroSection from '@/components/sections/ServiceHeroSection'

type Props = {
  eyebrow?: string; headline?: string; subheadline?: string; supportingText?: string
  ctaPrimaryLabel?: string; ctaPrimaryHref?: string
  ctaSecondaryLabel?: string; ctaSecondaryHref?: string
  trust?: string
}

export default function BuilderHeroSection(props: Props) {
  return (
    <ServiceHeroSection
      eyebrow={props.eyebrow}
      headline={props.headline}
      subheadline={props.supportingText ? props.subheadline : undefined}
      desc={props.supportingText || props.subheadline}
      trust={props.trust}
      ctaPrimaryLabel={props.ctaPrimaryLabel}
      ctaPrimaryHref={props.ctaPrimaryHref}
      ctaSecondaryLabel={props.ctaSecondaryLabel}
      ctaSecondaryHref={props.ctaSecondaryHref}
    />
  )
}
