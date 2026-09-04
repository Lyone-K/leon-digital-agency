import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import type { PageSpeedResult } from '@/lib/audit/pagespeed'
import type { AiAuditSummary } from '@/lib/audit/ai-analysis'

type Props = {
  url: string
  scores: PageSpeedResult
  aiSummary: AiAuditSummary
}

export default function AuditReportEmail({ url, scores, aiSummary }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your website audit for {url}</Preview>
      <Body style={{ backgroundColor: '#F6F3EC', fontFamily: 'Georgia, serif' }}>
        <Container style={{ padding: '32px', backgroundColor: '#0E1B2B', color: '#EDEAE2' }}>
          <Heading style={{ color: '#C9A24C', fontSize: '20px' }}>{aiSummary.headline}</Heading>
          <Text>{aiSummary.summary}</Text>

          <Hr style={{ borderColor: 'rgba(201,162,76,0.2)' }} />

          <Text style={{ margin: 0 }}>Performance: {scores.performanceScore}/100</Text>
          <Text style={{ margin: 0 }}>SEO: {scores.seoScore}/100</Text>
          <Text style={{ margin: 0 }}>Accessibility: {scores.accessibilityScore}/100</Text>
          <Text style={{ margin: 0 }}>Best practices: {scores.bestPracticesScore}/100</Text>

          {aiSummary.recommendations.length > 0 && (
            <>
              <Hr style={{ borderColor: 'rgba(201,162,76,0.2)' }} />
              <Text style={{ color: '#C9A24C', margin: '0 0 8px' }}>Top recommendations</Text>
              {aiSummary.recommendations.map((r, i) => (
                <Text key={i} style={{ margin: '0 0 4px' }}>
                  {i + 1}. {r}
                </Text>
              ))}
            </>
          )}

          <Hr style={{ borderColor: 'rgba(201,162,76,0.2)' }} />
          <Text style={{ fontSize: '12px', color: 'rgba(237,234,226,0.6)' }}>
            Want help fixing these? Reply to this email or book a call at
            leondigitalagency.com/book.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
