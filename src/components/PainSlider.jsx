import { useRef } from 'react'
import { painToLabel } from '../utils/painColor'

function valueToColor(v) {
  if (v === 0) return '#1d4ed8'
  if (v <= 3)  return '#3b82f6'
  if (v <= 6)  return '#f59e0b'
  if (v <= 8)  return '#ef4444'
  return '#dc2626'
}

export default function PainSlider({ value, onChange }) {
  const color = valueToColor(value)
  const pct   = (value / 10) * 100

  const trackStyle = {
    background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, rgba(59,130,246,0.12) ${pct}%, rgba(59,130,246,0.12) 100%)`,
  }

  const thumbStyle = {
    '--thumb-color': color,
    '--thumb-shadow': `0 0 10px ${color}88, 0 0 20px ${color}44`,
  }

  return (
    <div className="w-full select-none">
      <style>{`
        .pain-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }
        .pain-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--thumb-color);
          box-shadow: var(--thumb-shadow);
          cursor: pointer;
          transition: transform 0.1s ease, box-shadow 0.2s ease;
        }
        .pain-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .pain-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--thumb-color);
          box-shadow: var(--thumb-shadow);
          cursor: pointer;
          border: none;
        }
      `}</style>

      <div className="flex items-center justify-between mb-2">
        <span style={{ color: '#64748b', fontSize: 13 }}>Уровень боли</span>
        <span style={{ color, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
          {value}
          <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>/ 10</span>
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="pain-slider"
        style={{ ...trackStyle, ...thumbStyle }}
      />

      <div className="flex justify-between mt-1" style={{ fontSize: 10, color: '#94a3b8' }}>
        <span>0</span>
        <span style={{ color, fontSize: 12, fontWeight: 600 }}>{painToLabel(value)}</span>
        <span>10</span>
      </div>
    </div>
  )
}
