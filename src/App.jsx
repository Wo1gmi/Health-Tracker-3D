import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MousePointerClick } from 'lucide-react'
import BodyViewer   from './components/BodyViewer'
import LeftSidebar  from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import MusclePanel  from './components/MusclePanel'
import ProfilePage  from './components/ProfilePage'
import { useBodyState, LAYER_GROUPS } from './hooks/useBodyState'

const HEADER_H = 48

export default function App() {
  const {
    bodyState, muscleState, organState,
    updateEntry, resetLayer,
    getPainZones, getHealthScore,
  } = useBodyState()

  const [view,        setView]        = useState('main')
  const [activeLayer, setActiveLayer] = useState('muscles')
  const [selectedId,  setSelectedId]  = useState(null)
  const [previewPain, setPreviewPain] = useState(null)
  const [showBanner,  setShowBanner]  = useState(() => !localStorage.getItem('bh-seen'))

  const layerGroups   = LAYER_GROUPS[activeLayer]
  const selectedGroup = selectedId ? layerGroups[selectedId] : null

  const layerState = bodyState[activeLayer] ?? {}

  const effectiveLayerState = useMemo(() => {
    if (!previewPain) return layerState
    return {
      ...layerState,
      [previewPain.id]: { ...layerState[previewPain.id], pain: previewPain.pain },
    }
  }, [layerState, previewPain])

  const dismissBanner = () => { localStorage.setItem('bh-seen', '1'); setShowBanner(false) }

  const handleGroupClick = id => {
    if (showBanner) dismissBanner()
    setSelectedId(id)
    setPreviewPain(null)
  }
  const handleClose      = () => { setSelectedId(null); setPreviewPain(null) }
  const handleSave       = data => { updateEntry(activeLayer, selectedId, data); setPreviewPain(null) }

  const handleLayerChange = layer => {
    setActiveLayer(layer)
    setSelectedId(null)
    setPreviewPain(null)
  }

  return (
    <div className="app-root" style={{ '--header-h': `${HEADER_H}px` }}>

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

      {/* ── Sliding pages ── */}
      <div className="app-pages">
        <AnimatePresence initial={false}>

          {view === 'main' && (
            <motion.div
              key="main"
              className="app-grid"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            >
              <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
                background: 'radial-gradient(ellipse 70% 60% at 50% 35%, rgba(99,140,255,0.10) 0%, transparent 70%)',
              }} />

              {/* LEFT — layer switcher + pain zones + recommendations */}
              <div className="col-left" style={{ zIndex: 1 }}>
                <RightSidebar
                  activeLayer={activeLayer}
                  onLayerChange={handleLayerChange}
                  layerState={layerState}
                  muscleState={muscleState}
                  getPainZones={getPainZones}
                  resetLayer={() => resetLayer(activeLayer)}
                />
              </div>

              {/* CENTER — 3D viewer */}
              <div className="col-center" style={{ zIndex: 1 }}>
                <BodyViewer
                  activeLayer={activeLayer}
                  effectiveLayerState={effectiveLayerState}
                  onGroupClick={handleGroupClick}
                />

                <AnimatePresence>
                  {showBanner && (
                    <motion.div
                      key="banner"
                      className="welcome-banner"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      onClick={dismissBanner}
                      style={{
                        position: 'absolute', top: 14, left: 14,
                        maxWidth: 230, zIndex: 10,
                        background: 'rgba(255,255,255,0.93)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(59,130,246,0.18)',
                        borderRadius: 12,
                        boxShadow: '0 4px 20px rgba(30,80,200,0.10)',
                        padding: '12px 14px',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                        <MousePointerClick size={15} color="#3b82f6" />
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
                          Как пользоваться
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: 11.5, lineHeight: 1.6, color: '#475569' }}>
                        Кликай на любую часть тела на 3D-модели и указывай уровень боли.
                        Данные сохраняются и попадают в <b style={{ color: '#1e293b' }}>Медкарту</b> —
                        здесь можно отслеживать динамику и получать рекомендации.
                      </p>
                      <div style={{ marginTop: 8, fontSize: 10.5, color: '#94a3b8', textAlign: 'right' }}>
                        нажми на модель, чтобы скрыть
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* RIGHT — health score + profile + organs */}
              <div className="col-right" style={{ zIndex: 1 }}>
                <LeftSidebar
                  bodyState={bodyState}
                  muscleState={muscleState}
                  organState={organState}
                  getHealthScore={getHealthScore}
                  getPainZones={getPainZones}
                  onProfileClick={() => setView('profile')}
                />
              </div>

              {selectedGroup && (
                <MusclePanel
                  muscle={selectedGroup}
                  currentData={layerState[selectedId]}
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
              <ProfilePage bodyState={bodyState} onBack={() => setView('main')} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
