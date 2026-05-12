import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { NODE_TO_GROUP,        isBoneNode }          from '../data/muscles'
import { NODE_TO_SKELETON_GROUP }                    from '../data/skeleton'
import { NODE_TO_TENDON_GROUP }                      from '../data/tendons'
import { NODE_TO_BURSA_GROUP }                       from '../data/bursae'
import { painToColor }                               from '../utils/painColor'

const MODEL_URL = `${import.meta.env.BASE_URL}models/human_body.glb`
const DRACO_URL = `${import.meta.env.BASE_URL}draco/`

useGLTF.setDecoderPath(DRACO_URL)

// ─── Layer detection ───────────────────────────────────────────────────────────
// Given a sanitized node name, return which layer it belongs to.
function getNodeLayer(name) {
  const l = name.toLowerCase()
  if (l.includes('bursa') || l.includes('intermuscular_gluteal')) return 'bursae'
  if (l.includes('tendon') || l.includes('sheath'))               return 'tendons'
  if (isBoneNode(name))                                            return 'skeleton'
  return 'muscles'
}

// Combined node→groupId lookup across all layers
const GLOBAL_NODE_TO_GROUP = {
  ...NODE_TO_GROUP,
  ...NODE_TO_SKELETON_GROUP,
  ...NODE_TO_TENDON_GROUP,
  ...NODE_TO_BURSA_GROUP,
}

// ─── Base materials (active, no pain) ─────────────────────────────────────────
const _base = painToColor(0)
const MAT_MUSCLE_BASE = new THREE.MeshStandardMaterial({
  color: new THREE.Color(_base.color),
  emissive: new THREE.Color(_base.emissive),
  emissiveIntensity: _base.emissiveIntensity,
  transparent: true, opacity: _base.opacity,
  depthWrite: true, side: THREE.FrontSide,
})

const MAT_SKELETON_BASE = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#cbd5e1'),
  emissive: new THREE.Color('#94a3b8'),
  emissiveIntensity: 0.0,
  transparent: true, opacity: 0.88,
  depthWrite: true, side: THREE.FrontSide,
})

const MAT_TENDON_BASE = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#5eead4'),
  emissive: new THREE.Color('#14b8a6'),
  emissiveIntensity: 0.05,
  transparent: true, opacity: 0.82,
  depthWrite: true, side: THREE.FrontSide,
})

const MAT_BURSA_BASE = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#86efac'),
  emissive: new THREE.Color('#22c55e'),
  emissiveIntensity: 0.05,
  transparent: true, opacity: 0.80,
  depthWrite: true, side: THREE.FrontSide,
})

// ─── Ghost materials (inactive layer context) ──────────────────────────────────
const MAT_GHOST_MUSCLE = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#93c5fd'), transparent: true, opacity: 0.06,
  depthWrite: false, side: THREE.FrontSide,
})
const MAT_GHOST_SKELETON = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#cbd5e1'), transparent: true, opacity: 0.08,
  depthWrite: false, side: THREE.FrontSide,
})
const MAT_GHOST_TENDON = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#5eead4'), transparent: true, opacity: 0.07,
  depthWrite: false, side: THREE.FrontSide,
})
const MAT_GHOST_BURSA = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#86efac'), transparent: true, opacity: 0.07,
  depthWrite: false, side: THREE.FrontSide,
})

const GHOST = {
  muscles:  MAT_GHOST_MUSCLE,
  skeleton: MAT_GHOST_SKELETON,
  tendons:  MAT_GHOST_TENDON,
  bursae:   MAT_GHOST_BURSA,
}
const BASE = {
  muscles:  MAT_MUSCLE_BASE,
  skeleton: MAT_SKELETON_BASE,
  tendons:  MAT_TENDON_BASE,
  bursae:   MAT_BURSA_BASE,
}

// ─── Pain material caches per layer ───────────────────────────────────────────
const painMatCaches = { muscles: new Map(), skeleton: new Map(), tendons: new Map(), bursae: new Map() }

function lerpColor(a, b, t) {
  const ca = new THREE.Color(a), cb = new THREE.Color(b)
  return ca.lerp(cb, t).getStyle()
}

function getPainMat(layer, pain) {
  const cache = painMatCaches[layer]
  if (cache.has(pain)) return cache.get(pain)

  let color, emissive, emissiveIntensity, opacity

  if (layer === 'muscles') {
    // existing muscle gradient: blue → purple → red  (via painToColor)
    const p = painToColor(pain)
    color = p.color; emissive = p.emissive
    emissiveIntensity = p.emissiveIntensity; opacity = p.opacity
  } else if (layer === 'skeleton') {
    // light gray → orange → red-orange
    const t = pain / 10
    if (t < 0.5) {
      const u = t * 2
      color   = lerpColor('#cbd5e1', '#fb923c', u)
      emissive = '#fb923c'; emissiveIntensity = u * 0.25; opacity = 0.88 + u * 0.06
    } else {
      const u = (t - 0.5) * 2
      color   = lerpColor('#fb923c', '#dc2626', u)
      emissive = '#dc2626'; emissiveIntensity = 0.25 + u * 0.55; opacity = 0.94 + u * 0.04
    }
  } else if (layer === 'tendons') {
    // teal → amber → red
    const t = pain / 10
    if (t < 0.5) {
      const u = t * 2
      color   = lerpColor('#14b8a6', '#fbbf24', u)
      emissive = '#fbbf24'; emissiveIntensity = u * 0.3; opacity = 0.82 + u * 0.1
    } else {
      const u = (t - 0.5) * 2
      color   = lerpColor('#fbbf24', '#ef4444', u)
      emissive = '#ef4444'; emissiveIntensity = 0.3 + u * 0.5; opacity = 0.92 + u * 0.06
    }
  } else {
    // bursae: green → yellow → red
    const t = pain / 10
    if (t < 0.5) {
      const u = t * 2
      color   = lerpColor('#22c55e', '#fde047', u)
      emissive = '#fde047'; emissiveIntensity = u * 0.25; opacity = 0.80 + u * 0.12
    } else {
      const u = (t - 0.5) * 2
      color   = lerpColor('#fde047', '#ef4444', u)
      emissive = '#ef4444'; emissiveIntensity = 0.25 + u * 0.55; opacity = 0.92 + u * 0.06
    }
  }

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(emissive),
    emissiveIntensity,
    transparent: true, opacity,
    depthWrite: true, side: THREE.FrontSide,
  })
  cache.set(pain, mat)
  return mat
}

// ─── Click handler ─────────────────────────────────────────────────────────────
function ClickHandler({ activeLayer, onGroupClick }) {
  const { camera, gl, scene } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse     = useRef(new THREE.Vector2())
  const downPos   = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = gl.domElement

    const onPointerDown = e => { downPos.current = { x: e.clientX, y: e.clientY } }

    const onPointerUp = e => {
      const dx = e.clientX - downPos.current.x
      const dy = e.clientY - downPos.current.y
      if (Math.sqrt(dx * dx + dy * dy) > 5) return

      const rect = canvas.getBoundingClientRect()
      mouse.current.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
      mouse.current.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1

      raycaster.current.setFromCamera(mouse.current, camera)
      const hits = raycaster.current.intersectObjects(scene.children, true)

      if (hits.length > 0) {
        const name    = hits[0].object.name ?? ''
        const nodeLyr = getNodeLayer(name)
        // Only fire for nodes that belong to the active layer
        if (nodeLyr !== activeLayer) return
        const groupId = GLOBAL_NODE_TO_GROUP[name]
        if (groupId) onGroupClick(groupId)
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointerup',   onPointerUp)
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerup',   onPointerUp)
    }
  }, [camera, gl, scene, activeLayer, onGroupClick])

  return null
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function HumanModel({ activeLayer, effectiveLayerState, onGroupClick }) {
  const { scene }  = useGLTF(MODEL_URL)
  const meshMapRef = useRef(null)   // Map<name, mesh>
  const layerMapRef = useRef(null)  // Map<name, layerId>

  // On load: build maps + assign initial materials
  useEffect(() => {
    const meshMap  = new Map()
    const lyrMap   = new Map()
    scene.traverse(child => {
      if (!child.isMesh) return
      meshMap.set(child.name, child)
      lyrMap.set(child.name, getNodeLayer(child.name))
    })
    meshMapRef.current  = meshMap
    layerMapRef.current = lyrMap

    // Initial material pass (activeLayer = 'muscles' on first load)
    meshMap.forEach((mesh, name) => {
      const lyr = lyrMap.get(name)
      mesh.material = lyr === activeLayer ? BASE[lyr] : GHOST[lyr]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene])

  // When activeLayer changes: re-assign base/ghost for every mesh
  useEffect(() => {
    const meshMap = meshMapRef.current
    const lyrMap  = layerMapRef.current
    if (!meshMap || !lyrMap) return

    meshMap.forEach((mesh, name) => {
      const lyr = lyrMap.get(name)
      if (lyr !== activeLayer) {
        mesh.material = GHOST[lyr]
      } else {
        // Will be refined by pain pass below, but set base first
        mesh.material = BASE[lyr]
      }
    })
  }, [activeLayer])

  // When pain state changes: update only active layer meshes
  useEffect(() => {
    const meshMap = meshMapRef.current
    const lyrMap  = layerMapRef.current
    if (!meshMap || !lyrMap) return

    meshMap.forEach((mesh, name) => {
      if (lyrMap.get(name) !== activeLayer) return
      const groupId = GLOBAL_NODE_TO_GROUP[name]
      if (!groupId) return
      const pain = effectiveLayerState[groupId]?.pain ?? 0
      mesh.material = pain > 0 ? getPainMat(activeLayer, pain) : BASE[activeLayer]
    })
  }, [activeLayer, effectiveLayerState])

  return (
    <>
      <primitive object={scene} />
      <ClickHandler activeLayer={activeLayer} onGroupClick={onGroupClick} />
    </>
  )
}

useGLTF.preload(MODEL_URL)
