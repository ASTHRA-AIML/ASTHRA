// api/sitemap.xml.js — Vercel serverless function
// Generates a dynamic sitemap.xml by fetching live activity and newsletter IDs
// from the backend API, then returning a valid XML sitemap.
//
// Accessible at: GET /api/sitemap.xml
// (Vercel rewrites /sitemap.xml → this handler if you add a rewrite in vercel.json)

const SITE_URL = process.env.SITE_URL || 'https://asthra-cse.com'
const API_BASE  = process.env.VITE_API_BASE_URL || 'https://asthra-cse.com'

/** Fetch JSON from backend; returns [] on any error so the sitemap still builds */
async function safeFetch(url) {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function urlEntry(loc, lastmod, changefreq = 'weekly', priority = '0.7') {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

export default async function handler(req, res) {
  const today = new Date().toISOString().split('T')[0]

  // Fetch activity and newsletter lists in parallel
  const [activities, newsletters] = await Promise.all([
    safeFetch(`${API_BASE}/asthra/activities`),
    safeFetch(`${API_BASE}/asthra/newsletters`),
  ])

  const staticUrls = [
    urlEntry(`${SITE_URL}/`,            today, 'daily',  '1.0'),
    urlEntry(`${SITE_URL}/activities`,  today, 'weekly', '0.8'),
    urlEntry(`${SITE_URL}/newsletters`, today, 'weekly', '0.8'),
    urlEntry(`${SITE_URL}/committee`,   today, 'monthly','0.6'),
  ]

  const activityUrls = activities.map((a) => {
    const lastmod = a.activity_date
      ? a.activity_date.split('T')[0]
      : today
    return urlEntry(`${SITE_URL}/activities/${a.id}`, lastmod, 'monthly', '0.6')
  })

  const newsletterUrls = newsletters.map((n) => {
    const lastmod = n.newsletter_date
      ? n.newsletter_date.split('T')[0]
      : today
    return urlEntry(`${SITE_URL}/newsletters/${n.id}`, lastmod, 'monthly', '0.6')
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...activityUrls, ...newsletterUrls].join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.status(200).send(xml)
}
