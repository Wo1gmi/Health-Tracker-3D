import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, ChevronDown, ChevronUp, Plus, Trash2, AlertCircle,
  Upload, FileText, Zap, Key, X, Eye, EyeOff, Edit2, Check, ArrowLeft,
  Heart, Bone, Brain, Wind, Utensils, Droplets, Shield, LayoutGrid, MapPin,
} from 'lucide-react'
import { LAYER_GROUPS } from '../hooks/useBodyState'

// ─── Constants ────────────────────────────────────────────────────────────────

const PROFILE_KEY  = 'bodyhealth-profile'
const SYSTEMS_KEY  = 'bodyhealth-systems'
const DOCS_KEY     = 'bodyhealth-docs'
const SETTINGS_KEY = 'bodyhealth-settings'

const BODY_SYSTEMS = [
  { id: 'cardiovascular',  name: 'Сердечно-сосудистая', color: '#ef4444', Icon: Heart },
  { id: 'endocrine',       name: 'Эндокринная',          color: '#f59e0b', Icon: Zap },
  { id: 'musculoskeletal', name: 'Опорно-двигательная',  color: '#3b82f6', Icon: Bone },
  { id: 'nervous',         name: 'Нервная',               color: '#8b5cf6', Icon: Brain },
  { id: 'respiratory',     name: 'Дыхательная',           color: '#06b6d4', Icon: Wind },
  { id: 'digestive',       name: 'Пищеварительная',       color: '#10b981', Icon: Utensils },
  { id: 'urogenital',      name: 'Мочеполовая',           color: '#6366f1', Icon: Droplets },
  { id: 'immune',          name: 'Иммунная',               color: '#f97316', Icon: Shield },
]

const DEFAULT_PROFILE  = { name: 'Пользователь', age: '', gender: '', updatedAt: null }
const DEFAULT_SETTINGS = { anthropicKey: '', openaiKey: '', selectedModel: 'anthropic' }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result.split(',')[1])
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

async function extractImageText(file, apiKey) {
  const base64 = await fileToBase64(file)
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-7',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } },
          { type: 'text',  text: 'Это медицинский документ. Извлеки весь текст дословно, сохрани структуру. Верни только текст без комментариев.' },
        ],
      }],
    }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.content[0].text
}

async function aiAnalyze(rawText, settings) {
  const prompt =
    'Это медицинский документ пациента. Выдели:\n' +
    '1. Основные показатели которые выходят за норму\n' +
    '2. На что обратить внимание\n' +
    '3. Рекомендации (только общие, не медицинские советы)\n' +
    'Отвечай на русском, кратко и структурированно.\n\n' +
    'Текст документа:\n' + rawText

  if (settings.selectedModel === 'anthropic') {
    if (!settings.anthropicKey) throw new Error('Anthropic API-ключ не указан в настройках.')
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.anthropicKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.content[0].text
  }

  if (settings.selectedModel === 'openai') {
    if (!settings.openaiKey) throw new Error('OpenAI API-ключ не указан в настройках.')
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
      }),
    })
    const data = await res.json()
    if (data.error) throw new Error(typeof data.error === 'string' ? data.error : data.error.message)
    return data.choices[0].message.content
  }

  throw new Error('Выберите модель в настройках.')
}

// ─── Compute auto-problems from bodyState ─────────────────────────────────────

function buildAutoProblems(bodyState) {
  if (!bodyState) return []
  return Object.entries(LAYER_GROUPS).flatMap(([layer, groups]) =>
    Object.entries(bodyState[layer] ?? {})
      .filter(([, v]) => v.pain > 0)
      .map(([id, data]) => ({
        id:    `3d-${layer}-${id}`,
        name:  groups[id]?.name ?? id,
        pain:  data.pain,
        layer,
        auto:  true,
      }))
  ).sort((a, b) => b.pain - a.pain)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const S = {
  card: {
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 2px 16px rgba(30,80,200,0.07)',
    border: '1px solid rgba(59,130,246,0.10)',
    marginBottom: 16,
  },
  label: { color: '#64748b', fontSize: 12, marginBottom: 4 },
  input: {
    width: '100%',
    background: 'rgba(59,130,246,0.04)',
    border: '1px solid rgba(59,130,246,0.18)',
    borderRadius: 8,
    color: '#1e293b',
    fontSize: 14,
    padding: '8px 12px',
    outline: 'none',
    fontFamily: 'inherit',
  },
}

function SectionTitle({ children }) {
  return (
    <div style={{ color: '#1e293b', fontSize: 16, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
      {children}
    </div>
  )
}

function Btn({ onClick, children, variant = 'primary', small, style: sx }) {
  const base = {
    border: 'none', borderRadius: 8, cursor: 'pointer',
    fontFamily: 'inherit', fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: small ? '5px 12px' : '9px 18px',
    fontSize: small ? 12 : 13,
    transition: 'opacity 0.15s',
    ...sx,
  }
  if (variant === 'primary')
    return <button onClick={onClick} style={{ ...base, background: 'linear-gradient(135deg,#2563eb,#3b82f6)', color: '#fff', boxShadow: '0 2px 8px rgba(59,130,246,0.25)' }}>{children}</button>
  if (variant === 'danger')
    return <button onClick={onClick} style={{ ...base, background: 'rgba(239,68,68,0.07)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.18)' }}>{children}</button>
  return <button onClick={onClick} style={{ ...base, background: 'rgba(59,130,246,0.07)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>{children}</button>
}

// ─── Profile Header ───────────────────────────────────────────────────────────

function ProfileHeader({ profile, onChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(profile)

  const commit = () => {
    onChange({ ...draft, updatedAt: new Date().toISOString() })
    setEditing(false)
  }

  return (
    <div style={{ ...S.card, padding: '24px 28px', display: 'flex', alignItems: 'flex-start', gap: 24 }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <User size={36} color="#fff" />
      </div>

      <div style={{ flex: 1 }}>
        {editing ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 140px', gap: 10, marginBottom: 12 }}>
            <div>
              <div style={S.label}>Имя</div>
              <input style={S.input} value={draft.name}   onChange={e => setDraft(p => ({ ...p, name:   e.target.value }))} />
            </div>
            <div>
              <div style={S.label}>Возраст</div>
              <input style={S.input} type="number" min={1} max={120} value={draft.age} onChange={e => setDraft(p => ({ ...p, age: e.target.value }))} />
            </div>
            <div>
              <div style={S.label}>Пол</div>
              <select style={{ ...S.input, paddingRight: 8 }} value={draft.gender} onChange={e => setDraft(p => ({ ...p, gender: e.target.value }))}>
                <option value="">Не указан</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </div>
          </div>
        ) : (
          <>
            <div style={{ color: '#1e293b', fontSize: 22, fontWeight: 700 }}>{profile.name}</div>
            <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
              {[
                profile.age    ? `${profile.age} лет` : null,
                profile.gender === 'male' ? 'Мужской' : profile.gender === 'female' ? 'Женский' : null,
              ].filter(Boolean).join(' · ') || 'Данные не заполнены'}
            </div>
            {profile.updatedAt && (
              <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }}>
                Обновлено: {fmtDate(profile.updatedAt)}
              </div>
            )}
          </>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: editing ? 0 : 12 }}>
          {editing ? (
            <>
              <Btn onClick={commit} small><Check size={13} /> Сохранить</Btn>
              <Btn onClick={() => setEditing(false)} variant="ghost" small>Отмена</Btn>
            </>
          ) : (
            <Btn onClick={() => { setDraft(profile); setEditing(true) }} variant="ghost" small>
              <Edit2 size={12} /> Редактировать
            </Btn>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Body Systems ─────────────────────────────────────────────────────────────

function ProblemItem({ problem, onDelete, onToggleUrgent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 0',
      borderBottom: '1px solid rgba(59,130,246,0.07)',
    }}>
      <button
        onClick={() => onToggleUrgent(problem.id)}
        title="Отметить как важное"
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
          color: problem.urgent ? '#ef4444' : '#cbd5e1',
          transition: 'color 0.15s',
        }}
      >
        <AlertCircle size={16} />
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ color: '#1e293b', fontSize: 13 }}>{problem.name}</div>
        <div style={{ color: '#94a3b8', fontSize: 11 }}>{fmtDate(problem.date)}</div>
      </div>
      <button onClick={() => onDelete(problem.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: 0 }}>
        <Trash2 size={14} />
      </button>
    </div>
  )
}

// Auto-problem row (read-only, from 3D tracker)
function AutoProblemItem({ problem }) {
  const painColor =
    problem.pain >= 8 ? '#ef4444' :
    problem.pain >= 5 ? '#f97316' :
    '#f59e0b'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '7px 0',
      borderBottom: '1px solid rgba(59,130,246,0.07)',
    }}>
      <MapPin size={14} color={painColor} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ color: '#1e293b', fontSize: 13 }}>{problem.name}</div>
        <div style={{ color: '#94a3b8', fontSize: 11 }}>3D-трекер · боль {problem.pain}/10</div>
      </div>
      <span style={{
        background: `${painColor}15`, color: painColor,
        borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 700,
        border: `1px solid ${painColor}30`,
        flexShrink: 0,
      }}>{problem.pain}</span>
    </div>
  )
}

function SystemCard({ system, problems = [], autoProblems = [], onAdd, onDelete, onToggleUrgent }) {
  const [open,    setOpen]    = useState(false)
  const [newName, setNewName] = useState('')

  const totalCount  = problems.length + autoProblems.length
  const urgentCount = problems.filter(p => p.urgent).length
  const severity    = Math.min(totalCount / 4, 1)

  const handleAdd = () => {
    const name = newName.trim()
    if (!name) return
    onAdd(system.id, { id: uid(), name, date: new Date().toISOString(), urgent: false })
    setNewName('')
  }

  const { Icon } = system

  return (
    <div style={{ ...S.card, marginBottom: 10, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
          fontFamily: 'inherit',
        }}
      >
        {/* Lucide icon instead of emoji */}
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: `${system.color}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={17} color={system.color} strokeWidth={1.8} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ color: '#1e293b', fontSize: 14, fontWeight: 600 }}>{system.name}</div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
            {totalCount === 0
              ? 'Нет проблем'
              : `${totalCount} ${totalCount === 1 ? 'проблема' : totalCount < 5 ? 'проблемы' : 'проблем'}${urgentCount > 0 ? ` · ${urgentCount} важных` : ''}`
            }
            {autoProblems.length > 0 && (
              <span style={{ color: '#3b82f6', marginLeft: 4 }}>· {autoProblems.length} из трекера</span>
            )}
          </div>
        </div>

        <div style={{ width: 64, flexShrink: 0 }}>
          <div style={{ height: 5, background: 'rgba(59,130,246,0.10)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${severity * 100}%`,
              background: system.color,
              borderRadius: 3,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {open ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 16px 14px' }}>

              {/* Auto-problems from 3D tracker */}
              {autoProblems.length > 0 && (
                <div style={{
                  marginBottom: problems.length > 0 ? 10 : 0,
                  padding: '8px 10px',
                  background: 'rgba(59,130,246,0.04)',
                  borderRadius: 8,
                  border: '1px solid rgba(59,130,246,0.10)',
                }}>
                  <div style={{ color: '#3b82f6', fontSize: 11, fontWeight: 600, marginBottom: 6 }}>
                    Из 3D-трекера
                  </div>
                  {autoProblems.map(p => <AutoProblemItem key={p.id} problem={p} />)}
                </div>
              )}

              {/* Manual problems */}
              {problems.length === 0 && autoProblems.length === 0 ? (
                <div style={{ color: '#94a3b8', fontSize: 12, padding: '8px 0', textAlign: 'center' }}>
                  Нет активных проблем
                </div>
              ) : (
                problems.map(p => (
                  <ProblemItem
                    key={p.id}
                    problem={p}
                    onDelete={id => onDelete(system.id, id)}
                    onToggleUrgent={id => onToggleUrgent(system.id, id)}
                  />
                ))
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  placeholder="Название проблемы / диагноза..."
                  style={{ ...S.input, flex: 1, fontSize: 12, padding: '7px 10px' }}
                />
                <Btn onClick={handleAdd} small><Plus size={13} /></Btn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Documents & AI ───────────────────────────────────────────────────────────

function DocumentCard({ doc, onDelete, onAnalyze, analyzing }) {
  const [showFull, setShowFull] = useState(false)

  return (
    <div style={{ ...S.card, padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <FileText size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#1e293b', fontSize: 14, fontWeight: 600, wordBreak: 'break-all' }}>{doc.filename}</div>
          <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 6 }}>{fmtDate(doc.date)}</div>

          <div style={{ color: '#64748b', fontSize: 12, lineHeight: 1.5 }}>
            {showFull ? doc.rawText : (doc.rawText?.slice(0, 160) ?? '')}
            {(doc.rawText?.length ?? 0) > 160 && (
              <button onClick={() => setShowFull(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: 11, marginLeft: 4, fontFamily: 'inherit' }}>
                {showFull ? 'свернуть' : '...ещё'}
              </button>
            )}
          </div>

          {doc.summary && (
            <div style={{
              marginTop: 10, padding: '10px 12px',
              background: 'rgba(59,130,246,0.04)',
              border: '1px solid rgba(59,130,246,0.14)',
              borderRadius: 8, fontSize: 12, color: '#1e293b', lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}>
              <div style={{ color: '#3b82f6', fontWeight: 600, marginBottom: 4 }}>AI-анализ</div>
              {doc.summary}
              <div style={{ marginTop: 8, padding: '6px 8px', background: 'rgba(245,158,11,0.08)', borderRadius: 6, color: '#92400e', fontSize: 11 }}>
                Анализ выполнен AI и не является медицинским заключением. Проконсультируйтесь с врачом.
              </div>
            </div>
          )}

          {doc.analyzeError && (
            <div style={{ marginTop: 8, color: '#ef4444', fontSize: 12 }}>Ошибка: {doc.analyzeError}</div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
          <Btn onClick={() => onAnalyze(doc.id)} small style={{ opacity: analyzing ? 0.6 : 1, pointerEvents: analyzing ? 'none' : 'auto' }}>
            <Zap size={12} /> {analyzing ? 'Анализ...' : 'Анализировать'}
          </Btn>
          <Btn onClick={() => onDelete(doc.id)} variant="danger" small>
            <Trash2 size={12} />
          </Btn>
        </div>
      </div>
    </div>
  )
}

// ─── Settings Panel ───────────────────────────────────────────────────────────

function SettingsPanel({ settings, onChange }) {
  const [show, setShow] = useState({ anthropic: false, openai: false })

  const field = (key, label, placeholder) => (
    <div style={{ marginBottom: 12 }}>
      <div style={S.label}>{label}</div>
      <div style={{ position: 'relative' }}>
        <input
          type={show[key] ? 'text' : 'password'}
          value={settings[key === 'anthropic' ? 'anthropicKey' : 'openaiKey']}
          onChange={e => onChange({ ...settings, [key === 'anthropic' ? 'anthropicKey' : 'openaiKey']: e.target.value })}
          placeholder={placeholder}
          style={{ ...S.input, paddingRight: 38 }}
        />
        <button
          onClick={() => setShow(s => ({ ...s, [key]: !s[key] }))}
          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
        >
          {show[key] ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ ...S.card, padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Key size={16} color="#64748b" />
        <span style={{ color: '#1e293b', fontSize: 15, fontWeight: 600 }}>API-ключи</span>
      </div>

      <div style={{ padding: '10px 12px', background: 'rgba(245,158,11,0.08)', borderRadius: 8, color: '#92400e', fontSize: 12, marginBottom: 16, lineHeight: 1.5 }}>
        Ключи сохраняются в localStorage вашего браузера. Не вводите ключи на чужих устройствах.
      </div>

      {field('anthropic', 'Anthropic (Claude)', 'sk-ant-...')}
      {field('openai',    'OpenAI (GPT-4o)',    'sk-...')}

      <div style={{ marginBottom: 12 }}>
        <div style={S.label}>Модель для анализа</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['anthropic', 'Claude (Anthropic)'], ['openai', 'GPT-4o (OpenAI)']].map(([val, lbl]) => (
            <button
              key={val}
              onClick={() => onChange({ ...settings, selectedModel: val })}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 12, fontWeight: settings.selectedModel === val ? 600 : 400,
                border: settings.selectedModel === val ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(59,130,246,0.15)',
                background: settings.selectedModel === val ? 'rgba(59,130,246,0.10)' : 'none',
                color: settings.selectedModel === val ? '#2563eb' : '#64748b',
              }}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main ProfilePage ─────────────────────────────────────────────────────────

export default function ProfilePage({ onBack, bodyState }) {
  const [profile,  setProfile]  = useState(() => load(PROFILE_KEY,  DEFAULT_PROFILE))
  const [systems,  setSystems]  = useState(() => load(SYSTEMS_KEY,  {}))
  const [docs,     setDocs]     = useState(() => load(DOCS_KEY,     []))
  const [settings, setSettings] = useState(() => load(SETTINGS_KEY, DEFAULT_SETTINGS))
  const [analyzing, setAnalyzing] = useState({})
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  useEffect(() => { save(PROFILE_KEY,  profile)  }, [profile])
  useEffect(() => { save(SYSTEMS_KEY,  systems)  }, [systems])
  useEffect(() => { save(DOCS_KEY,     docs)      }, [docs])
  useEffect(() => { save(SETTINGS_KEY, settings)  }, [settings])

  // All pain zones from 3D tracker → musculoskeletal system
  const autoProblems = buildAutoProblems(bodyState)

  // ── System handlers ──
  const addProblem = (sysId, problem) => {
    setSystems(prev => ({ ...prev, [sysId]: [...(prev[sysId] ?? []), problem] }))
  }
  const deleteProblem = (sysId, probId) => {
    setSystems(prev => ({ ...prev, [sysId]: (prev[sysId] ?? []).filter(p => p.id !== probId) }))
  }
  const toggleUrgent = (sysId, probId) => {
    setSystems(prev => ({
      ...prev,
      [sysId]: (prev[sysId] ?? []).map(p => p.id === probId ? { ...p, urgent: !p.urgent } : p),
    }))
  }

  // ── Document handlers ──
  const handleFileSelect = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    try {
      let rawText = ''
      if (file.type.startsWith('image/')) {
        if (!settings.anthropicKey) {
          alert('Для извлечения текста из изображений укажите Anthropic API-ключ в настройках.')
          setUploading(false)
          return
        }
        rawText = await extractImageText(file, settings.anthropicKey)
      } else {
        alert('Поддерживаются: JPG, PNG')
        setUploading(false)
        return
      }
      setDocs(prev => [{ id: uid(), filename: file.name, date: new Date().toISOString(), rawText, summary: null, analyzeError: null, type: 'image' }, ...prev])
    } catch (err) {
      alert(`Ошибка извлечения текста: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const deleteDoc = id => setDocs(prev => prev.filter(d => d.id !== id))

  const analyzeDoc = async id => {
    const doc = docs.find(d => d.id === id)
    if (!doc) return
    setAnalyzing(prev => ({ ...prev, [id]: true }))
    try {
      const summary = await aiAnalyze(doc.rawText, settings)
      setDocs(prev => prev.map(d => d.id === id ? { ...d, summary, analyzeError: null } : d))
    } catch (err) {
      setDocs(prev => prev.map(d => d.id === id ? { ...d, analyzeError: err.message } : d))
    } finally {
      setAnalyzing(prev => ({ ...prev, [id]: false }))
    }
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '20px 20px 60px' }}>

      {onBack && (
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', fontSize: 13, fontFamily: 'inherit',
            marginBottom: 20, padding: 0,
          }}
        >
          <ArrowLeft size={15} /> Назад к трекеру
        </button>
      )}

      {/* ── Profile Header ── */}
      <SectionTitle><User size={18} /> Личная карта</SectionTitle>
      <ProfileHeader profile={profile} onChange={setProfile} />

      {/* ── Body Systems ── */}
      <SectionTitle style={{ marginTop: 28 }}>
        <LayoutGrid size={18} color="#3b82f6" /> Системы организма
      </SectionTitle>
      {BODY_SYSTEMS.map(sys => (
        <SystemCard
          key={sys.id}
          system={sys}
          problems={systems[sys.id] ?? []}
          autoProblems={sys.id === 'musculoskeletal' ? autoProblems : []}
          onAdd={addProblem}
          onDelete={deleteProblem}
          onToggleUrgent={toggleUrgent}
        />
      ))}

      {/* ── Documents ── */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <SectionTitle style={{ margin: 0 }}><FileText size={18} /> Мои документы</SectionTitle>
          <Btn onClick={() => fileRef.current?.click()} style={{ opacity: uploading ? 0.6 : 1, pointerEvents: uploading ? 'none' : 'auto' }}>
            <Upload size={14} /> {uploading ? 'Загрузка...' : 'Прикрепить'}
          </Btn>
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" style={{ display: 'none' }} onChange={handleFileSelect} />
        </div>

        {docs.length === 0 ? (
          <div style={{ ...S.card, padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            Нет загруженных документов.<br />
            Прикрепите фото анализа (JPG/PNG) — текст будет извлечён автоматически.
          </div>
        ) : (
          docs.map(doc => (
            <DocumentCard key={doc.id} doc={doc} onDelete={deleteDoc} onAnalyze={analyzeDoc} analyzing={!!analyzing[doc.id]} />
          ))
        )}
      </div>

      {/* ── Settings ── */}
      <div style={{ marginTop: 28 }}>
        <SectionTitle><Key size={18} /> Настройки</SectionTitle>
        <SettingsPanel settings={settings} onChange={setSettings} />
      </div>

    </div>
  )
}
