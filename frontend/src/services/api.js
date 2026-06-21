// Uses environment variable in production, falls back to localhost in development
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function submitIntake(formData) {
  const res = await fetch(`${BASE_URL}/api/intake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  if (!res.ok) throw new Error('Submission failed')
  return res.json()
}

export async function fetchTickets() {
  const res = await fetch(`${BASE_URL}/api/tickets`)
  if (!res.ok) throw new Error('Could not load tickets')
  return res.json()
}

export async function updateStatus(ticketId, status) {
  const res = await fetch(`${BASE_URL}/api/tickets/${ticketId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Could not update status')
  return res.json()
}