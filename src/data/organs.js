export const ORGANS = [
  { id: 'heart',    name: 'Сердце',       icon: '♥', status: 'ok',  note: '' },
  { id: 'lungs',    name: 'Лёгкие',       icon: '🫁', status: 'ok',  note: '' },
  { id: 'liver',    name: 'Печень',        icon: '🫀', status: 'ok',  note: '' },
  { id: 'kidneys',  name: 'Почки',         icon: '⚙', status: 'ok',  note: '' },
  { id: 'stomach',  name: 'Желудок',       icon: '◉', status: 'ok',  note: '' },
  { id: 'spine',    name: 'Позвоночник',   icon: '〓', status: 'ok',  note: '' },
]

export const STATUS_LABELS = {
  ok:      { label: 'Норма',      color: '#22c55e' },
  caution: { label: 'Внимание',   color: '#f59e0b' },
  alert:   { label: 'Проблема',   color: '#ef4444' },
}
