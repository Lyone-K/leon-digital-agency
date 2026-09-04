import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'industryPage',
  title: 'Industry Landing Page',
  type: 'document',
  fields: [
    defineField({ name: 'industryName', title: 'Industry Name', type: 'string', description: 'e.g. Tourism & Safari, Healthcare, Real Estate' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'industryName' } }),
    defineField({ name: 'heroHeading', title: 'Hero Heading', type: 'string' }),
    defineField({ name: 'heroSubheading', title: 'Hero Subheading', type: 'text' }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image' }),
    defineField({ name: 'painPoints', title: 'Industry Pain Points We Solve', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'relevantServices', title: 'Relevant Services', type: 'array', of: [{ type: 'reference', to: [{ type: 'service' }] }] }),
    defineField({ name: 'relevantCaseStudies', title: 'Relevant Case Studies', type: 'array', of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }] }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'industryName', media: 'heroImage' } },
})
