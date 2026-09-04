import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'clientName', title: 'Client Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'clientName' } }),
    defineField({ name: 'logo', title: 'Client Logo', type: 'image' }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image' }),
    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      options: {
        list: ['Tourism & Safari', 'Healthcare', 'Real Estate', 'E-commerce', 'Hospitality', 'Finance', 'Legal', 'Education', 'Other'],
      },
    }),
    defineField({ name: 'summary', title: 'One-line Summary', type: 'string', description: 'e.g. "240% traffic growth in 6 months"' }),
    defineField({ name: 'challenge', title: 'The Challenge', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'solution', title: 'The Solution', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'metrics', title: 'Measurable Results', type: 'array', of: [{ type: 'metric' }] }),
    defineField({ name: 'beforeAfterGallery', title: 'Before / After Gallery', type: 'array', of: [{ type: 'beforeAfter' }] }),
    defineField({ name: 'liveUrl', title: 'Live Site URL', type: 'url' }),
    defineField({ name: 'testimonial', title: 'Client Testimonial', type: 'reference', to: [{ type: 'testimonial' }] }),
    defineField({ name: 'featured', title: 'Feature on homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'clientName', subtitle: 'summary', media: 'coverImage' } },
})
