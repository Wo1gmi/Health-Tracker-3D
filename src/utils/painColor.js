export function painToColor(value) {
  if (value === 0) return { color: '#bfdbfe', emissive: '#93c5fd', emissiveIntensity: 0.08, opacity: 0.55 }
  if (value <= 3)  return { color: '#93c5fd', emissive: '#60a5fa', emissiveIntensity: 0.12, opacity: 0.70 }
  if (value <= 6)  return { color: '#fcd34d', emissive: '#f59e0b', emissiveIntensity: 0.15, opacity: 0.80 }
  if (value <= 8)  return { color: '#f87171', emissive: '#ef4444', emissiveIntensity: 0.18, opacity: 0.88 }
  return             { color: '#ef4444', emissive: '#dc2626', emissiveIntensity: 0.22, opacity: 0.95 }
}

export function painToLabel(value) {
  if (value === 0)  return 'нет боли'
  if (value <= 3)   return 'слабая'
  if (value <= 6)   return 'умеренная'
  if (value <= 9)   return 'сильная'
  return 'острая'
}

export function painToBadgeColor(value) {
  if (value === 0) return '#1d4ed8'
  if (value <= 3)  return '#3b82f6'
  if (value <= 6)  return '#f59e0b'
  if (value <= 8)  return '#ef4444'
  return '#dc2626'
}
