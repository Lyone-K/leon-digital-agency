import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'beforeAfter',
  title: 'Before / After Comparison',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. "Homepage redesign"' }),
    defineField({ name: 'beforeImage', title: 'Before Image', type: 'image', validation: (r) => r.required() }),
    defineField({ name: 'afterImage', title: 'After Image', type: 'image', validation: (r) => r.required() }),
    defineField({ name: 'caption', title: 'Caption', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'label', media: 'afterImage' },
  },
})
