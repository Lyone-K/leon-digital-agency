import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'icon', title: 'Icon', type: 'image' }),
    defineField({ name: 'shortDescription', title: 'Short Description', type: 'text', rows: 2 }),
    defineField({ name: 'fullDescription', title: 'Full Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'tiers',
      title: 'Pricing / Package Tiers',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'tierName', type: 'string', title: 'Tier Name', description: 'e.g. Starter, Growth, Enterprise' },
          { name: 'priceKES', type: 'number', title: 'Price (KES)' },
          { name: 'priceUSD', type: 'number', title: 'Price (USD)' },
          { name: 'features', type: 'array', of: [{ type: 'string' }], title: 'Included Features' },
          { name: 'highlighted', type: 'boolean', title: 'Highlight as recommended' },
        ],
      }],
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'name', media: 'icon' } },
})
