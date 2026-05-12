import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'bodyhealth-state'
const ORGANS_KEY  = 'bodyhealth-organs'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function useBodyState() {
  const [muscleState, setMuscleState] = useState(() => load(STORAGE_KEY, {}))
  const [organState,  setOrganState]  = useState(() => load(ORGANS_KEY,  {}))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(muscleState))
  }, [muscleState])

  useEffect(() => {
    localStorage.setItem(ORGANS_KEY, JSON.stringify(organState))
  }, [organState])

  const updateMuscle = useCallback((id, data) => {
    setMuscleState(prev => ({
      ...prev,
      [id]: { pain: 0, notes: '', ...prev[id], ...data, updatedAt: new Date().toISOString() },
    }))
  }, [])

  const resetAll = useCallback(() => {
    setMuscleState({})
  }, [])

  const updateOrgan = useCallback((id, data) => {
    setOrganState(prev => ({ ...prev, [id]: { ...prev[id], ...data } }))
  }, [])

  const getPainZones = useCallback(() => {
    return Object.entries(muscleState)
      .filter(([, v]) => v.pain > 0)
      .sort(([, a], [, b]) => b.pain - a.pain)
  }, [muscleState])

  const getMaxPain = useCallback(() => {
    const vals = Object.values(muscleState).map(m => m.pain ?? 0)
    return vals.length ? Math.max(...vals) : 0
  }, [muscleState])

  const getHealthScore = useCallback(() => {
    const zones = Object.values(muscleState)
    if (!zones.length) return 100
    const totalPain = zones.reduce((acc, m) => acc + (m.pain ?? 0), 0)
    const maxPossible = zones.length * 10
    const raw = 100 - (totalPain / maxPossible) * 100
    return Math.max(0, Math.round(raw))
  }, [muscleState])

  return {
    muscleState, organState,
    updateMuscle, updateOrgan,
    resetAll, getPainZones, getMaxPain, getHealthScore,
  }
}
