import type { Metadata } from 'next'
import CheckoutClient from './CheckoutClient'

const BASE = 'https://isalebryan.dev'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order — pay securely via M-Pesa STK Push.',
  alternates: { canonical: `${BASE}/shop/checkout` },
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
