'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, AccumulativeShadows, RandomizedLight } from '@react-three/drei'
import * as THREE from 'three'
import { useRingStore, METAL_COLORS, STONE_COLORS } from '@/lib/store'
import type { BandStyle, StoneShape, StoneColor } from '@/lib/store'

// ─── Procedural ring band ─────────────────────────────────────────────────────
// Uses a LatheGeometry profile for a realistic cross-section instead of a plain torus

function buildBandProfile(tubeR: number, segments = 24): THREE.Vector2[] {
  const points: THREE.Vector2[] = []
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    // Slightly flattened oval cross-section with inner bevel
    const r = tubeR * (1 + 0.08 * Math.cos(2 * t))
    const x = Math.cos(t) * r
    const y = Math.sin(t) * r
    points.push(new THREE.Vector2(x, y))
  }
  return points
}

function buildRingGeometry(
  outerRadius: number,
  tubeR: number,
  radialSegments = 128,
  tubularSegments = 48
): THREE.BufferGeometry {
  // Custom torus with richer geometry for better light interaction
  const geo = new THREE.TorusGeometry(outerRadius, tubeR, tubularSegments, radialSegments)
  return geo
}

// ─── Milgrain beads around edges ──────────────────────────────────────────────

function MilgrainBeads({ outerR, tubeR, metalColor }: { outerR: number; tubeR: number; metalColor: string }) {
  const count = 64
  const positions = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2
      return {
        x: Math.cos(a) * outerR,
        y: Math.sin(a) * outerR,
        angle: a,
      }
    })
  }, [outerR, count])

  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, tubeR * 0.88]} rotation={[0, 0, p.angle]}>
          <sphereGeometry args={[tubeR * 0.09, 6, 6]} />
          <meshPhysicalMaterial color={metalColor} roughness={0.2} metalness={1} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Pavé stones ──────────────────────────────────────────────────────────────

function PaveStones({ outerR, tubeR }: { outerR: number; tubeR: number }) {
  const count = 22
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2
        const x = Math.cos(a) * outerR
        const y = Math.sin(a) * outerR
        return (
          <mesh key={i} position={[x, y, tubeR * 0.82]}>
            <sphereGeometry args={[tubeR * 0.19, 8, 8]} />
            <meshPhysicalMaterial
              color="#dce8ff"
              roughness={0.02}
              metalness={0}
              transmission={0.9}
              thickness={0.3}
              ior={2.42}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// ─── Twisted cable detail ─────────────────────────────────────────────────────

function TwistedCables({ outerR, tubeR, metalMid }: { outerR: number; tubeR: number; metalMid: string }) {
  const N = 3
  return (
    <group>
      {Array.from({ length: N }, (_, i) => {
        const offset = (i / N) * Math.PI * 2
        return (
          <mesh key={i} rotation={[Math.PI / 2, 0, offset * 0.5]}>
            <torusGeometry args={[outerR, tubeR * 0.28, 8, 128, Math.PI * 2]} />
            <meshPhysicalMaterial color={metalMid} roughness={0.18} metalness={0.95} />
          </mesh>
        )
      })}
    </group>
  )
}

// ─── Stone geometries ─────────────────────────────────────────────────────────

function buildStoneGeo(shape: StoneShape) {
  switch (shape) {
    case 'oval':
      // Elongated sphere
      return new THREE.SphereGeometry(1, 32, 24)
    case 'princess':
      return new THREE.BoxGeometry(1, 0.5, 1)
    case 'emerald': {
      // Chamfered box
      const s = new THREE.BoxGeometry(0.7, 0.45, 1.1)
      return s
    }
    case 'pear': {
      const shape2d = new THREE.Shape()
      shape2d.moveTo(0, 0.9)
      shape2d.bezierCurveTo(0.5, 0.8, 0.7, 0.3, 0.6, -0.2)
      shape2d.bezierCurveTo(0.5, -0.8, -0.5, -0.8, -0.6, -0.2)
      shape2d.bezierCurveTo(-0.7, 0.3, -0.5, 0.8, 0, 0.9)
      const extSettings = { depth: 0.4, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 4 }
      return new THREE.ExtrudeGeometry(shape2d, extSettings)
    }
    case 'heart': {
      const hShape = new THREE.Shape()
      hShape.moveTo(0, -0.7)
      hShape.bezierCurveTo(0.4, -0.9, 0.9, -0.5, 0.9, 0)
      hShape.bezierCurveTo(0.9, 0.5, 0.5, 0.8, 0, 0.9)
      hShape.bezierCurveTo(-0.5, 0.8, -0.9, 0.5, -0.9, 0)
      hShape.bezierCurveTo(-0.9, -0.5, -0.4, -0.9, 0, -0.7)
      return new THREE.ExtrudeGeometry(hShape, { depth: 0.38, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 })
    }
    default: // round
      return new THREE.SphereGeometry(1, 32, 32)
  }
}

function Stone({ shape, stoneColor, position }: { shape: StoneShape; stoneColor: StoneColor; position: [number, number, number] }) {
  const sc = STONE_COLORS[stoneColor]
  if (!sc.inner) return null

  const geo = useMemo(() => buildStoneGeo(shape), [shape])
  const scale = shape === 'oval' ? [0.16, 0.22, 0.16] as [number,number,number]
             : shape === 'round' ? [0.17, 0.17, 0.17] as [number,number,number]
             : [0.17, 0.17, 0.17] as [number,number,number]

  return (
    <mesh geometry={geo} position={position} scale={scale}
      rotation={['pear','heart','emerald'].includes(shape) ? [-Math.PI/2, 0, 0] : [0,0,0]}>
      <meshPhysicalMaterial
        color={sc.inner}
        roughness={0.04}
        metalness={0}
        transmission={stoneColor === 'diamond' ? 0.92 : 0.35}
        thickness={0.5}
        ior={stoneColor === 'diamond' ? 2.42 : 1.78}
        reflectivity={1}
        clearcoat={1}
        clearcoatRoughness={0.02}
        emissive={sc.inner}
        emissiveIntensity={stoneColor === 'diamond' ? 0.03 : 0.12}
        envMapIntensity={2.5}
      />
    </mesh>
  )
}

// ─── Prong setting ────────────────────────────────────────────────────────────

function ProngSetting({ outerR, tubeR, metalBase, metalMid, stoneColor, stoneShape }:{
  outerR: number; tubeR: number; metalBase: string; metalMid: string
  stoneColor: StoneColor; stoneShape: StoneShape
}) {
  if (stoneColor === 'none') return null
  const settingY = outerR + tubeR * 0.5
  const prongs = stoneShape === 'princess' || stoneShape === 'emerald' ? 4 : 6

  return (
    <group position={[0, settingY, 0]}>
      {/* Setting basket */}
      <mesh position={[0, -tubeR * 0.3, 0]}>
        <cylinderGeometry args={[0.19, 0.15, 0.18, 16]} />
        <meshPhysicalMaterial color={metalBase} roughness={0.12} metalness={0.97} envMapIntensity={2} />
      </mesh>
      {/* Inner basket cutout illusion - dark ring */}
      <mesh position={[0, -tubeR * 0.25, 0]}>
        <torusGeometry args={[0.165, 0.022, 8, 32]} />
        <meshStandardMaterial color="#090807" />
      </mesh>
      {/* Prongs */}
      {Array.from({ length: prongs }, (_, i) => {
        const a = (i / prongs) * Math.PI * 2 + (stoneShape === 'princess' ? Math.PI / 4 : 0)
        const px = Math.cos(a) * 0.155
        const pz = Math.sin(a) * 0.155
        return (
          <mesh key={i} position={[px, 0.12, pz]}
            rotation={[Math.cos(a) * 0.35, 0, Math.sin(a) * -0.35]}>
            <cylinderGeometry args={[0.022, 0.016, 0.34, 6]} />
            <meshPhysicalMaterial color={metalMid} roughness={0.1} metalness={0.98} envMapIntensity={2} />
          </mesh>
        )
      })}
      {/* Gemstone */}
      <Stone shape={stoneShape} stoneColor={stoneColor} position={[0, 0.08, 0]} />
    </group>
  )
}

// ─── Full Ring ────────────────────────────────────────────────────────────────

function RingMesh() {
  const groupRef = useRef<THREE.Group>(null)
  const { metal, bandStyle, bandWidth, stoneShape, stoneColor } = useRingStore()

  const mc = METAL_COLORS[metal]
  const outerR = 1.0
  const tubeR = (bandWidth / 5) * 0.20 + 0.11

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.28
    }
  })

  const bandGeo = useMemo(() => buildRingGeometry(outerR, tubeR), [outerR, tubeR])

  const metalMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(mc.base),
    roughness: metal === 'black' ? 0.55 : 0.12,
    metalness: 0.97,
    reflectivity: 1,
    clearcoat: metal === 'black' ? 0.15 : 0.75,
    clearcoatRoughness: 0.08,
    envMapIntensity: 2.2,
  }), [metal, mc.base])

  const innerMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(mc.dark).multiplyScalar(0.7),
    roughness: 0.35,
    metalness: 0.9,
    side: THREE.BackSide,
  }), [metal, mc.dark])

  return (
    <group ref={groupRef} rotation={[Math.PI / 2.6, 0, 0]}>
      {/* Outer band */}
      <mesh geometry={bandGeo} material={metalMat} castShadow receiveShadow />
      {/* Inner bore — slightly smaller torus rendered backside */}
      <mesh rotation={[0,0,0]}>
        <torusGeometry args={[outerR, tubeR * 0.82, 32, 128]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* Band style details */}
      {bandStyle === 'Pavé' && <PaveStones outerR={outerR} tubeR={tubeR} />}
      {bandStyle === 'Milgrain' && <MilgrainBeads outerR={outerR} tubeR={tubeR} metalColor={mc.mid} />}
      {bandStyle === 'Twisted' && <TwistedCables outerR={outerR} tubeR={tubeR} metalMid={mc.mid} />}

      {/* Engraving hint — subtle groove ring */}
      <mesh>
        <torusGeometry args={[outerR, tubeR * 0.06, 4, 128]} />
        <meshStandardMaterial color={mc.dark} roughness={0.6} metalness={0.8} />
      </mesh>

      {/* Stone + setting */}
      <ProngSetting
        outerR={outerR} tubeR={tubeR}
        metalBase={mc.base} metalMid={mc.mid}
        stoneColor={stoneColor} stoneShape={stoneShape}
      />
    </group>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function RingCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.5, 5], fov: 36 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      style={{ background: 'transparent' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[4, 8, 4]} intensity={1.8}
        color="#fff8e8" castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-4, 2, -2]} intensity={0.5} color="#c0c8e8" />
      <pointLight position={[0, 6, 1]} intensity={1.2} color="#f5e090" />
      <pointLight position={[2, -2, 3]} intensity={0.4} color="#ffffff" />

      {/* Environment map for PBR reflections */}
      <Environment preset="studio" />

      {/* Soft shadow plane */}
      <AccumulativeShadows
        position={[0, -2.2, 0]} frames={40} opacity={0.35} scale={8}
        color="#1a1208"
      >
        <RandomizedLight position={[4, 8, 4]} amount={4} radius={2} ambient={0.5} />
      </AccumulativeShadows>

      <RingMesh />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={2.5}
        maxDistance={8}
        autoRotate={false}
        dampingFactor={0.08}
        enableDamping
      />
    </Canvas>
  )
}
