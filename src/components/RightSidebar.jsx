import { RotateCcw, Zap } from 'lucide-react'
import { MUSCLE_GROUPS } from '../data/muscles'
import { painToBadgeColor, painToLabel } from '../utils/painColor'
import { getGlobalTips } from '../utils/recommendations'

const T = { main: '#1e293b', dim: '#64748b', sub: '#94a3b8' }

export default function RightSidebar({ muscleState, getPainZones, resetAll }) {
  const zones = getPainZones()
  const tips  = getGlobalTips(muscleState)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 12px', overflowY: 'auto', height: '100%' }}>

      {/* Active pain zones */}
      <div className="glass" style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ color: T.main, fontSize: 13, fontWeight: 600 }}>
            Отмеченные зоны
            {zones.length > 0 && (
              <span style={{
                marginLeft: 8, background: 'rgba(59,130,246,0.1)',
                color: '#3b82f6', borderRadius: 10, padding: '1px 7px', fontSize: 11,
              }}>{zones.length}</span>
            )}
          </span>
          {zones.length > 0 && (
            <button onClick={resetAll} title="Сбросить всё" style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: T.sub, display: 'flex', alignItems: 'center', padding: 2,
            }}>
              <RotateCcw size={13} />
            </button>
          )}
        </div>

        {zones.length === 0 ? (
          <p style={{ color: T.sub, fontSize: 12, textAlign: 'center', padding: '10px 0', margin: 0 }}>
            Кликни на мышцу в 3D-модели, чтобы отметить боль
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {zones.map(([id, data]) => {
              const muscle = MUSCLE_GROUPS[id]
              if (!muscle) return null
              const c = painToBadgeColor(data.pain)
              return (
                <div key={id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: `${c}08`,
                  border: `1px solid ${c}22`,
                  borderRadius: 8, padding: '7px 10px',
                }}>
                  <div>
                    <div style={{ color: T.main, fontSize: 12, fontWeight: 500 }}>{muscle.name}</div>
                    <div style={{ color: T.sub,  fontSize: 10 }}>{painToLabel(data.pain)}</div>
                  </div>
                  <div style={{
                    background: `${c}18`, color: c,
                    borderRadius: 6, padding: '2px 10px',
                    fontSize: 14, fontWeight: 700,
                    border: `1px solid ${c}33`,
                  }}>{data.pain}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="glass" style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Zap size={14} color="#d97706" />
          <span style={{ color: T.main, fontSize: 13, fontWeight: 600 }}>Рекомендации</span>
        </div>
        {tips.map((tip, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, color: T.dim, fontSize: 12, lineHeight: 1.5 }}>
            <span style={{ color: '#d97706', marginTop: 1 }}>›</span>
            {tip}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="glass" style={{ padding: 14 }}>
        <div style={{ color: T.main, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Статистика</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Зон с болью',    value: zones.length },
            { label: 'Макс. уровень',  value: zones[0]?.[1]?.pain ?? 0 },
            { label: 'Всего отмечено', value: Object.keys(muscleState).length },
            { label: 'Без боли',       value: Object.values(muscleState).filter(m => m.pain === 0).length },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'rgba(59,130,246,0.05)',
              border: '1px solid rgba(59,130,246,0.12)',
              borderRadius: 8, padding: '8px 10px', textAlign: 'center',
            }}>
              <div style={{ color: '#3b82f6', fontSize: 20, fontWeight: 700 }}>{value}</div>
              <div style={{ color: T.sub, fontSize: 10, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
