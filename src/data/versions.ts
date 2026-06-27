export interface ComponentVersion {
  key: string
  label: string
  version: string
  pulse: boolean
}

async function fetchRelease(repo: string): Promise<string> {
  try {
    const token = import.meta.env.GITHUB_TOKEN
    const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers })
    if (!res.ok) return '—'
    const data = await res.json() as { tag_name?: string }
    return data.tag_name?.replace(/^v/, '') ?? '—'
  } catch {
    return '—'
  }
}

export async function getComponentVersions(): Promise<ComponentVersion[]> {
  const [forge, arsenal] = await Promise.all([
    fetchRelease('karn-mtg/forge'),
    fetchRelease('karn-mtg/karn'),
  ])

  return [
    { key: 'forge',    label: 'Forge',    version: forge,   pulse: true  },
    { key: 'arsenal',  label: 'Arsenal',  version: arsenal, pulse: false },
    { key: 'cards-db', label: 'Cards DB', version: '—',     pulse: false },
    { key: 'rules-db', label: 'Rules DB', version: '—',     pulse: false },
    { key: 'karn',     label: 'Karn AI',  version: arsenal, pulse: true  },
  ]
}
