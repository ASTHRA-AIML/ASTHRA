import type { Activity, Newsletter, CommitteeYear } from './types'

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return String(dateStr)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return String(dateStr)
  }
}

export function mapActivityListItem(item: any): Activity {
  if (!item) return {} as Activity
  return {
    id: String(item.id ?? ''),
    title: item.title || '',
    date: formatDate(item.activity_date),
    imageUrl: item.thumbnail_url || '',
    shortDescription: item.description ? item.description.slice(0, 160) : '',
    fullDescription: item.description || '',
    gallery: [],
  }
}

export function mapActivityDetail(item: any): Activity {
  if (!item) return {} as Activity
  const gallery = Array.isArray(item.image_url) ? item.image_url : []
  return {
    id: String(item.id ?? ''),
    title: item.title || '',
    date: formatDate(item.activity_date),
    imageUrl: item.thumbnail_url || (gallery.length > 0 ? gallery[0] : ''),
    shortDescription: item.description ? item.description.slice(0, 160) : '',
    fullDescription: item.description || '',
    gallery: gallery,
  }
}

export function mapNewsletterListItem(item: any): Newsletter {
  if (!item) return {} as Newsletter
  return {
    id: String(item.id ?? ''),
    title: item.title || '',
    date: formatDate(item.newsletter_date),
    coverUrl: item.cover_image_url || '',
    shortDescription: item.description ? item.description.slice(0, 160) : '',
    fullDescription: item.description || '',
  }
}

export function mapNewsletterDetail(item: any): Newsletter {
  if (!item) return {} as Newsletter
  return {
    id: String(item.id ?? ''),
    title: item.title || '',
    date: formatDate(item.newsletter_date),
    coverUrl: item.cover_image_url || '',
    shortDescription: item.description ? item.description.slice(0, 160) : '',
    fullDescription: item.description || '',
    pdfUrl: item.pdf_url || '',
  }
}

export function mapCommitteeYear(item: any): CommitteeYear {
  if (!item) return { year: '', members: [] }
  return {
    year: item.acadamic_year || '',
    members: Array.isArray(item.members)
      ? item.members.map((m: any) => ({
          name: m.name || '',
          position: m.position || '',
          imageUrl: m.photo_url || '',
          linkedinUrl: m.linkedin_url || '',
        }))
      : [],
  }
}
