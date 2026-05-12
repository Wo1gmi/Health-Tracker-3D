// Clinically relevant bursae groups
export const BURSAE_GROUPS = {

  // ── SHOULDER ──────────────────────────────────────────────────────────────
  subacromial_L: { id: 'subacromial_L', name: 'Субакромиальная сумка (Л)', nodeNames: ['Subacromial_bursa'] },
  subacromial_R: { id: 'subacromial_R', name: 'Субакромиальная сумка (П)', nodeNames: ['Subacromial_bursa001'] },
  subdeltoid_L:  { id: 'subdeltoid_L',  name: 'Субдельтовидная сумка (Л)', nodeNames: ['Subdeltoid_bursa'] },
  subdeltoid_R:  { id: 'subdeltoid_R',  name: 'Субдельтовидная сумка (П)', nodeNames: ['Subdeltoid_bursa001'] },
  coracobrachial_L: { id: 'coracobrachial_L', name: 'Клювовидно-плечевая сумка (Л)', nodeNames: ['Coracobrachial_bursa'] },
  coracobrachial_R: { id: 'coracobrachial_R', name: 'Клювовидно-плечевая сумка (П)', nodeNames: ['Coracobrachial_bursa001'] },
  infraspinatus_bursa_L: { id: 'infraspinatus_bursa_L', name: 'Сумка подостной мышцы (Л)', nodeNames: ['Subtendinous_bursa_of_infraspinatus_muscle'] },
  infraspinatus_bursa_R: { id: 'infraspinatus_bursa_R', name: 'Сумка подостной мышцы (П)', nodeNames: ['Subtendinous_bursa_of_infraspinatus_muscle001'] },

  // ── ELBOW ─────────────────────────────────────────────────────────────────
  bicipitoradial_L: { id: 'bicipitoradial_L', name: 'Двуглаво-лучевая сумка (Л)', nodeNames: ['Bicipitoradial_bursa'] },
  bicipitoradial_R: { id: 'bicipitoradial_R', name: 'Двуглаво-лучевая сумка (П)', nodeNames: ['Bicipitoradial_bursa001'] },
  triceps_bursa_L:  { id: 'triceps_bursa_L',  name: 'Сумка трицепса (Л)', nodeNames: ['Subtendinous_bursa_of_triceps_brachii_muscle'] },
  triceps_bursa_R:  { id: 'triceps_bursa_R',  name: 'Сумка трицепса (П)', nodeNames: ['Subtendinous_bursa_of_triceps_brachii_muscle001'] },

  // ── HIP ───────────────────────────────────────────────────────────────────
  trochanteric_L: {
    id: 'trochanteric_L', name: 'Вертельная сумка (Л)',
    nodeNames: ['Trochanteric_bursa_of_gluteus_maximus_muscle', 'Trochanteric_bursa_of_gluteus_medius_muscle'],
  },
  trochanteric_R: {
    id: 'trochanteric_R', name: 'Вертельная сумка (П)',
    nodeNames: ['Trochanteric_bursa_of_gluteus_maximus_muscle001', 'Trochanteric_bursa_of_gluteus_medius_muscle001'],
  },
  trochanteric_min_L: { id: 'trochanteric_min_L', name: 'Вертельная сумка мал. ягодичной (Л)', nodeNames: ['Trochanteric_bursa_of_gluteus_minimus_muscle'] },
  trochanteric_min_R: { id: 'trochanteric_min_R', name: 'Вертельная сумка мал. ягодичной (П)', nodeNames: ['Trochanteric_bursa_of_gluteus_minimus_muscle001'] },
  iliopectineal_L: {
    id: 'iliopectineal_L', name: 'Подвздошно-гребенчатая сумка (Л)',
    // GLB name: "(Iliopectineal bursa)" — parens removed by Three.js sanitize
    nodeNames: ['Iliopectineal_bursa'],
  },
  iliopectineal_R: { id: 'iliopectineal_R', name: 'Подвздошно-гребенчатая сумка (П)', nodeNames: ['Iliopectineal_bursa001'] },
  sciatic_gluteal_L: { id: 'sciatic_gluteal_L', name: 'Седалищная сумка ягодичной (Л)', nodeNames: ['Sciatic_bursa_of_gluteus_maximus_muscle'] },
  sciatic_gluteal_R: { id: 'sciatic_gluteal_R', name: 'Седалищная сумка ягодичной (П)', nodeNames: ['Sciatic_bursa_of_gluteus_maximus_muscle001'] },
  piriformis_bursa_L: { id: 'piriformis_bursa_L', name: 'Сумка грушевидной мышцы (Л)', nodeNames: ['Bursa_of_piriformis_muscle'] },
  piriformis_bursa_R: { id: 'piriformis_bursa_R', name: 'Сумка грушевидной мышцы (П)', nodeNames: ['Bursa_of_piriformis_muscle001'] },

  // ── KNEE ──────────────────────────────────────────────────────────────────
  suprapatellar_L:  { id: 'suprapatellar_L',  name: 'Надколенная сумка (Л)',         nodeNames: ['Suprapatellar_bursa'] },
  suprapatellar_R:  { id: 'suprapatellar_R',  name: 'Надколенная сумка (П)',         nodeNames: ['Suprapatellar_bursa001'] },
  prepatellar_L:    { id: 'prepatellar_L',    name: 'Преднадколенная сумка (Л)',     nodeNames: ['Subcutaneous_prepatellar_bursa'] },
  prepatellar_R:    { id: 'prepatellar_R',    name: 'Преднадколенная сумка (П)',     nodeNames: ['Subcutaneous_prepatellar_bursa001'] },
  infrapatellar_L:  { id: 'infrapatellar_L',  name: 'Поднадколенная сумка (Л)',     nodeNames: ['Deep_infrapatellar_bursa'] },
  infrapatellar_R:  { id: 'infrapatellar_R',  name: 'Поднадколенная сумка (П)',     nodeNames: ['Deep_infrapatellar_bursa001'] },
  anserine_L:       { id: 'anserine_L',       name: '"Гусиная лапка" (Л)',          nodeNames: ['Anserine_bursa'] },
  anserine_R:       { id: 'anserine_R',       name: '"Гусиная лапка" (П)',          nodeNames: ['Anserine_bursa001'] },
  semimembranosus_L: { id: 'semimembranosus_L', name: 'Сумка полуперепончатой (Л)', nodeNames: ['Semimembranosus_bursa'] },
  semimembranosus_R: { id: 'semimembranosus_R', name: 'Сумка полуперепончатой (П)', nodeNames: ['Semimembranosus_bursa001'] },
  gastrocnemius_med_L: { id: 'gastrocnemius_med_L', name: 'Сумка икроножной мышцы (Л)', nodeNames: ['Medial_subtendinous_bursa_of_gastrocnemius_muscle'] },
  gastrocnemius_med_R: { id: 'gastrocnemius_med_R', name: 'Сумка икроножной мышцы (П)', nodeNames: ['Medial_subtendinous_bursa_of_gastrocnemius_muscle001'] },

  // ── ANKLE / HEEL ──────────────────────────────────────────────────────────
  calcaneal_L: {
    id: 'calcaneal_L', name: 'Пяточная сумка (Л)',
    nodeNames: ['Subcutaneous_calcaneal_bursa', 'Subtendinous_calcaneal_bursa'],
  },
  calcaneal_R: {
    id: 'calcaneal_R', name: 'Пяточная сумка (П)',
    nodeNames: ['Subcutaneous_calcaneal_bursa001', 'Subtendinous_calcaneal_bursa001'],
  },
}

export const NODE_TO_BURSA_GROUP = Object.fromEntries(
  Object.values(BURSAE_GROUPS).flatMap(g =>
    g.nodeNames.map(name => [name, g.id])
  )
)
