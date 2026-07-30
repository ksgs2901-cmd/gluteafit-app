export function getYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1) || null
    if (u.searchParams.has('v')) return u.searchParams.get('v')
    const shortsMatch = u.pathname.match(/\/shorts\/([^/]+)/)
    if (shortsMatch) return shortsMatch[1]
    return null
  } catch {
    return null
  }
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const id = getYouTubeVideoId(url)
  if (!id) return null
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`
}

export function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeVideoId(url)
  if (!id) return null
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}
