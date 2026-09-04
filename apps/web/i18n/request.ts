import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export const SUPPORTED_LOCALES = ['en', 'sw', 'fr', 'de', 'es', 'pt', 'it'] as const
export const DEFAULT_LOCALE = 'en'

export default getRequestConfig(async () => {
  const cookieLocale = cookies().get('NEXT_LOCALE')?.value
  const locale = SUPPORTED_LOCALES.includes(cookieLocale as any) ? cookieLocale! : DEFAULT_LOCALE

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
