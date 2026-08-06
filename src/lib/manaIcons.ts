// Colorless cards (colorIdentity: []) still pay a real cost — usually generic
// mana like {2}, not the dedicated {C} colorless symbol. Fall back to the
// generic number pulled from manaCost so e.g. Old Thrush shows "2", not a
// colorless pip it never actually costs.
export function manaIconColors(colorIdentity: string[], manaCost?: string): string[] {
  if (colorIdentity.length > 0) return colorIdentity
  const genericMatch = manaCost?.match(/\{(\d+)\}/)
  return genericMatch ? [genericMatch[1]] : ['C']
}
