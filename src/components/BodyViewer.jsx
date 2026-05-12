import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center } from '@react-three/drei'
import HumanModel from './HumanModel'

function Lights() {
  return (
    <>
      <ambientLight intensity={1.8} color="#ffffff" />
      <directionalLight position={[3, 6, 4]}  intensity={1.6} color="#ffffff" castShadow={false} />
      <directionalLight position={[-3, 3, 2]} intensity={0.8} color="#dbeafe" />
      <directionalLight position={[0, -3, 3]} intensity={0.5} color="#e0e7ff" />
    </>
  )
}

function LoadingMesh() {
  return (
    <mesh>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshBasicMaterial color="#3b82f6" wireframe />
    </mesh>
  )
}

export default function BodyViewer({ muscleState, onMuscleClick }) {
  const controlsRef = useRef()

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45, near: 0.01, far: 200 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Lights />
        <Suspense fallback={<LoadingMesh />}>
          <Center>
            <HumanModel muscleState={muscleState} onMuscleClick={onMuscleClick} />
          </Center>
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={0.8}
          maxDistance={10}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI - 0.1}
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      <div style={{
        position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        color: 'rgba(74,122,204,0.5)', fontSize: 11, pointerEvents: 'none', whiteSpace: 'nowrap',
      }}>
        Клик — выбрать зону · Колёсико — масштаб · Тяни — поворот
      </div>
    </div>
  )
}
