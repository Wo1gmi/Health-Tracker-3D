function hslToHex(h, s, l) {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = n => {
    const k = (n + h / 30) % 12
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * c).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function lerp(a, b, t) { return a + (b - a) * t }

// Gradient (no purple — ice-blue → pale blush → rose → deep red):
//   0   → hsl(208, 70%, 80%)  ice blue  (same tone as base model)
//   0–2 → fade saturation to near-white, keeping blue hue
//   2–6 → pink/rose: hsl(355, ~70–78%, 87–73%)
//   6–10→ deeper red: hsl(352, 80–90%, 73–52%)
function painHSL(value) {
  const v = Math.max(0, Math.min(10, value))

  if (v === 0) return { h: 208, s: 70, l: 80 }

  // Phase 1: blue fades to pale (hue stays 208, saturation collapses)
  if (v <= 2) {
    const t = v / 2
    return { h: 208, s: lerp(70, 18, t), l: lerp(80, 92, t) }
  }

  // Phase 2: pale blush → medium rose (hue jumps to 355 at near-white, so jump is invisible)
  if (v <= 6) {
    const t = (v - 2) / 4
    return { h: 355, s: lerp(62, 78, t), l: lerp(87, 73, t) }
  }

  // Phase 3: rose → deep red
  const t = (v - 6) / 4
  return { h: 352, s: lerp(78, 90, t), l: lerp(73, 52, t) }
}

export function painToColor(value) {
  const { h, s, l } = painHSL(value)
  const t = value / 10
  return {
    color:             hslToHex(h, s, l),
    emissive:          hslToHex(h, Math.min(100, s + 8), Math.max(20, l - 18)),
    emissiveIntensity: lerp(0.08, 0.20, t),
    opacity:           lerp(0.72, 0.94, t),
  }
}

export function painToHex(value) {
  return painToColor(value).color
}

export function painToLabel(value) {
  if (value === 0) return 'нет боли'
  if (value <= 3)  return 'слабая'
  if (value <= 6)  return 'умеренная'
  if (value <= 9)  return 'сильная'
  return 'острая'
}

export function painToBadgeColor(value) {
  if (value === 0) return '#1d4ed8'
  return painToColor(value).color
}
