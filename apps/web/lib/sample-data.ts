// Placeholder content shaped exactly like what will come from Sanity queries.
// Once Sanity is connected, swap these constants for `sanityClient.fetch(...)` calls
// using the same shape — components don't need to change.

export const trustStats = [
  { label: 'Websites Delivered', value: 10, suffix: '+' },
  { label: 'Avg. Performance score', value: 96, suffix: '' },
  { label: 'Client retention', value: 92, suffix: '%' },
  { label: 'Countries served', value: 2, suffix: '' },
]

export const services = [
  {
    name: 'Custom Web Design',
    slug: 'web-design',
    shortDescription:
      'Professional websites designed from scratch to match your brand and business goals',
  },
  {
    name: 'Web Applications',
    slug: 'web-apps',
    shortDescription:
      'Custom booking systems, client portals, dashboards and business tools built for your needs',
  },
  {
    name: 'Mobile Applications',
    slug: 'M-apps',
    shortDescription:
      'Custom booking systems, client portals, dashboards and business tools built for your needs',
  },
  {
    name: 'CMS Integration',
    slug: 'cms',
    shortDescription:
      'Update your website easily anytime — no technical skills required',
  },
  {
    name: 'SEO & Performance',
    slug: 'seo',
    shortDescription:
      'Fast, secure and search engine-friendly websites that help customers find your business',
  },
]

export const caseStudies = [
  {
    clientName: 'JT Malika Tours & Safaris',
    slug: 'jt-malika-tours',
    industry: 'Tourism & Safari',
    summary: 'A modern website designed to showcase unforgettable safari experiences and generate more customer inquiries.',
    coverImage: null,
    challenge:
      'JT Malika was starting a company, but didn\'t own a website to reflect the quality of their services. We developed their online presence with a modern, easy-to-use website that showcases their safari packages and makes it simple for customers to get in touch and book their next adventure',
    solution:
      'We delivered a modern, mobile-friendly website with easy content management, online inquiry forms and SEO to help the business reach more customers.',
    metrics: [
      { label: 'Inquiry rate', value: 3, suffix: 'x' },
      { label: 'Avg. session', value: 4, suffix: '', context: 'minutes' },
      { label: 'Bounce rate', value: 42, suffix: '%', prefix: '-' },
    ],
    beforeAfterGallery: [
      { label: 'Homepage', beforeImage: null, afterImage: null, caption: 'A fresh, professional website that reflects the quality of the business.' },
      { label: 'Itinerary page', beforeImage: null, afterImage: null, caption: 'Interactive tour packages that help customers plan with confidence.' },
    ],
    liveUrl: null,
    testimonial: {
      clientName: 'Julius T.',
      clientTitle: 'Managing Director, JT Malika Tours & Safaris',
      quote:
        'Leon Digital gave our business a professional website that truly represents our brand. The process was smooth, and we\'re proud of the final result.',
    },
  },
  {
    clientName: 'Placeholder Client — Real Estate',
    slug: 'placeholder-real-estate',
    industry: 'Real Estate',
    summary: 'A modern property website that makes it easy for buyers to find homes and contact agents.',
    coverImage: null,
    challenge:
      'Property listings were difficult to manage, and customers struggled to find the right properties quickly.',
    solution:
      'We built a fast, easy-to-manage property website with smart search, online inquiries, and simple property management.',
    metrics: [
      { label: 'Lead volume', value: 210, suffix: '%' },
      { label: 'Bounce rate', value: 38, suffix: '%', prefix: '-' },
    ],
    beforeAfterGallery: [
      { label: 'Listings page', beforeImage: null, afterImage: null, caption: 'Making it easier for customers to find the right property.' },
    ],
    liveUrl: null,
    testimonial: null,
  },
]

export const teamMembers = [
  {
  name: "Leon K.",
  role: "Founder & Lead Developer",
  imageUrl: "https://res.cloudinary.com/pdnic2cl/image/upload/f_auto,q_auto/ChatGPT_Image_Aug_16_2026_11_54_33_PM",
  bio: "Designs and develops modern websites and custom web applications that help businesses grow online.",
  },
  {
    name: 'Ben K.',
    role: 'Backend & Systems Developer',
    bio: 'Builds secure, reliable systems that power websites, online bookings, payments and business operations.',
  },
  {
    name: 'Nickson I.',
    role: 'UI/UX & Design Lead',
    bio: 'Creates clean, user-friendly designs that reflect each client\'s brand and deliver a great user experience.',
  },
  {
    name: 'Kingsley L.',
    role: 'Finance Manager',
    bio: 'Oversees project budgeting, financial planning, invoicing and ensures smooth financial operations for every client.',
  },
  {
    name: 'Tassy M.',
    role: 'Marketing Lead',
    bio: 'Develops marketing strategies and digital campaigns that help clients reach more customers and grow their businesses.',
  },
]

export const agencyStory = {
  heading: 'Built in Nairobi, for businesses across Kenya and East Africa',
  paragraphs: [
    'At Leon Digital, we believe every business deserves a website that reflects its true value. That\'s why we create custom websites and digital solutions designed to build trust, attract customers and support business growth.',
    'From planning and design to development, launch and ongoing support, we handle every step of your digital journey.',
  ],
}

export const testimonial = {
  clientName: 'Julius T.',
  clientTitle: 'Managing Director, JT Malika Tours & Safaris',
  quote:
    'Leon Digital gave our business a professional website that truly represents our brand. The process was smooth, and we\'re proud of the final result.',
}

export const blogPosts = [
  {
    slug: 'why-templates-cost-more-than-custom-builds',
    title: 'Why a "cheap" template site usually costs more in the long run',
    excerpt:
      'Template sites look like a bargain upfront. Here\'s the math on what they actually cost once you factor in the rebuild.',
    publishedAt: '2026-05-12',
    author: 'Leon M.',
    body: 'Most businesses choosing between a template and a custom build compare the sticker price and stop there. That\'s the wrong comparison. A template site is optimized for one thing: getting something live fast and cheap. It is not optimized for search visibility, for conversion, or for surviving the day your business needs a feature the template was never built to support.\n\nWe have rebuilt more templated sites than we have built from scratch on a first engagement, and the pattern is always the same: a business spent a fraction of the cost upfront, ran on it for a year or two, then rebuilt anyway once the limitations started actually costing them customers. The rebuild ends up costing more in total than a custom build would have on day one, because it comes with lost time, lost SEO history, and lost revenue while the new site catches up.',
  },
  {
    slug: 'mpesa-integration-what-actually-matters',
    title: 'M-Pesa integration: what actually matters beyond the STK push',
    excerpt:
      'Getting the STK push working is the easy part. Here\'s what separates a demo integration from one that survives real traffic.',
    publishedAt: '2026-06-03',
    author: 'David O.',
    body: 'Every tutorial on M-Pesa integration stops the moment the STK push prompt appears on a test phone. That is maybe 30% of building something you can actually run a business on. The other 70% is what happens when Safaricom\'s callback is late, when it never arrives at all, when it arrives twice, or when someone cancels the payment on their phone.\n\nSafaricom does not cryptographically sign its callbacks the way Stripe does, so you cannot verify the sender the same way. You have to design around that: never trust an amount from the callback body, always reconcile against your own stored transaction, and build idempotency in from day one so a duplicate callback does not double-charge or double-fulfil an order. None of this shows up in the getting-started docs, and all of it is the difference between a demo and something that survives contact with real customers.',
  },
]

export const industryPages = [
  {
    slug: 'tourism',
    industryName: 'Tourism & Safari',
    heroHeading: 'Websites that help you win more bookings',
    heroSubheading:
      'For safari operators, lodges and tour companies that want customers to see the experience before they book.',
    painPoints: [
      'Generic websites that make your business look like everyone else',
      "No clear way for customers to see what their trip will be like",
      'Enquiries getting lost because the booking process is not simple',
    ],
  },
  {
    slug: 'healthcare',
    industryName: 'Healthcare',
    heroHeading: 'Your website should build trust from the start',
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
    heroHeading: 'Websites that help sell properties',
    heroSubheading:
      'For real estate agencies and developers who need customers to easily find, view and enquire about properties.',
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
      'For hotels and guesthouses that want more direct bookings and less reliance on third-party platforms',
    painPoints: [
      'Depending too much on booking platforms and paying their fees',
      "A website that doesn't show the true quality of your property",
      'No simple way to showcase rooms, prices and availability',
    ],
  },
]
