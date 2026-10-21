/* Channel feed + title-based trick detection for the /bmx page. No client-only code here, so the
   server page can fetch while the client component reuses the types and classifier. */

export type ChannelVideo = {
  id: string
  title: string
  date: string // DD-MM-YYYY
  short: boolean
}

const CHANNEL_ID = 'UCiGJdxB42CSX9Ul6M7Mnybw'

/* Order matters: first match wins, so "Fakie 180" lands on 180 and "Footjam fakies" on Fakies.
   quarter = which 2026 roadmap card the clip belongs on (undefined = feed only). */
const TRICK_RULES: { re: RegExp; label: string; quarter?: number }[] = [
  { re: /\b180s?\b|nose manual/i, label: '180s', quarter: 4 },
  { re: /half[\s-]?cabs?/i, label: 'Half cabs', quarter: 3 },
  { re: /foot[\s-]?plants?/i, label: 'Footplants', quarter: 3 },
  { re: /fakies|fakie/i, label: 'Fakies', quarter: 3 },
  { re: /bar[\s-]?spins?|barspins?/i, label: 'Barspins', quarter: 2 },
  { re: /crank[\s-]?flips?/i, label: 'Crankflips', quarter: 2 },
  { re: /\bx[\s-]?ups?\b/i, label: 'X-ups', quarter: 2 },
  { re: /manuals?/i, label: 'Manuals', quarter: 1 },
  { re: /foot[\s-]?jams?/i, label: 'Footjams', quarter: 1 },
  { re: /tail[\s-]?whips?/i, label: 'Tailwhips' },
  { re: /bunny[\s-]?hops?/i, label: 'Bunny hops' },
  { re: /axle|bottom bracket|headset|repair|fix/i, label: 'Bike work' },
]

export function detectTrick(title: string): { label: string; quarter?: number } | null {
  const hit = TRICK_RULES.find(r => r.re.test(title))
  return hit ? { label: hit.label, quarter: hit.quarter } : null
}

export function cleanTitle(title: string): string {
  return title.replace(/#\S+/g, '').replace(/\s+/g, ' ').trim()
}

const decode = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')

/* Latest ~15 uploads from the public channel RSS feed, cached for an hour. [] if YouTube is unreachable. */
export async function fetchChannelVideos(): Promise<ChannelVideo[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const xml = await res.text()
    const videos: ChannelVideo[] = []
    for (const entry of xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? []) {
      const id = entry.match(/<yt:videoId>([^<]+)</)?.[1]
      const title = entry.match(/<title>([^<]*)</)?.[1]
      const published = entry.match(/<published>(\d{4})-(\d{2})-(\d{2})/)
      const link = entry.match(/<link rel="alternate" href="([^"]+)"/)?.[1] ?? ''
      if (!id || !title || !published) continue
      videos.push({
        id,
        title: cleanTitle(decode(title)),
        date: `${published[3]}-${published[2]}-${published[1]}`,
        short: link.includes('/shorts/'),
      })
    }
    return videos
  } catch {
    return []
  }
}
