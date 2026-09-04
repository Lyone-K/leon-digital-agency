import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string', validation: (r) => r.max(60) }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3, validation: (r) => r.max(160) }),
    defineField({ name: 'ogImage', title: 'Social Share Image', type: 'image' }),
    defineField({ name: 'keywords', title: 'Focus Keywords', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false }),
    defineField({ name: 'canonicalUrl', title: 'Canonical URL (optional override)', type: 'url' }),
  ],
})
