import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'clientName', title: 'Client Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'clientTitle', title: 'Title / Company', type: 'string' }),
    defineField({ name: 'photo', title: 'Photo', type: 'image' }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'rating', title: 'Rating (1-5)', type: 'number', validation: (r) => r.min(1).max(5) }),
    defineField({ name: 'videoUrl', title: 'Video Testimonial URL (optional)', type: 'url' }),
  ],
  preview: { select: { title: 'clientName', subtitle: 'clientTitle', media: 'photo' } },
})
