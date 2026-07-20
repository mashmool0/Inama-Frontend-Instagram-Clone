const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#f43f5e"/>
      <stop offset="1" stop-color="#fb7185"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#g)"/>
  <circle cx="32" cy="32" r="15" fill="none" stroke="white" stroke-width="5"/>
  <circle cx="46" cy="18" r="4" fill="white"/>
</svg>`

export function GET() {
  return new Response(icon, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
