import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { NODE_TO_GROUP, isBoneNode } from '../data/muscles'
import { painToColor } from '../utils/painColor'

const MODEL_URL = `${import.meta.env.BASE_URL}models/human_body.glb`
const DRACO_URL = `${import.meta.env.BASE_URL}draco/`

useGLTF.setDecoderPath(DRACO_URL)

const MAT_MUSCLE = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#60a5fa'),   // blue-400
  emissive: new THREE.Color('#3b82f6'),
  emissiveIntensity: 0.12,
  transparent: true,
  opacity: 0.72,
  depthWrite: true,
  side: THREE.FrontSide,
})

const MAT_BONE = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#e2e8f0'),   // slate-200 — light gray
  emissive: new THREE.Color('#cbd5e1'),
  emissiveIntensity: 0.0,
  transparent: true,
  opacity: 0.28,
  depthWrite: true,
  side: THREE.FrontSide,
})

const painMatCache = new Map()
function getPainMat(pain) {
  if (painMatCache.has(pain)) return painMatCache.get(pain)
  const { color, emissive, emissiveIntensity, opacity } = painToColor(pain)
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(emissive),
    emissiveIntensity,
    transparent: true,
    opacity,
    depthWrite: true,
    side: THREE.FrontSide,
  })
  painMatCache.set(pain, mat)
  return mat
}

// Raycaster-based click handler attached at canvas level
function ClickHandler({ onMuscleClick }) {
  const { camera, gl, scene } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())
  const downPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = gl.domElement

    const onPointerDown = e => {
      downPos.current = { x: e.clientX, y: e.clientY }
    }

    const onPointerUp = e => {
      // Only fire if pointer didn't move much (real click, not drag)
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
        const groupId = NODE_TO_GROUP[name]
        console.log('[raycast] hit:', JSON.stringify(name), '→', groupId)
        if (groupId) onMuscleClick(groupId)
      } else {
        console.log('[raycast] no hit')
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointerup',   onPointerUp)
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerup',   onPointerUp)
    }
  }, [camera, gl, scene, onMuscleClick])

  return null
}

export default function HumanModel({ muscleState, onMuscleClick }) {
  const { scene } = useGLTF(MODEL_URL)
  const meshMapRef = useRef(null)

  useEffect(() => {
    const map = new Map()
    scene.traverse(child => {
      if (child.isMesh) map.set(child.name, child)
    })
    meshMapRef.current = map
    console.log('[model] loaded, total meshes:', map.size, 'sample names:', [...map.keys()].slice(0, 3))

    map.forEach((mesh, name) => {
      mesh.material = isBoneNode(name) ? MAT_BONE : MAT_MUSCLE
    })
  }, [scene])

  useEffect(() => {
    const map = meshMapRef.current
    if (!map) return
    map.forEach((mesh, name) => {
      const groupId = NODE_TO_GROUP[name]
      if (!groupId) return
      const pain = muscleState[groupId]?.pain ?? 0
      mesh.material = pain > 0 ? getPainMat(pain) : MAT_MUSCLE
    })
  }, [muscleState])

  return (
    <>
      <primitive object={scene} />
      <ClickHandler onMuscleClick={onMuscleClick} />
    </>
  )
}

useGLTF.preload(MODEL_URL)
