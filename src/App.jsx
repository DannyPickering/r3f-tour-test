import * as THREE from 'three'
import { Suspense, useState } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { Html, Preload, OrbitControls, TransformControls, PivotControls } from '@react-three/drei'
import { useControls } from 'leva'

const store = [
  { name: 'one', color: 'lightpink', position: [-5.2, -2, -15], url: 'assets/test.jpg', link: 1 },
  { name: 'two', color: 'lightblue', position: [15, 0, 0], url: 'assets/test2.jpg', link: 0 }
  // ...
]

function Dome({ name, position, texture, onClick }) {
  // Debug UI for position
  const { meshPosition } = useControls({
    meshPosition: {
      value: position,
      step: 0.1,
    }
  })

  return (
    <group>
      <mesh>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>

      {/* Add TransformControls around the clickable mesh */}
      <TransformControls mode="translate">
        <mesh position={meshPosition}>
          <sphereGeometry args={[1.25, 32, 32]} />
          <meshBasicMaterial color="white" />
          <Html
            position={[0, 0, 0]}
            center
            transform
            sprite
            distanceFactor={10}>
            <button onClick={onClick}>{name}</button>
          </Html>
        </mesh>
      </TransformControls>
    </group>
  )
}

function Portals() {
  const [which, set] = useState(0)
  const { link, ...props } = store[which]
  const maps = useLoader(THREE.TextureLoader, store.map((entry) => entry.url)) // prettier-ignore
  return <Dome onClick={() => set(link)} {...props} texture={maps[which]} />
}

export default function App() {
  return (
    <Canvas frameloop="demand" camera={{ position: [0, 0, 0.1] }}>
      <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.2} autoRotate={false} rotateSpeed={-0.5} />
      <Suspense fallback={null}>
        <Preload all />
        <Portals />
      </Suspense>
    </Canvas>
  )
}

