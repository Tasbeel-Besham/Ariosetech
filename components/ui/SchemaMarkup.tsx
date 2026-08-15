/**
 * RETIRED — do not re-import this component.
 *
 * It previously rendered on every builder page (via BuilderRenderer) and was
 * the source of three structured-data faults on the live site:
 *
 *   1. Duplicate Service schema. The route files already emit Service schema
 *      for /services/* paths, so those pages carried two Service nodes.
 *
 *   2. Duplicate FAQPage schema. Same FAQ sections, marked up twice.
 *
 *   3. A conflicting Organization node. It emitted a `ProfessionalService`
 *      using `${SITE}/#organization` — the exact @id the real `Organization`
 *      node in app/layout.tsx uses. Two different @types sharing one @id makes
 *      the entity graph ambiguous, and every `publisher: { "@id": ... }`
 *      reference on the site points at that id.
 *
 * Structured data now lives in the route files (see lib/schema.ts for the
 * builders) and BreadcrumbList lives in components/ui/AutoBreadcrumbs.tsx, so
 * each page emits exactly one node per entity, matching what it visibly shows.
 *
 * The file is kept as this note rather than deleted so the reasoning survives
 * in the repo. There is no default export — importing it will fail the build,
 * which is the intended guard rail.
 */

export const SCHEMA_MARKUP_RETIRED = true
