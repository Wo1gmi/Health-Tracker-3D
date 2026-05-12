import { Activity, User, TrendingDown, ChevronRight } from 'lucide-react'
import { ORGANS, STATUS_LABELS } from '../data/organs'
import { MUSCLE_GROUPS } from '../data/muscles'
import { painToBadgeColor } from '../utils/painColor'

const T = { main: '#1e293b', dim: '#64748b', sub: '#94a3b8' }

export default function LeftSidebar({ muscleState, organState, getHealthScore, getPainZones, onProfileClick }) {
  const score = getHealthScore()
  const top3  = getPainZones().slice(0, 3)
  const scoreColor = score >= 75 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 12px', overflowY: 'auto', height: '100%' }}>

      {/* Profile card — clickable, leads to profile page */}
      <button
        onClick={onProfileClick}
        style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(59,130,246,0.14)',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(30,80,200,0.06)',
          padding: 16,
          fontFamily: 'inherit',
          transition: 'box-shadow 0.15s, border-color 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.15)'
          e.currentTarget.style.borderColor = 'rgba(59,130,246,0.30)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = '0 2px 12px rgba(30,80,200,0.06)'
          e.currentTarget.style.borderColor = 'rgba(59,130,246,0.14)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={18} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: T.main, fontSize: 14, fontWeight: 600 }}>Мой профиль</div>
            <div style={{ color: T.dim,  fontSize: 11 }}>Мед. карта и документы</div>
          </div>
          <ChevronRight size={15} color={T.sub} />
        </div>

        {/* Health score ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
            <svg width={60} height={60} viewBox="0 0 60 60">
              <circle cx={30} cy={30} r={24} fill="none" stroke="rgba(59,130,246,0.12)" strokeWidth={5} />
              <circle
                cx={30} cy={30} r={24} fill="none"
                stroke={scoreColor} strokeWidth={5} strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 150.8} 150.8`}
                transform="rotate(-90 30 30)"
                style={{ transition: 'stroke-dasharray 0.6s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: scoreColor, fontSize: 15, fontWeight: 700,
            }}>{score}</div>
          </div>
          <div>
            <div style={{ color: T.main, fontSize: 13, fontWeight: 600 }}>Индекс здоровья</div>
            <div style={{ color: scoreColor, fontSize: 11, marginTop: 2 }}>
              {score >= 75 ? 'Хорошее состояние' : score >= 50 ? 'Умеренный дискомфорт' : 'Требует внимания'}
            </div>
          </div>
        </div>
      </button>

      {/* Top pain zones */}
      {top3.length > 0 && (
        <div className="glass" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <TrendingDown size={14} color="#dc2626" />
            <span style={{ color: T.main, fontSize: 13, fontWeight: 600 }}>Топ болевых зон</span>
          </div>
          {top3.map(([id, data]) => {
            const muscle = MUSCLE_GROUPS[id]
            if (!muscle) return null
            const c = painToBadgeColor(data.pain)
            return (
              <div key={id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 0', borderBottom: '1px solid rgba(59,130,246,0.08)',
              }}>
                <span style={{ color: T.dim, fontSize: 12 }}>{muscle.name}</span>
                <span style={{
                  background: `${c}18`, color: c,
                  borderRadius: 6, padding: '1px 8px', fontSize: 12, fontWeight: 700,
                  border: `1px solid ${c}33`,
                }}>{data.pain}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Organ status */}
      <div className="glass" style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Activity size={14} color="#3b82f6" />
          <span style={{ color: T.main, fontSize: 13, fontWeight: 600 }}>Органы</span>
        </div>
        {ORGANS.map(organ => {
          const state  = organState[organ.id] ?? organ
          const status = STATUS_LABELS[state.status ?? 'ok']
          return (
            <div key={organ.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '5px 0',
            }}>
              <span style={{ color: T.dim, fontSize: 12 }}>{organ.name}</span>
              <span style={{ color: status.color, fontSize: 11, fontWeight: 500 }}>{status.label}</span>
            </div>
          )
        })}
      </div>

    </div>
  )
}
