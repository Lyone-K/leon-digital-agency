import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

type Props = {
  name: string
  email: string
  phone: string
  companyName?: string
  industry: string
  projectType: string
  addOns: string[]
  budgetRange: string
  estimateMin: number
  estimateMax: number
}

export default function EstimatorLeadEmail({
  name,
  email,
  phone,
  companyName,
  industry,
  projectType,
  addOns,
  budgetRange,
  estimateMin,
  estimateMax,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>New project estimate request from {name}</Preview>
      <Body style={{ backgroundColor: '#F6F3EC', fontFamily: 'Georgia, serif' }}>
        <Container style={{ padding: '32px', backgroundColor: '#0E1B2B', color: '#EDEAE2' }}>
          <Heading style={{ color: '#C9A24C', fontSize: '20px' }}>New estimate request</Heading>
          <Text>
            {name} ({companyName || 'no company given'}) requested an estimate for a{' '}
            {projectType} project in the {industry} industry.
          </Text>

          <Hr style={{ borderColor: 'rgba(201,162,76,0.2)' }} />

          <Text style={{ margin: 0 }}>
            <strong style={{ color: '#C9A24C' }}>Estimated range:</strong> KES{' '}
            {estimateMin.toLocaleString()} – {estimateMax.toLocaleString()}
          </Text>
          <Text style={{ margin: 0 }}>
            <strong style={{ color: '#C9A24C' }}>Stated budget:</strong> {budgetRange}
          </Text>
          <Text style={{ margin: 0 }}>
            <strong style={{ color: '#C9A24C' }}>Requested features:</strong>{' '}
            {addOns.length ? addOns.join(', ') : 'None selected'}
          </Text>

          <Hr style={{ borderColor: 'rgba(201,162,76,0.2)' }} />

          <Text style={{ margin: 0 }}>
            <strong style={{ color: '#C9A24C' }}>Contact:</strong> {email} · {phone}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
