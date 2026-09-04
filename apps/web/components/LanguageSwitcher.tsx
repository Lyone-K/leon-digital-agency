'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'

// Kept as a plain <select> rather than a custom dropdown menu — with 7 languages
// a row of inline text links (as this was with just EN/SW) stops being readable,
// and a native select is the simplest accessible widget that scales to a longer
// list without extra state/positioning logic.
const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
]

export default function LanguageSwitcher() {
  const t = useTranslations('language')
  const locale = useLocale()
  const router = useRouter()

  function setLocale(code: string) {
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000`
    router.refresh()
  }

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Globe className="h-3.5 w-3.5 opacity-60" />
      <label className="sr-only" htmlFor="language-switcher">
        {t('label')}
      </label>
      <select
        id="language-switcher"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        className="cursor-pointer border-none bg-transparent text-bone/80 outline-none [&>option]:bg-ink [&>option]:text-bone"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  )
}
