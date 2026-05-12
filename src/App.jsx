import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BodyViewer   from './components/BodyViewer'
import LeftSidebar  from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import MusclePanel  from './components/MusclePanel'
import ProfilePage  from './components/ProfilePage'
import { useBodyState } from './hooks/useBodyState'
import { MUSCLE_GROUPS } from './data/muscles'

const HEADER_H = 48

export default function App() {
  const {
    muscleState, organState,
    updateMuscle,
    resetAll, getPainZones, getHealthScore,
  } = useBodyState()

  const [view,        setView]        = useState('main')
  const [selectedId,  setSelectedId]  = useState(null)
  const [previewPain, setPreviewPain] = useState(null)

  const selectedMuscle = selectedId ? MUSCLE_GROUPS[selectedId] : null

  const effectiveMuscleState = useMemo(() => {
    if (!previewPain) return muscleState
    return {
      ...muscleState,
      [previewPain.id]: { ...muscleState[previewPain.id], pain: previewPain.pain },
    }
  }, [muscleState, previewPain])

  const handleMuscleClick = id => { setSelectedId(id); setPreviewPain(null) }
  const handleClose       = () => { setSelectedId(null); setPreviewPain(null) }
  const handleSave        = data => { updateMuscle(selectedId, data); setPreviewPain(null) }

  return (
    <div style={{ height: '100vh', background: '#f0f4ff', overflow: 'hidden', position: 'relative' }}>

      {/* ── Fixed header ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: HEADER_H, zIndex: 20,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(59,130,246,0.12)',
        boxShadow: '0 1px 12px rgba(30,80,200,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ color: '#1e293b', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em' }}>
          ◈ BODY<span style={{ color: '#3b82f6' }}>HEALTH</span> 3D
        </span>
      </div>

      {/* ── Sliding pages (start below header) ── */}
      <div style={{ position: 'absolute', inset: 0, top: HEADER_H, overflow: 'hidden' }}>
        <AnimatePresence initial={false}>

          {view === 'main' && (
            <motion.div
              key="main"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              style={{
                position: 'absolute', inset: 0,
                display: 'grid',
                gridTemplateColumns: '240px 1fr 240px',
              }}
            >
              <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                background: 'radial-gradient(ellipse 70% 60% at 50% 35%, rgba(99,140,255,0.10) 0%, transparent 70%)',
              }} />

              {/* LEFT — pain zones + recommendations */}
              <div style={{ zIndex: 1, overflowY: 'auto', height: '100%' }}>
                <RightSidebar
                  muscleState={muscleState}
                  getPainZones={getPainZones}
                  resetAll={resetAll}
                />
              </div>

              {/* CENTER — 3D viewer */}
              <div style={{ zIndex: 1, position: 'relative', height: '100%' }}>
                <BodyViewer
                  muscleState={effectiveMuscleState}
                  onMuscleClick={handleMuscleClick}
                />
              </div>

              {/* RIGHT — health score + profile (clickable) + organs */}
              <div style={{ zIndex: 1, overflowY: 'auto', height: '100%' }}>
                <LeftSidebar
                  muscleState={muscleState}
                  organState={organState}
                  getHealthScore={getHealthScore}
                  getPainZones={getPainZones}
                  onProfileClick={() => setView('profile')}
                />
              </div>

              {selectedMuscle && (
                <MusclePanel
                  muscle={selectedMuscle}
                  currentData={muscleState[selectedId]}
                  onSave={handleSave}
                  onClose={handleClose}
                  onPreviewChange={pain => setPreviewPain({ id: selectedId, pain })}
                />
              )}
            </motion.div>
          )}

          {view === 'profile' && (
            <motion.div
              key="profile"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              style={{
                position: 'absolute', inset: 0,
                overflowY: 'auto',
                background: '#f0f4ff',
              }}
            >
              <ProfilePage onBack={() => setView('main')} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
