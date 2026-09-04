import Anthropic from '@anthropic-ai/sdk'
import type { PageSpeedResult } from './pagespeed'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type AiAuditSummary = {
  headline: string
  summary: string
  recommendations: string[]
}

export async function generateAiSummary(
  targetUrl: string,
  scores: PageSpeedResult
): Promise<AiAuditSummary> {
  const prompt = `You are a senior web performance and SEO consultant writing a short audit
summary for a prospective client of a web design agency. Be direct and specific,
not generic. Base every claim only on the data given below — do not invent
details about the site's content or design that you cannot see.

Site: ${targetUrl}
Performance score (mobile, 0-100): ${scores.performanceScore}
SEO score: ${scores.seoScore}
Accessibility score: ${scores.accessibilityScore}
Best practices score: ${scores.bestPracticesScore}
Largest Contentful Paint: ${scores.coreWebVitals.lcp ?? 'unavailable'}
Cumulative Layout Shift: ${scores.coreWebVitals.cls ?? 'unavailable'}
First Contentful Paint: ${scores.coreWebVitals.fcp ?? 'unavailable'}

Respond ONLY with valid JSON, no markdown fences, no preamble, matching exactly:
{
  "headline": "<one sentence, under 15 words, the single biggest takeaway>",
  "summary": "<2-3 sentences of plain-language explanation of what these numbers mean for the business, not just the tech>",
  "recommendations": ["<specific, prioritized action>", "<specific, prioritized action>", "<specific, prioritized action>"]
}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  })

  const textBlock = message.content.find((block) => block.type === 'text')
  const raw = textBlock && 'text' in textBlock ? textBlock.text : '{}'

  try {
    return JSON.parse(raw.trim())
  } catch {
    // If the model didn't return clean JSON, degrade gracefully rather than
    // failing the whole audit — the numeric scores are still useful on their own.
    return {
      headline: 'Audit complete — see scores below',
      summary: 'We ran into an issue generating the written summary, but the scores above are accurate.',
      recommendations: [],
    }
  }
}
