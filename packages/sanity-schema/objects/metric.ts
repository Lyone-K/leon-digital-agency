import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'metric',
  title: 'Metric',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. "Organic traffic growth"' }),
    defineField({ name: 'value', title: 'Numeric value', type: 'number', description: 'e.g. 240 (for 240%)' }),
    defineField({
      name: 'suffix',
      title: 'Suffix',
      type: 'string',
      description: 'e.g. "%", "x", "+"',
      options: { list: ['%', 'x', '+', 'K', 'M', 'none'] },
    }),
    defineField({ name: 'prefix', title: 'Prefix', type: 'string', description: 'e.g. "$"' }),
    defineField({ name: 'context', title: 'Context', type: 'string', description: 'e.g. "in first 6 months"' }),
  ],
  preview: {
    select: { title: 'label', value: 'value', suffix: 'suffix' },
    prepare({ title, value, suffix }) {
      return { title: `${value}${suffix || ''} — ${title}` }
    },
  },
})
