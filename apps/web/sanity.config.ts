import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '../../packages/sanity-schema'

export default defineConfig({
  name: 'leon-digital-agency',
  title: 'Leon Digital Agency — CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('page').title('Custom Pages (freeform builder)'),
            S.documentTypeListItem('industryPage').title('Industry Landing Pages'),
            S.divider(),
            S.documentTypeListItem('service').title('Services'),
            S.documentTypeListItem('comparisonMatrix').title('Comparison Matrix'),
            S.divider(),
            S.documentTypeListItem('caseStudy').title('Case Studies'),
            S.documentTypeListItem('testimonial').title('Testimonials'),
            S.documentTypeListItem('teamMember').title('Team Members'),
            S.divider(),
            S.documentTypeListItem('blogPost').title('Blog Posts'),
          ]),
    }),
    // Vision lets you run raw GROQ queries from within the Studio — dev/debug only.
    ...(process.env.NODE_ENV === 'development' ? [visionTool()] : []),
  ],

  schema: {
    types: schemaTypes,
  },
})
