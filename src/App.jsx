import { useState } from 'react'
import BodyViewer    from './components/BodyViewer'
import LeftSidebar  from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import MusclePanel  from './components/MusclePanel'
import { useBodyState } from './hooks/useBodyState'
import { MUSCLE_GROUPS } from './data/muscles'

export default function App() {
  const {
    muscleState, organState,
    updateMuscle,
    resetAll, getPainZones, getHealthScore,
  } = useBodyState()

  const [selectedId, setSelectedId] = useState(null)
  const selectedMuscle = selectedId ? MUSCLE_GROUPS[selectedId] : null

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '240px 1fr 240px',
      height: '100vh',
      background: '#f0f4ff',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Subtle gradient bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 35%, rgba(99,140,255,0.10) 0%, transparent 70%)',
      }} />

      {/* Header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 48, zIndex: 10,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(59,130,246,0.12)',
        boxShadow: '0 1px 12px rgba(30,80,200,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <span style={{ color: '#1e293b', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em' }}>
          ◈ BODY<span style={{ color: '#3b82f6' }}>HEALTH</span> 3D
        </span>
      </div>

      <div style={{ paddingTop: 48, zIndex: 1 }}>
        <LeftSidebar
          muscleState={muscleState}
          organState={organState}
          getHealthScore={getHealthScore}
          getPainZones={getPainZones}
        />
      </div>

      <div style={{ paddingTop: 48, zIndex: 1, position: 'relative' }}>
        <BodyViewer
          muscleState={muscleState}
          onMuscleClick={id => setSelectedId(id)}
        />
      </div>

      <div style={{ paddingTop: 48, zIndex: 1 }}>
        <RightSidebar
          muscleState={muscleState}
          getPainZones={getPainZones}
          resetAll={resetAll}
        />
      </div>

      {selectedMuscle && (
        <MusclePanel
          muscle={selectedMuscle}
          currentData={muscleState[selectedId]}
          onSave={data => updateMuscle(selectedId, data)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
