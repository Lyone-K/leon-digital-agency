import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', title: 'Site Name', type: 'string', initialValue: 'Leon Digital Agency' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'address', title: 'Office Address', type: 'string' }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'platform', type: 'string' },
        { name: 'url', type: 'url' },
      ]}],
    }),
    defineField({
      name: 'trustStats',
      title: 'Homepage Trust Stats',
      type: 'array',
      of: [{ type: 'metric' }],
      description: 'e.g. "50+ Websites Built", "98% Client Retention"',
    }),
    defineField({ name: 'defaultSeo', title: 'Default SEO', type: 'seo' }),
  ],
})
