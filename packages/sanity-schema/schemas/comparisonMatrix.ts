import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'comparisonMatrix',
  title: 'Service Comparison Matrix',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'columns',
      title: 'Package Columns',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'name', type: 'string', title: 'Package Name' },
        { name: 'priceKES', type: 'number', title: 'Price (KES)' },
        { name: 'recommended', type: 'boolean', title: 'Mark as recommended' },
      ]}],
    }),
    defineField({
      name: 'rows',
      title: 'Feature Rows',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'feature', type: 'string', title: 'Feature name' },
        { name: 'category', type: 'string', title: 'Category', description: 'e.g. Design, SEO, CMS, Support' },
        {
          name: 'values',
          title: 'Value per package (true/false or text, matched by column order)',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ]}],
    }),
  ],
})
