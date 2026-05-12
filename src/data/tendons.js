// Clinically relevant tendon sheath groups
export const TENDON_GROUPS = {

  // ── SHOULDER ──────────────────────────────────────────────────────────────
  shoulder_tendon: {
    id: 'shoulder_tendon', name: 'Межбугорковое влагалище плеча',
    nodeNames: ['Intertubercular_tendon_sheath', 'Intertubercular_tendon_sheath001'],
  },

  // ── WRIST FLEXORS ─────────────────────────────────────────────────────────
  flexor_wrist_L: {
    id: 'flexor_wrist_L', name: 'Влагалище сгибателей кисти (Л)',
    nodeNames: ['Common_flexor_tendon_sheath', 'Tendon_sheath_of_flexor_carpi_radialis'],
  },
  flexor_wrist_R: {
    id: 'flexor_wrist_R', name: 'Влагалище сгибателей кисти (П)',
    nodeNames: ['Common_flexor_tendon_sheath001', 'Tendon_sheath_of_flexor_carpi_radialis001'],
  },

  // ── WRIST EXTENSORS ───────────────────────────────────────────────────────
  extensor_wrist_L: {
    id: 'extensor_wrist_L', name: 'Влагалище разгибателей кисти (Л)',
    nodeNames: ['Tendon_sheath_of_extensors_carpi_radialis', 'Tendon_sheath_of_extensor_pollicis_longus'],
  },
  extensor_wrist_R: {
    id: 'extensor_wrist_R', name: 'Влагалище разгибателей кисти (П)',
    nodeNames: ['Tendon_sheath_of_extensors_carpi_radialis001', 'Tendon_sheath_of_extensor_pollicis_longus001'],
  },

  // ── EXTENSOR DIGITORUM (hand) ─────────────────────────────────────────────
  extensor_digit_L: {
    id: 'extensor_digit_L', name: 'Влагалище разгибателей пальцев (Л)',
    nodeNames: ['Tendon_sheath_of_extensor_digitorum_and_extensor_indicis', 'Tendon_sheath_of_extensor_digiti_minimi_manus'],
  },
  extensor_digit_R: {
    id: 'extensor_digit_R', name: 'Влагалище разгибателей пальцев (П)',
    nodeNames: ['Tendon_sheath_of_extensor_digitorum_and_extensor_indicis001', 'Tendon_sheath_of_extensor_digiti_minimi_manus001'],
  },

  // ── EXTENSOR CARPI ULNARIS ────────────────────────────────────────────────
  extensor_carpi_ulnaris_L: {
    id: 'extensor_carpi_ulnaris_L', name: 'Влагалище локтевого разгибателя (Л)',
    nodeNames: ['Tendon_sheath_of_extensor_carpi_ulnaris'],
  },
  extensor_carpi_ulnaris_R: {
    id: 'extensor_carpi_ulnaris_R', name: 'Влагалище локтевого разгибателя (П)',
    nodeNames: ['Tendon_sheath_of_extensor_carpi_ulnaris001'],
  },

  // ── DIGIT FLEXORS (hand) ──────────────────────────────────────────────────
  digit_flexor_sheath_L: {
    id: 'digit_flexor_sheath_L', name: 'Влагалища сгибателей пальцев (Л)',
    nodeNames: ['Synovial_sheaths_of_digits_of_hand'],
  },
  digit_flexor_sheath_R: {
    id: 'digit_flexor_sheath_R', name: 'Влагалища сгибателей пальцев (П)',
    nodeNames: ['Synovial_sheaths_of_digits_of_hand001'],
  },

  // ── ABDUCTOR POLLICIS (De Quervain's) ─────────────────────────────────────
  abductor_pollicis_L: {
    id: 'abductor_pollicis_L', name: 'Влагалище отводящих большой палец (Л)',
    // GLB: "Tendon sheath - abd" → sanitized "Tendon_sheath_-_abd"
    nodeNames: ['Tendon_sheath_-_abd'],
  },
  abductor_pollicis_R: {
    id: 'abductor_pollicis_R', name: 'Влагалище отводящих большой палец (П)',
    nodeNames: ['Tendon_sheath_-_abd001'],
  },

  // ── ANKLE ANTERIOR ────────────────────────────────────────────────────────
  ankle_anterior_L: {
    id: 'ankle_anterior_L', name: 'Влагалища разгибателей голени (Л)',
    nodeNames: ['Tendon_sheath_of_tibialis_anterior', 'Tendon_sheath_of_extensor_hallucis_longus', 'Tendon_sheath_of_extensor_digitorum_longus'],
  },
  ankle_anterior_R: {
    id: 'ankle_anterior_R', name: 'Влагалища разгибателей голени (П)',
    nodeNames: ['Tendon_sheath_of_tibialis_anterior001', 'Tendon_sheath_of_extensor_hallucis_longus001', 'Tendon_sheath_of_extensor_digitorum_longus001'],
  },

  // ── ANKLE POSTERIOR ───────────────────────────────────────────────────────
  ankle_posterior_L: {
    id: 'ankle_posterior_L', name: 'Влагалища сгибателей голени (Л)',
    nodeNames: ['Tendon_sheath_of_flexor_hallucis_longus', 'Tendon_sheath_of_flexor_digitorum_longus', 'Tendon_sheath_of_tibialis_posterior_muscle'],
  },
  ankle_posterior_R: {
    id: 'ankle_posterior_R', name: 'Влагалища сгибателей голени (П)',
    nodeNames: ['Tendon_sheath_of_flexor_hallucis_longus001', 'Tendon_sheath_of_flexor_digitorum_longus001', 'Tendon_sheath_of_tibialis_posterior_muscle001'],
  },

  // ── FIBULAR ───────────────────────────────────────────────────────────────
  fibular_tendon: {
    id: 'fibular_tendon', name: 'Влагалище малоберцовых мышц',
    nodeNames: ['Common_tendon_sheath_of_fibularis_muscles', 'Common_tendon_sheath_of_fibularis_muscles001'],
  },
}

export const NODE_TO_TENDON_GROUP = Object.fromEntries(
  Object.values(TENDON_GROUPS).flatMap(g =>
    g.nodeNames.map(name => [name, g.id])
  )
)
