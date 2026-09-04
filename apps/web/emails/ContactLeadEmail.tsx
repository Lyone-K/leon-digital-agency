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

type Props = {
  name: string
  email: string
  phone?: string
  companyName?: string
  message: string
}

export default function ContactLeadEmail({ name, email, phone, companyName, message }: Props) {
  return (
    <Html>
      <Head />
      <Preview>New contact form message from {name}</Preview>
      <Body style={{ backgroundColor: '#F6F3EC', fontFamily: 'Georgia, serif' }}>
        <Container style={{ padding: '32px', backgroundColor: '#0E1B2B', color: '#EDEAE2' }}>
          <Heading style={{ color: '#C9A24C', fontSize: '20px' }}>New contact message</Heading>
          <Text>
            {name} ({companyName || 'no company given'}) sent a message through the
            contact form.
          </Text>

          <Hr style={{ borderColor: 'rgba(201,162,76,0.2)' }} />

          <Text style={{ whiteSpace: 'pre-wrap' }}>{message}</Text>

          <Hr style={{ borderColor: 'rgba(201,162,76,0.2)' }} />

          <Text style={{ margin: 0 }}>
            <strong style={{ color: '#C9A24C' }}>Contact:</strong> {email}
            {phone ? ` · ${phone}` : ''}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
