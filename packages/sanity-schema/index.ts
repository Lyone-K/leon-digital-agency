import service from './schemas/service'
import caseStudy from './schemas/caseStudy'
import industryPage from './schemas/industryPage'
import teamMember from './schemas/teamMember'
import testimonial from './schemas/testimonial'
import comparisonMatrix from './schemas/comparisonMatrix'
import blogPost from './schemas/blogPost'
import siteSettings from './schemas/siteSettings'
import page from './schemas/page'
import seo from './objects/seo'
import beforeAfter from './objects/beforeAfter'
import metric from './objects/metric'

export const schemaTypes = [
  // documents
  page,
  service,
  caseStudy,
  industryPage,
  teamMember,
  testimonial,
  comparisonMatrix,
  blogPost,
  siteSettings,
  // reusable objects
  seo,
  beforeAfter,
  metric,
]
