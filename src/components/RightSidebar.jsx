import { RotateCcw, Zap, Activity, Bone, Link2, Droplets } from 'lucide-react'
import { LAYER_GROUPS }       from '../hooks/useBodyState'
import { painToBadgeColor, painToLabel } from '../utils/painColor'
import { getGlobalTips }      from '../utils/recommendations'

const T = { main: '#1e293b', dim: '#64748b', sub: '#94a3b8' }

const LAYER_CONFIG = [
  { id: 'muscles',  label: 'Мышцы',     Icon: Activity, color: '#3b82f6' },
  { id: 'skeleton', label: 'Скелет',    Icon: Bone,     color: '#94a3b8' },
  { id: 'tendons',  label: 'Сухожилия', Icon: Link2,    color: '#0d9488' },
  { id: 'bursae',   label: 'Сумки',     Icon: Droplets, color: '#16a34a' },
]

export default function RightSidebar({
  activeLayer, onLayerChange,
  layerState, muscleState,
  getPainZones, resetLayer,
}) {
  const zones = getPainZones(activeLayer)
  const tips  = getGlobalTips(muscleState)
  const groups = LAYER_GROUPS[activeLayer]
  const { color: activeColor } = LAYER_CONFIG.find(l => l.id === activeLayer)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 12px', overflowY: 'auto', height: '100%' }}>

      {/* ── Layer switcher ── */}
      <div className="glass" style={{ padding: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5 }}>
          {LAYER_CONFIG.map(({ id, label, Icon, color }) => {
            const isActive = id === activeLayer
            return (
              <button
                key={id}
                onClick={() => onLayerChange(id)}
                style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 4, padding: '9px 4px',
                  background: isActive ? `${color}15` : 'transparent',
                  border: `1.5px solid ${isActive ? color : 'rgba(0,0,0,0.07)'}`,
                  borderRadius: 10,
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                <Icon size={17} color={isActive ? color : T.sub} strokeWidth={isActive ? 2.2 : 1.8} />
                <span style={{
                  fontSize: 9, fontWeight: isActive ? 700 : 500,
                  color: isActive ? color : T.sub,
                  letterSpacing: '0.01em',
                }}>{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Active pain zones ── */}
      <div className="glass" style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ color: T.main, fontSize: 13, fontWeight: 600 }}>
            Отмеченные зоны
            {zones.length > 0 && (
              <span style={{
                marginLeft: 8,
                background: `${activeColor}18`,
                color: activeColor,
                borderRadius: 10, padding: '1px 7px', fontSize: 11,
              }}>{zones.length}</span>
            )}
          </span>
          {zones.length > 0 && (
            <button onClick={resetLayer} title="Сбросить слой" style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: T.sub, display: 'flex', alignItems: 'center', padding: 2,
            }}>
              <RotateCcw size={13} />
            </button>
          )}
        </div>

        {zones.length === 0 ? (
          <p style={{ color: T.sub, fontSize: 12, textAlign: 'center', padding: '10px 0', margin: 0 }}>
            Кликни на зону в 3D-модели, чтобы отметить боль
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {zones.map(([id, data]) => {
              const group = groups[id]
              if (!group) return null
              const c = painToBadgeColor(data.pain)
              return (
                <div key={id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: `${c}08`,
                  border: `1px solid ${c}22`,
                  borderRadius: 8, padding: '7px 10px',
                }}>
                  <div>
                    <div style={{ color: T.main, fontSize: 12, fontWeight: 500 }}>{group.name}</div>
                    <div style={{ color: T.sub, fontSize: 10 }}>{painToLabel(data.pain)}</div>
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

      {/* ── Tips ── */}
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

      {/* ── Stats for active layer ── */}
      <div className="glass" style={{ padding: 14 }}>
        <div style={{ color: T.main, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Статистика слоя</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Зон с болью',    value: zones.length },
            { label: 'Макс. уровень',  value: zones[0]?.[1]?.pain ?? 0 },
            { label: 'Всего отмечено', value: Object.keys(layerState).length },
            { label: 'Без боли',       value: Object.values(layerState).filter(m => m.pain === 0).length },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: `${activeColor}08`,
              border: `1px solid ${activeColor}20`,
              borderRadius: 8, padding: '8px 10px', textAlign: 'center',
            }}>
              <div style={{ color: activeColor, fontSize: 20, fontWeight: 700 }}>{value}</div>
              <div style={{ color: T.sub, fontSize: 10, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
