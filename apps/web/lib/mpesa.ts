// Safaricom Daraja API wrapper for M-Pesa STK Push ("Lipa Na M-Pesa Online").
// Sandbox vs production is controlled by MPESA_ENV. See:
// https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate

const BASE_URL =
  process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'

async function getAccessToken(): Promise<string> {
  const key = process.env.MPESA_CONSUMER_KEY
  const secret = process.env.MPESA_CONSUMER_SECRET
  if (!key || !secret) {
    throw new Error('MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET are not configured')
  }

  const credentials = Buffer.from(`${key}:${secret}`).toString('base64')
  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
  })
  if (!res.ok) throw new Error(`M-Pesa OAuth failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

function generatePassword(timestamp: string) {
  const shortcode = process.env.MPESA_SHORTCODE
  const passkey = process.env.MPESA_PASSKEY
  if (!shortcode || !passkey) {
    throw new Error('MPESA_SHORTCODE / MPESA_PASSKEY are not configured')
  }
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
}

function timestampNow() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

// Safaricom requires numbers in 2547XXXXXXXX format (no leading + or 0).
export function normalizeKenyanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('254')) return digits
  if (digits.startsWith('0')) return `254${digits.slice(1)}`
  if (digits.startsWith('7') || digits.startsWith('1')) return `254${digits}`
  return digits
}

export async function initiateStkPush(params: {
  phone: string
  amountKES: number
  accountReference: string
  transactionDesc: string
}) {
  const accessToken = await getAccessToken()
  const timestamp = timestampNow()
  const password = generatePassword(timestamp)
  const phone = normalizeKenyanPhone(params.phone)
  const shortcode = process.env.MPESA_SHORTCODE

  const res = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(params.amountKES),
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: params.accountReference.slice(0, 12), // Safaricom caps this field
      TransactionDesc: params.transactionDesc.slice(0, 13),
    }),
  })

  const data = await res.json()
  if (!res.ok || data.errorCode) {
    throw new Error(data.errorMessage || `STK Push request failed: ${res.status}`)
  }
  // Contains CheckoutRequestID, MerchantRequestID — CheckoutRequestID is what the
  // callback will reference, so the caller should store it against the Payment row.
  return data as {
    MerchantRequestID: string
    CheckoutRequestID: string
    ResponseCode: string
    ResponseDescription: string
    CustomerMessage: string
  }
}
