import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Lightbulb } from 'lucide-react'
import PainSlider from './PainSlider'
import { getRecommendations } from '../utils/recommendations'

const T = { main: '#1e293b', dim: '#64748b', sub: '#94a3b8' }

export default function MusclePanel({ muscle, currentData, onSave, onClose, onPreviewChange }) {
  const [pain,     setPain]     = useState(currentData?.pain  ?? 0)
  const [notes,    setNotes]    = useState(currentData?.notes ?? '')
  const [showTips, setShowTips] = useState(false)

  useEffect(() => {
    const p = currentData?.pain ?? 0
    setPain(p)
    setNotes(currentData?.notes ?? '')
    if (onPreviewChange) onPreviewChange(p)
  }, [muscle?.id])

  if (!muscle) return null

  const handlePainChange = val => {
    setPain(val)
    if (onPreviewChange) onPreviewChange(val)
  }

  const tips = getRecommendations(muscle.id)

  return (
    <AnimatePresence>
      <motion.div
        key={muscle.id}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(480px, calc(100vw - 48px))',
          zIndex: 50,
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(59,130,246,0.18)',
          borderRadius: 16,
          padding: '20px 24px',
          boxShadow: '0 8px 40px rgba(30,80,200,0.12), 0 2px 8px rgba(30,80,200,0.06)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <h3 style={{ color: T.main, fontSize: 18, fontWeight: 700, margin: 0 }}>{muscle.name}</h3>
          <button onClick={onClose} style={{
            background: 'rgba(59,130,246,0.07)',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: 8, color: T.sub, cursor: 'pointer',
            padding: '4px 8px', display: 'flex', alignItems: 'center',
          }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <PainSlider value={pain} onChange={handlePainChange} />
        </div>

        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Заметки (когда началось, что помогает...)"
          rows={2}
          style={{
            width: '100%',
            background: 'rgba(59,130,246,0.04)',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: 8, color: T.main, fontSize: 13,
            padding: '8px 12px', resize: 'none', outline: 'none',
            fontFamily: 'inherit', marginBottom: 12,
          }}
        />

        <button onClick={() => setShowTips(v => !v)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', color: '#d97706',
          cursor: 'pointer', fontSize: 12, padding: '0 0 10px',
          fontFamily: 'inherit',
        }}>
          <Lightbulb size={14} />
          {showTips ? 'Скрыть советы' : 'Показать советы'}
        </button>

        <AnimatePresence>
          {showTips && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                margin: '0 0 12px', padding: '0 0 0 16px',
                listStyle: 'disc', color: T.dim, fontSize: 12,
                lineHeight: 1.6, overflow: 'hidden',
              }}
            >
              {tips.map((tip, i) => (
                <li key={i} style={{ marginBottom: 2 }}>{tip}</li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { onSave({ pain, notes }); onClose() }}
            style={{
              flex: 1, background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              border: 'none', borderRadius: 10, color: '#fff',
              fontSize: 14, fontWeight: 600, padding: '10px 0',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: '0 2px 12px rgba(59,130,246,0.3)',
            }}
          >
            <Save size={15} />
            Сохранить
          </button>
          <button onClick={onClose} style={{
            background: 'rgba(59,130,246,0.06)',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: 10, color: T.dim,
            fontSize: 14, padding: '10px 18px',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Отмена
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
