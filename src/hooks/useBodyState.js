import { useState, useCallback, useEffect } from 'react'
import { MUSCLE_GROUPS }   from '../data/muscles'
import { SKELETON_GROUPS } from '../data/skeleton'
import { TENDON_GROUPS }   from '../data/tendons'
import { BURSAE_GROUPS }   from '../data/bursae'

const STORAGE_KEY = 'bodyhealth-state-v2'

export const LAYER_GROUPS = {
  muscles:  MUSCLE_GROUPS,
  skeleton: SKELETON_GROUPS,
  tendons:  TENDON_GROUPS,
  bursae:   BURSAE_GROUPS,
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const EMPTY_STATE = { muscles: {}, skeleton: {}, tendons: {}, bursae: {} }

export function useBodyState() {
  const [bodyState, setBodyState] = useState(() => {
    const saved = load(STORAGE_KEY, null)
    // Migrate from old flat muscleState if present
    if (saved && !saved.muscles) {
      return { ...EMPTY_STATE, muscles: saved }
    }
    return saved ?? EMPTY_STATE
  })

  // Kept for backwards compat with LeftSidebar/recommendations
  const [organState, setOrganState] = useState(() => load('bodyhealth-organs', {}))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bodyState))
  }, [bodyState])

  useEffect(() => {
    localStorage.setItem('bodyhealth-organs', JSON.stringify(organState))
  }, [organState])

  const updateEntry = useCallback((layer, id, data) => {
    setBodyState(prev => ({
      ...prev,
      [layer]: {
        ...prev[layer],
        [id]: {
          pain: 0, notes: '',
          ...prev[layer]?.[id],
          ...data,
          updatedAt: new Date().toISOString(),
        },
      },
    }))
  }, [])

  const resetLayer = useCallback((layer) => {
    setBodyState(prev => ({ ...prev, [layer]: {} }))
  }, [])

  const resetAll = useCallback(() => {
    setBodyState(EMPTY_STATE)
  }, [])

  const updateOrgan = useCallback((id, data) => {
    setOrganState(prev => ({ ...prev, [id]: { ...prev[id], ...data } }))
  }, [])

  // Returns pain zones for one layer (or all layers merged when layer=null)
  const getPainZones = useCallback((layer = null) => {
    if (layer) {
      return Object.entries(bodyState[layer] ?? {})
        .filter(([, v]) => v.pain > 0)
        .sort(([, a], [, b]) => b.pain - a.pain)
    }
    // All layers merged — each entry carries a `layer` field
    return Object.entries(LAYER_GROUPS).flatMap(([lyr]) =>
      Object.entries(bodyState[lyr] ?? {})
        .filter(([, v]) => v.pain > 0)
        .map(([id, data]) => [id, { ...data, layer: lyr }])
    ).sort(([, a], [, b]) => b.pain - a.pain)
  }, [bodyState])

  const getHealthScore = useCallback(() => {
    const all = Object.values(bodyState).flatMap(l => Object.values(l))
    if (!all.length) return 100
    const total = all.reduce((acc, m) => acc + (m.pain ?? 0), 0)
    return Math.max(0, Math.round(100 - (total / (all.length * 10)) * 100))
  }, [bodyState])

  const getMaxPain = useCallback((layer = null) => {
    const entries = layer
      ? Object.values(bodyState[layer] ?? {})
      : Object.values(bodyState).flatMap(l => Object.values(l))
    return entries.reduce((max, m) => Math.max(max, m.pain ?? 0), 0)
  }, [bodyState])

  // muscleState kept for RightSidebar recommendations (unchanged API)
  const muscleState = bodyState.muscles

  return {
    bodyState,
    muscleState,
    organState,
    updateEntry,
    resetLayer,
    resetAll,
    updateOrgan,
    getPainZones,
    getHealthScore,
    getMaxPain,
  }
}
