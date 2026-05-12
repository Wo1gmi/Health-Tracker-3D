// Clinically relevant bone groups
// Node names are Three.js GLTFLoader-sanitized:
//   spaces → underscores, non-word chars (dots, parens) removed.
export const SKELETON_GROUPS = {

  // ── SPINE ──────────────────────────────────────────────────────────────────
  cervical_spine: {
    id: 'cervical_spine', name: 'Шейный отдел позвоночника',
    nodeNames: ['Atlas_C1', 'Axis_C2', 'Vertebra_C3', 'Vertebra_C4', 'Vertebra_C5', 'Vertebra_C6', 'Vertebra_C7'],
  },
  thoracic_spine: {
    id: 'thoracic_spine', name: 'Грудной отдел позвоночника',
    nodeNames: ['Vertebra_T1', 'Vertebra_T2', 'Vertebra_T3', 'Vertebra_T4', 'Vertebra_T5', 'Vertebra_T6', 'Vertebra_T7', 'Vertebra_T8', 'Vertebra_T9', 'Vertebra_T10', 'Vertebra_T11', 'Vertebra_T12'],
  },
  lumbar_spine: {
    id: 'lumbar_spine', name: 'Поясничный отдел позвоночника',
    nodeNames: ['Vertebra_L1', 'Vertebra_L2', 'Vertebra_L3', 'Vertebra_L4', 'Vertebra_L5'],
  },
  sacrum: { id: 'sacrum', name: 'Крестец', nodeNames: ['Sacrum'] },
  coccyx: { id: 'coccyx', name: 'Копчик',  nodeNames: ['Coccyx'] },

  // ── SKULL / JAW ────────────────────────────────────────────────────────────
  skull: {
    id: 'skull', name: 'Кости черепа',
    nodeNames: ['Frontal_bone', 'Parietal_bone', 'Parietal_bone001', 'Occipital_bone', 'Temporal_bone', 'Temporal_bone001'],
  },
  mandible: { id: 'mandible', name: 'Нижняя челюсть', nodeNames: ['Mandible'] },
  hyoid:    { id: 'hyoid',    name: 'Подъязычная кость', nodeNames: ['Hyoid_bone'] },

  // ── CHEST ─────────────────────────────────────────────────────────────────
  sternum: {
    id: 'sternum', name: 'Грудина',
    nodeNames: ['Manubrium_of_sternum', 'Body_of_sternum', 'Xiphoid_process'],
  },
  ribs_L: {
    id: 'ribs_L', name: 'Рёбра (Л)',
    nodeNames: ['First_rib', 'Second_rib001', 'Third_rib', 'Fourth_rib', 'Fifth_rib', 'Sixth_rib', 'Seventh_rib', 'Eighth_rib', 'Ninth_rib', 'Tenth_rib', 'Eleventh_rib', 'Twelfth_rib'],
  },
  ribs_R: {
    id: 'ribs_R', name: 'Рёбра (П)',
    nodeNames: ['First_rib001', 'Second_rib', 'Third_rib001', 'Fourth_rib001', 'Fifth_rib001', 'Sixth_rib001', 'Seventh_rib001', 'Eighth_rib001', 'Ninth_rib001', 'Tenth_rib001', 'Eleventh_rib001', 'Twelfth_rib001'],
  },

  // ── SHOULDER GIRDLE ───────────────────────────────────────────────────────
  clavicle_L: { id: 'clavicle_L', name: 'Ключица (Л)', nodeNames: ['Clavicle'] },
  clavicle_R: { id: 'clavicle_R', name: 'Ключица (П)', nodeNames: ['Clavicle001'] },
  scapula_L:  { id: 'scapula_L',  name: 'Лопатка (Л)', nodeNames: ['Scapula002'] },
  scapula_R:  { id: 'scapula_R',  name: 'Лопатка (П)', nodeNames: ['Scapula003'] },

  // ── UPPER ARM ─────────────────────────────────────────────────────────────
  humerus_L: { id: 'humerus_L', name: 'Плечевая кость (Л)', nodeNames: ['Humerus002'] },
  humerus_R: { id: 'humerus_R', name: 'Плечевая кость (П)', nodeNames: ['Humerus003'] },

  // ── FOREARM ───────────────────────────────────────────────────────────────
  radius_ulna_L: { id: 'radius_ulna_L', name: 'Лучевая и локтевая (Л)', nodeNames: ['Radius002', 'Ulna002'] },
  radius_ulna_R: { id: 'radius_ulna_R', name: 'Лучевая и локтевая (П)', nodeNames: ['Radius003', 'Ulna003'] },

  // ── WRIST (carpal bones) ──────────────────────────────────────────────────
  carpal_L: {
    id: 'carpal_L', name: 'Запястье (Л)',
    nodeNames: ['Capitate_bone', 'Hamate_bone', 'Lunate_bone', 'Pisiform_bone', 'Scaphoid_bone', 'Trapezium_bone', 'Trapezoid_bone', 'Triquetrum_bone'],
  },
  carpal_R: {
    id: 'carpal_R', name: 'Запястье (П)',
    nodeNames: ['Capitate_bone001', 'Hamate_bone001', 'Lunate_bone001', 'Pisiform_bone001', 'Scaphoid_bone001', 'Trapezium_bone001', 'Trapezoid_bone001', 'Triquetrum_bone001'],
  },

  // ── HAND ──────────────────────────────────────────────────────────────────
  hand_bones_L: {
    id: 'hand_bones_L', name: 'Пясть (Л)',
    nodeNames: ['First_metacarpal_bone', 'Second_metacarpal_bone', 'Third_metacarpal_bone', 'Fourth_metacarpal_bone', 'Fifth_metacarpal_bone'],
  },
  hand_bones_R: {
    id: 'hand_bones_R', name: 'Пясть (П)',
    nodeNames: ['First_metacarpal_bone001', 'Second_metacarpal_bone001', 'Third_metacarpal_bone001', 'Fourth_metacarpal_bone001', 'Fifth_metacarpal_bone001'],
  },
  finger_phalanges_L: {
    id: 'finger_phalanges_L', name: 'Фаланги пальцев руки (Л)',
    nodeNames: [
      'Proximal_phalanx_of_first_finger_of_hand',  'Proximal_phalanx_of_second_finger_of_hand',
      'Proximal_phalanx_of_third_finger_of_hand',  'Proximal_phalanx_of_fourth_finger_of_hand',
      'Proximal_phalanx_of_fifth_finger_of_hand',
      'Middle_phalanx_of_second_finger_of_hand',   'Middle_phalanx_of_third_finger_of_hand',
      'Middle_phalanx_of_fourth_finger_of_hand',   'Middle_phalanx_of_fifth_finger_of_hand',
      'Distal_phalanx_of_first_finger_of_hand',    'Distal_phalanx_of_second_finger_of_hand',
      'Distal_phalanx_of_third_finger_of_hand',    'Distal_phalanx_of_fourth_finger_of_hand',
      'Distal_phalanx_of_fifth_finger_of_hand',
    ],
  },
  finger_phalanges_R: {
    id: 'finger_phalanges_R', name: 'Фаланги пальцев руки (П)',
    nodeNames: [
      'Proximal_phalanx_of_first_finger_of_hand001',  'Proximal_phalanx_of_second_finger_of_hand001',
      'Proximal_phalanx_of_third_finger_of_hand001',  'Proximal_phalanx_of_fourth_finger_of_hand001',
      'Proximal_phalanx_of_fifth_finger_of_hand001',
      'Middle_phalanx_of_second_finger_of_hand001',   'Middle_phalanx_of_third_finger_of_hand001',
      'Middle_phalanx_of_fourth_finger_of_hand001',   'Middle_phalanx_of_fifth_finger_of_hand001',
      'Distal_phalanx_of_first_finger_of_hand001',    'Distal_phalanx_of_second_finger_of_hand001',
      'Distal_phalanx_of_third_finger_of_hand001',    'Distal_phalanx_of_fourth_finger_of_hand001',
      'Distal_phalanx_of_fifth_finger_of_hand001',
    ],
  },

  // ── PELVIS ────────────────────────────────────────────────────────────────
  hip_bone_L: { id: 'hip_bone_L', name: 'Тазовая кость (Л)', nodeNames: ['Hip_bone002'] },
  hip_bone_R: { id: 'hip_bone_R', name: 'Тазовая кость (П)', nodeNames: ['Hip_bone003'] },

  // ── THIGH ─────────────────────────────────────────────────────────────────
  femur_L: { id: 'femur_L', name: 'Бедренная кость (Л)', nodeNames: ['Femur002'] },
  femur_R: { id: 'femur_R', name: 'Бедренная кость (П)', nodeNames: ['Femur003'] },

  // ── KNEE ──────────────────────────────────────────────────────────────────
  patella_L: { id: 'patella_L', name: 'Надколенник (Л)', nodeNames: ['Patella'] },
  patella_R: { id: 'patella_R', name: 'Надколенник (П)', nodeNames: ['Patella001'] },

  // ── LOWER LEG ─────────────────────────────────────────────────────────────
  tibia_L:  { id: 'tibia_L',  name: 'Большеберцовая (Л)', nodeNames: ['Tibia002'] },
  tibia_R:  { id: 'tibia_R',  name: 'Большеберцовая (П)', nodeNames: ['Tibia003'] },
  fibula_L: { id: 'fibula_L', name: 'Малоберцовая (Л)',   nodeNames: ['Fibula002'] },
  fibula_R: { id: 'fibula_R', name: 'Малоберцовая (П)',   nodeNames: ['Fibula003'] },

  // ── ANKLE ─────────────────────────────────────────────────────────────────
  calcaneus_L: { id: 'calcaneus_L', name: 'Пяточная кость (Л)', nodeNames: ['Calcaneus'] },
  calcaneus_R: { id: 'calcaneus_R', name: 'Пяточная кость (П)', nodeNames: ['Calcaneus001'] },
  talus_L:     { id: 'talus_L',     name: 'Таранная кость (Л)', nodeNames: ['Talus'] },
  talus_R:     { id: 'talus_R',     name: 'Таранная кость (П)', nodeNames: ['Talus001'] },

  // ── TARSAL (midfoot) ──────────────────────────────────────────────────────
  tarsal_L: {
    id: 'tarsal_L', name: 'Предплюсна (Л)',
    nodeNames: ['Navicular_bone', 'Cuboid_bone', 'Intermediate_cuneiform_bone', 'Lateral_cuneiform_bone', 'Medial_cuneiform_bone'],
  },
  tarsal_R: {
    id: 'tarsal_R', name: 'Предплюсна (П)',
    nodeNames: ['Navicular_bone001', 'Cuboid_bone001', 'Intermediate_cuneiform_bone001', 'Lateral_cuneiform_bone001', 'Medial_cuneiform_bone001'],
  },

  // ── FOOT ──────────────────────────────────────────────────────────────────
  foot_bones_L: {
    id: 'foot_bones_L', name: 'Плюсна (Л)',
    nodeNames: ['First_metatarsal_bone002', 'Fifth_metatarsal_bone002', 'Second_metatarsal_bone001', 'Third_metatarsal_bone', 'Fourth_metatarsal_bone'],
  },
  foot_bones_R: {
    id: 'foot_bones_R', name: 'Плюсна (П)',
    nodeNames: ['First_metatarsal_bone003', 'Fifth_metatarsal_bone003', 'Second_metatarsal_bone', 'Third_metatarsal_bone001', 'Fourth_metatarsal_bone001'],
  },
  toe_phalanges_L: {
    id: 'toe_phalanges_L', name: 'Фаланги пальцев ноги (Л)',
    nodeNames: [
      'Proximal_phalanx_of_first_finger_of_foot',   'Proximal_phalanx_of_second_finger_of_foot',
      'Proximal_phalanx_of_third_finger_of_foot',   'Proximal_phalanx_of_fourth_finger_of_foot',
      'Proximal_phalanx_of_fifth_finger_of_foot',
      'Middle_phalanx_of_second_finger_of_foot',    'Middle_phalanx_of_third_finger_of_foot',
      'Middle_phalanx_of_fourth_finger_of_foot',    'Middle_phalanx_of_fifth_finger_of_foot',
      'Distal_phalanx_of_first_finger_of_foot',     'Distal_phalanx_of_second_finger_of_foot',
      'Distal_phalanx_of_third_finger_of_foot',     'Distal_phalanx_of_fourth_finger_of_foot',
      'Distal_phalanx_of_fifth_finger_of_foot',
    ],
  },
  toe_phalanges_R: {
    id: 'toe_phalanges_R', name: 'Фаланги пальцев ноги (П)',
    nodeNames: [
      'Proximal_phalanx_of_first_finger_of_foot001',  'Proximal_phalanx_of_second_finger_of_foot001',
      'Proximal_phalanx_of_third_finger_of_foot001',  'Proximal_phalanx_of_fourth_finger_of_foot001',
      'Proximal_phalanx_of_fifth_finger_of_foot001',
      'Middle_phalanx_of_second_finger_of_foot001',   'Middle_phalanx_of_third_finger_of_foot001',
      'Middle_phalanx_of_fourth_finger_of_foot001',   'Middle_phalanx_of_fifth_finger_of_foot001',
      'Distal_phalanx_of_first_finger_of_foot001',    'Distal_phalanx_of_second_finger_of_foot001',
      'Distal_phalanx_of_third_finger_of_foot001',    'Distal_phalanx_of_fourth_finger_of_foot001',
      'Distal_phalanx_of_fifth_finger_of_foot001',
    ],
  },
}

export const NODE_TO_SKELETON_GROUP = Object.fromEntries(
  Object.values(SKELETON_GROUPS).flatMap(g =>
    g.nodeNames.map(name => [name, g.id])
  )
)
