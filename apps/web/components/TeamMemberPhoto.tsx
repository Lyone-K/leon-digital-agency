import Image from 'next/image'
import { urlFor } from '@/lib/sanity.client'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function TeamMemberPhoto({ photo, name }: { photo?: any; name: string }) {
  let src: string | null = null
  if (photo) {
    try {
      src = urlFor(photo).width(400).height(400).fit('crop').url()
    } catch {
      src = null
    }
  }

  return (
    <div className="aspect-square w-full overflow-hidden border border-gold-hairline bg-emerald-deep">
      {src ? (
        <Image
          src={src}
          alt={name}
          width={400}
          height={400}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-3xl text-gold">{getInitials(name)}</span>
        </div>
      )}
    </div>
  )
}
