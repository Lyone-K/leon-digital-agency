/**
 * Seeds the Sanity dataset with real starter content for Leon Digital Agency's
 * own site — not just placeholder text, but actual copy you can publish as-is
 * or lightly edit from the Studio afterward.
 *
 * Run with: npx tsx scripts/seed.ts
 * Requires SANITY_API_TOKEN (a token with write access) in your environment.
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Turns a plain paragraph into a minimal Portable Text block, since Sanity's
// rich-text fields (fullDescription, challenge, solution) expect block arrays,
// not plain strings. One paragraph in -> one block out; call it once per
// paragraph if you want multiple.
function block(text: string) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'normal',
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
    markDefs: [],
  }
}

async function seed() {
  console.log('Seeding site settings...')
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'Leon Digital Agency',
    phone: '+254 719 628 766',
    email: 'hello@leondigitalagency.com',
    address: 'Nairobi, Kenya',
    trustStats: [
      { _type: 'metric', label: 'Websites Delivered', value: 10, suffix: '+' },
      { _type: 'metric', label: 'Avg. Performance Score', value: 96, suffix: 'none' },
      { _type: 'metric', label: 'Client retention', value: 92, suffix: '%' },
      { _type: 'metric', label: 'Countries served', value: 2, suffix: 'none' },
    ],
    defaultSeo: {
      metaTitle: 'Leon Digital Agency — Custom Web Design & Development, Nairobi',
      metaDescription:
        'Leon Digital Agency Transforming visions into powerful digital experiences — websites, web applications and brands built to help businesses across Kenya and East Africa grow with confidence.',
    },
  })

  console.log('Seeding services...')
  const services = [
    {
      slug: 'web-design',
      name: 'Custom Web Design',
      shortDescription:
        'Professional websites designed from scratch to match your brand and business goals.',
      fullDescription: [
        block(
          "Most websites look the same because they use ready-made templates. We build yours around your brand, so it feels unique and truly yours."
        ),
        block(
          'This includes a complete visual design, clear typography, and layouts that work well on the devices your customers use.'
        ),
      ],
      tiers: [
        { tierName: 'Starter', priceKES: 80000, priceUSD: 620, features: ['Up to 5 pages', 'Custom design (no template)', 'Mobile responsive', 'Basic on-page SEO'], highlighted: false },
        { tierName: 'Growth', priceKES: 180000, priceUSD: 1400, features: ['Up to 12 pages', 'CMS integration', 'Advanced SEO setup', 'M-Pesa + Stripe ready'], highlighted: true },
      ],
    },
    {
      slug: 'web-apps',
      name: 'Web Applications',
      shortDescription:
        'Custom booking systems, client portals, dashboards and business tools built for your needs',
      fullDescription: [
        block(
          'When your website needs to handle bookings, logins, payments, projects, or other business tasks, we build it as a proper web application—not just a basic website.'
        ),
        block(
          'We use Next.js, Node.js, and PostgreSQL to build secure, reliable systems that fit your business needs.'
        ),
      ],
      tiers: [
        { tierName: 'Enterprise', priceKES: 400000, priceUSD: 3100, features: ['Client portal with project tracking', 'Custom authentication', 'Payment integration', 'Ongoing support included'], highlighted: false },
      ],
    },
    {
      slug: 'cms',
      name: 'CMS Integration',
      shortDescription: 'Update your website easily anytime — no technical skills required',
      fullDescription: [
        block(
          'Your team should be able to update the website without calling a developer. We set up a simple content system that makes adding and updating information easy.'
        ),
      ],
    },
    {
      slug: 'seo',
      name: 'SEO & Performance',
      shortDescription: 'Fast, secure and search engine-friendly websites that help customers find your business',
      fullDescription: [
        block(
          'SEO is built into your website from the start. Every site includes proper page information, a sitemap, structured data, and performance optimisation before launch.'
        ),
      ],
    },
  ]

  for (const s of services) {
    await client.createOrReplace({
      _id: `service-${s.slug}`,
      _type: 'service',
      name: s.name,
      slug: { _type: 'slug', current: s.slug },
      shortDescription: s.shortDescription,
      fullDescription: s.fullDescription,
      tiers: (s as any).tiers,
    })
  }

  console.log('Seeding team members...')
  const team = [
    {
      key: 'leon',
      name: 'Leon M.',
      role: 'Founder & Lead Developer',
      order: 1,
      bio: 'Designs and develops modern websites and custom web applications that help businesses grow online.',
    },
    {
      key: 'ben',
      name: 'Ben K.',
      role: 'Backend & System Developer',
      order: 2,
      bio: "Builds secure, reliable systems that power websites, online bookings, payments and business operations.",
    },
    {
      key: 'nickson',
      name: 'Nickson I.',
      role: 'UI/UX & Design Lead',
      order: 3,
      bio: 'Creates clean, user-friendly designs that reflect each client\'s brand and deliver a great user experience.',
    },
    {
      key: 'kingsley',
      name: 'Kingsley L.',
      role: 'Finance Manager',
      order: 4,
      bio: 'Oversees project budgeting, financial planning, invoicing and ensures smooth financial operations for every client.',
    },
    {
      key: 'tassy',
      name: 'Tassy M.',
      role: 'Marketing Lead',
      order: 5,
      bio: 'Develops marketing strategies and digital campaigns that help clients reach more customers and grow their businesses.',
    },
  ]

  for (const member of team) {
    await client.createOrReplace({
      _id: `team-${member.key}`,
      _type: 'teamMember',
      name: member.name,
      role: member.role,
      bio: member.bio,
      order: member.order,
    })
  }

  console.log('Seeding industry landing pages...')
  const industries = [
    {
      slug: 'tourism',
      industryName: 'Tourism & Safari',
      heroHeading: 'Websites that help you win more bookings',
      heroSubheading:
        'For safari operators, lodges and tour companies that want customers to see the experience before they book.',
      painPoints: [
        'Generic websites that make your business look like everyone else',
        'No clear way for customers to see what their trip will be like',
        'Enquiries getting lost because the booking process is not simple',
      ],
    },
    {
      slug: 'healthcare',
      industryName: 'Healthcare',
      heroHeading: 'Your website should build trust from the start.',
      heroSubheading:
        'For clinics, specialists and healthcare providers who need a professional website that makes patients feel confident.',
      painPoints: [
        'Stock photos that make the practice feel less authentic',
        'No clear way for patients to find information and book an appointment',
        'Accessibility and important healthcare requirements overlooked',
      ],
    },
    {
      slug: 'real-estate',
      industryName: 'Real Estate',
      heroHeading: 'Websites that help sell properties.',
      heroSubheading:
        "For real estate agencies and developers who need customers to easily find, view and enquire about properties.",
      painPoints: [
        'Property listings scattered across social media and different platforms',
        "No easy way to search by location",
        'Enquiries going to one general inbox instead of the right agent',
      ],
    },
    {
      slug: 'hospitality',
      industryName: 'Hospitality',
      heroHeading: 'Make booking your hotel easy',
      heroSubheading:
        'For hotels and guesthouses that want more direct bookings and less reliance on third-party platforms.',
      painPoints: [
        'Depending too much on booking platforms and paying their fees',
        "A website that doesn't show the true quality of your property",
        'No simple way to showcase rooms, prices and availability',
      ],
    },
  ]

  for (const ind of industries) {
    await client.createOrReplace({
      _id: `industry-${ind.slug}`,
      _type: 'industryPage',
      industryName: ind.industryName,
      slug: { _type: 'slug', current: ind.slug },
      heroHeading: ind.heroHeading,
      heroSubheading: ind.heroSubheading,
      painPoints: ind.painPoints,
    })
  }

  console.log('Seeding testimonials...')
  await client.createOrReplace({
    _id: 'testimonial-jt-malika',
    _type: 'testimonial',
    clientName: 'Julius T.',
    clientTitle: 'Managing Director, JT Malika Tours & Safaris',
    quote:
      'Leon Digital gave our business a professional website that truly represents our brand. The process was smooth, and we\'re proud of the final result.',
    rating: 5,
  })

  console.log('Seeding case studies...')
  await client.createOrReplace({
    _id: 'case-study-jt-malika',
    _type: 'caseStudy',
    clientName: 'JT Malika Tours & Safaris',
    slug: { _type: 'slug', current: 'jt-malika-tours' },
    industry: 'Tourism & Safari',
    summary: '3x inquiry rate after an editorial rebuild for a Nairobi-based safari operator.',
    challenge: [
      block(
        "JT Malika was starting a company, but didn\'t own a website to reflect the quality of their services. We developed their online presence with a modern, easy-to-use website that showcases their safari packages and makes it simple for customers to get in touch and book their next adventure"
      ),
    ],
    solution: [
      block(
        'We delivered a modern, mobile-friendly website with easy content management, online inquiry forms and SEO to help the business reach more customers.'
      ),
    ],
    metrics: [
      { _type: 'metric', label: 'Inquiry rate', value: 3, suffix: 'x' },
      { _type: 'metric', label: 'Avg. session', value: 4, suffix: 'none', context: 'minutes' },
      { _type: 'metric', label: 'Bounce rate', value: 42, suffix: '%', prefix: '-' },
    ],
    featured: true,
    testimonial: { _type: 'reference', _ref: 'testimonial-jt-malika' },
  })

  console.log('Seeding comparison matrix...')
  await client.createOrReplace({
    _id: 'comparison-matrix-main',
    _type: 'comparisonMatrix',
    title: 'Package Comparison',
    columns: [
      { name: 'Starter', priceKES: 80000, recommended: false },
      { name: 'Growth', priceKES: 180000, recommended: true },
      { name: 'Enterprise', priceKES: 400000, recommended: false },
    ],
    rows: [
      { feature: 'Custom design (no templates)', category: 'Design', values: ['true', 'true', 'true'] },
      { feature: 'Pages included', category: 'Design', values: ['Up to 5', 'Up to 12', 'Unlimited'] },
      { feature: 'CMS integration', category: 'CMS', values: ['false', 'true', 'true'] },
      { feature: 'Client portal', category: 'Web App', values: ['false', 'false', 'true'] },
      { feature: 'M-Pesa + Stripe payments', category: 'Payments', values: ['false', 'true', 'true'] },
      { feature: 'Multilingual support', category: 'Content', values: ['false', 'false', 'true'] },
      { feature: 'Post-launch support', category: 'Support', values: ['14 days', '30 days', '90 days'] },
    ],
  })

  console.log('Seeding blog posts...')
  const posts = [
    {
      slug: 'why-templates-cost-more-than-custom-builds',
      title: 'Why a “Cheap” Template Website Can Cost More in the Long Run',
      excerpt:
        "A cheap website can cost more in the long run.",
      body: [
        block(
          'The real difference is not just the upfront price. Templates are quick and affordable, but they may limit your SEO, customer experience, and future growth.'
        ),
        block(
          'We often see businesses outgrow template websites. They start cheap, but later need a rebuild when the website can no longer support their needs.'
        ),
      ],
      publishedAt: '2026-05-12T09:00:00Z',
    },
    {
      slug: 'mpesa-integration-what-actually-matters',
      title: 'M-Pesa Integration: What Matters Beyond the STK Push',
      excerpt:
        "Getting M-Pesa payments working is just the beginning.",
      body: [
        block(
          'A working demo is not enough for a real business. A reliable M-Pesa integration needs to handle payments, confirmations, errors, and real customer traffic.'
        ),
        block(
          'We build M-Pesa integrations with reliability in mind. Payments are properly tracked and matched to your records to help prevent errors and duplicate transactions.'
        ),
      ],
      publishedAt: '2026-06-03T09:00:00Z',
    },
  ]

  for (const post of posts) {
    await client.createOrReplace({
      _id: `blog-${post.slug}`,
      _type: 'blogPost',
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      excerpt: post.excerpt,
      body: post.body,
      publishedAt: post.publishedAt,
      author: { _type: 'reference', _ref: 'team-leon' },
    })
  }

  console.log('Done seeding.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
