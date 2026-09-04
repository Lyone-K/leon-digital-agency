import type { Metadata } from 'next'
import { getTeamMembers } from '@/lib/sanity.queries'
import { agencyStory } from '@/lib/sample-data'
import { CTABanner } from '@/components/sections/Testimonial'
import TeamMemberPhoto from '@/components/TeamMemberPhoto'

export const metadata: Metadata = {
  title: 'About',
  description: 'Leon Digital is a Nairobi-based web design and development agency creating modern websites and custom web applications for businesses across Kenya and East Africa.',
}

export const revalidate = 3600

export default async function AboutPage() {
  const team = await getTeamMembers()

  return (
    <>
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-content px-6 pb-16 pt-16 md:pt-24">
          <p className="eyebrow mb-6">About us</p>
          <h1 className="max-w-2xl font-display text-4xl leading-[1.1] md:text-5xl">
            {agencyStory.heading}
          </h1>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="mx-auto max-w-content px-6 py-16">
          <div className="max-w-2xl space-y-6">
            {agencyStory.paragraphs.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-slate">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="mx-auto max-w-content px-6 pb-20">
          <p className="eyebrow mb-3 text-emerald">The team</p>
          <h2 className="mb-10 font-display text-3xl text-ink md:text-4xl">Meet the Team Behind Leon Digital</h2>

          <div className="grid gap-px overflow-hidden bg-gold-hairline sm:grid-cols-2 md:grid-cols-3">
            {team.map((member: any) => (
              <div key={member.name} className="bg-parchment p-8">
                <TeamMemberPhoto photo={member.photo} name={member.name} />
                <h3 className="mt-5 font-display text-xl text-ink">{member.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-emerald">{member.role}</p>
                <p className="mt-3 text-sm text-slate">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  )
}
