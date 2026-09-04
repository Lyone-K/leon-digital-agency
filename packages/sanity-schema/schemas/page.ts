import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        { type: 'object', name: 'hero', title: 'Hero', fields: [
          { name: 'heading', type: 'string' },
          { name: 'subheading', type: 'text' },
          { name: 'ctaLabel', type: 'string' },
          { name: 'ctaHref', type: 'string' },
          { name: 'backgroundImage', type: 'image' },
        ]},
        { type: 'object', name: 'trustStats', title: 'Trust Stats Bar', fields: [
          { name: 'stats', type: 'array', of: [{ type: 'metric' }] },
        ]},
        { type: 'object', name: 'serviceGrid', title: 'Service Grid', fields: [
          { name: 'heading', type: 'string' },
          { name: 'services', type: 'array', of: [{ type: 'reference', to: [{ type: 'service' }] }] },
        ]},
        { type: 'object', name: 'featuredCaseStudies', title: 'Featured Case Studies', fields: [
          { name: 'heading', type: 'string' },
          { name: 'caseStudies', type: 'array', of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }] },
        ]},
        { type: 'object', name: 'testimonialSlider', title: 'Testimonial Slider', fields: [
          { name: 'testimonials', type: 'array', of: [{ type: 'reference', to: [{ type: 'testimonial' }] }] },
        ]},
        { type: 'object', name: 'faq', title: 'FAQ', fields: [
          { name: 'heading', type: 'string' },
          { name: 'items', type: 'array', of: [{ type: 'object', fields: [
            { name: 'question', type: 'string' },
            { name: 'answer', type: 'text' },
          ]}] },
        ]},
        { type: 'object', name: 'richText', title: 'Rich Text Block', fields: [
          { name: 'content', type: 'array', of: [{ type: 'block' }] },
        ]},
        { type: 'object', name: 'ctaBanner', title: 'CTA Banner', fields: [
          { name: 'heading', type: 'string' },
          { name: 'ctaLabel', type: 'string' },
          { name: 'ctaHref', type: 'string' },
        ]},
      ],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
})
