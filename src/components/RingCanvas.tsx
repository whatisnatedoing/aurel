'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useRingStore, METAL_COLORS, STONE_COLORS } from '@/lib/store'
import type { BandStyle, StoneShape } from '@/lib/store'

// ─── Band geometry helpers ────────────────────────────────────────────────────

function createTorusGeometry(outerR: number, tubeR: number, radSeg = 64, tubeSeg = 32) {
  return new THREE.TorusGeometry(outerR, tubeR, tubeSeg, radSeg)
}

function PavéDots({ outerR, tubeR, color }: { outerR: number; tubeR: number; color: string }) {
  const count = 24
  const dots = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      return {
        x: Math.cos(angle) * outerR,
        y: Math.sin(angle) * outerR,
        z: 0,
      }
    })
  }, [outerR])

  return (
    <>
      {dots.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, tubeR * 0.9]}>
          <sphereGeometry args={[tubeR * 0.22, 8, 8]} />
          <meshStandardMaterial color="#e8f4ff" roughness={0.05} metalness={0.1} />
        </mesh>
      ))}
    </>
  )
}

function MilgrainEdge({ outerR, tubeR, color }: { outerR: number; tubeR: number; color: string }) {
  const count = 48
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2
        const x = Math.cos(angle) * outerR
        const y = Math.sin(angle) * outerR
        return (
          <mesh key={i} position={[x, y, tubeR * 0.85]}>
            <sphereGeometry args={[tubeR * 0.12, 6, 6]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.9} />
          </mesh>
        )
      })}
    </>
  )
}

// ─── Stone geometry ───────────────────────────────────────────────────────────

function Stone({ shape, stoneColor }: { shape: StoneShape; stoneColor: string }) {
  const sc = STONE_COLORS[stoneColor as keyof typeof STONE_COLORS]
  if (!sc.inner) return null

  const color = sc.inner
  const geo = useMemo(() => {
    switch (shape) {
      case 'oval':      return new THREE.SphereGeometry(0.14, 16, 16, 0, Math.PI*2, 0, Math.PI)
      case 'princess':  return new THREE.BoxGeometry(0.22, 0.06, 0.22)
      case 'emerald':   return new THREE.BoxGeometry(0.16, 0.06, 0.26)
      case 'pear':      return new THREE.ConeGeometry(0.13, 0.28, 8)
      case 'heart':     return new THREE.SphereGeometry(0.13, 12, 12)
      default:          return new THREE.SphereGeometry(0.14, 16, 12)
    }
  }, [shape])

  return (
    <mesh position={[0, 0, 0.35]} geometry={geo} rotation={shape === 'pear' ? [Math.PI/2,0,0] : [0,0,0]}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.05}
        metalness={0.0}
        transmission={stoneColor === 'diamond' ? 0.85 : 0.3}
        thickness={0.4}
        ior={2.4}
        reflectivity={1}
        emissive={color}
        emissiveIntensity={stoneColor === 'diamond' ? 0.05 : 0.15}
      />
    </mesh>
  )
}

// ─── Main Ring mesh ───────────────────────────────────────────────────────────

function RingMesh() {
  const groupRef = useRef<THREE.Group>(null)
  const { metal, bandStyle, bandWidth, stoneShape, stoneColor } = useRingStore()

  const mc = METAL_COLORS[metal]
  const outerR = 1.0
  const tubeR = (bandWidth / 5) * 0.22 + 0.10

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35
    }
  })

  const metalMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(mc.base),
      roughness: metal === 'black' ? 0.6 : 0.15,
      metalness: 0.95,
      reflectivity: 1,
      clearcoat: metal === 'black' ? 0.2 : 0.8,
      clearcoatRoughness: 0.1,
    })
  }, [metal, mc.base])

  const torusGeo = useMemo(() => createTorusGeometry(outerR, tubeR), [outerR, tubeR])

  return (
    <group ref={groupRef} rotation={[Math.PI / 2.8, 0, 0]}>
      {/* Main band */}
      <mesh geometry={torusGeo} material={metalMaterial} />

      {/* Twisted grooves */}
      {bandStyle === 'Twisted' && (
        <>
          {Array.from({ length: 3 }, (_, i) => (
            <mesh key={i} rotation={[0, (i / 3) * Math.PI * 2, 0]}>
              <torusGeometry args={[outerR, tubeR * 0.35, 8, 64, Math.PI * 0.6]} />
              <meshPhysicalMaterial color={mc.dark} roughness={0.2} metalness={0.9} />
            </mesh>
          ))}
        </>
      )}

      {/* Pavé dots */}
      {bandStyle === 'Pavé' && (
        <PavéDots outerR={outerR} tubeR={tubeR} color={mc.base} />
      )}

      {/* Milgrain edge */}
      {bandStyle === 'Milgrain' && (
        <MilgrainEdge outerR={outerR} tubeR={tubeR} color={mc.mid} />
      )}

      {/* Stone prong setting */}
      {stoneColor !== 'none' && (
        <group position={[0, outerR + tubeR * 0.5, 0]}>
          <Stone shape={stoneShape} stoneColor={stoneColor} />
          {/* 4 prongs */}
          {[0, 1, 2, 3].map(i => {
            const a = (i / 4) * Math.PI * 2
            return (
              <mesh key={i} position={[Math.cos(a) * 0.12, 0.05, Math.sin(a) * 0.12]}
                rotation={[Math.cos(a) * 0.4, 0, Math.sin(a) * -0.4]}>
                <cylinderGeometry args={[0.018, 0.012, 0.28, 6]} />
                <meshPhysicalMaterial color={mc.mid} roughness={0.15} metalness={0.95} />
              </mesh>
            )
          })}
          {/* Setting base */}
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.18, 0.14, 0.06, 16]} />
            <meshPhysicalMaterial color={mc.base} roughness={0.15} metalness={0.95} />
          </mesh>
        </group>
      )}
    </group>
  )
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────

export default function RingCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#fff8e8" />
      <directionalLight position={[-5, -2, -3]} intensity={0.4} color="#c8b8e8" />
      <pointLight position={[0, 4, 2]} intensity={0.8} color="#f5e090" />
      <Environment preset="studio" />
      <RingMesh />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={7}
        autoRotate={false}
      />
    </Canvas>
  )
}
