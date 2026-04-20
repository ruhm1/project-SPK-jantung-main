import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder, Torus, Box, Cone, Ring, Octahedron, Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';

function Step0Usia({ ageValue }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    groupRef.current.rotation.y += 0.01;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
  });

  const ageColor = ageValue < 30 ? '#3b82f6' : ageValue < 60 ? '#10b981' : '#f59e0b';

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.2}>
      {/* Kepala (Head) */}
      <Sphere args={[0.35, 16, 16]} position={[0, 1.4, 0]}>
        <meshStandardMaterial color={ageColor} emissive={ageColor} emissiveIntensity={0.4} metalness={0.3} roughness={0.2} />
      </Sphere>
      {/* Tubuh (Body) */}
      <Cylinder args={[0.25, 0.35, 1.1, 16]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#4b5563" emissive="#059669" emissiveIntensity={0.2} />
      </Cylinder>
      {/* Kaki kiri */}
      <Cylinder args={[0.12, 0.15, 0.6, 12]} position={[-0.12, -0.3, 0.3]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>
      {/* Kaki kanan */}
      <Cylinder args={[0.12, 0.15, 0.6, 12]} position={[0.12, -0.3, 0.3]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>
      {/* Age halo */}
      <Torus args={[1.4, 0.05, 8, 16]} position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={ageColor} emissive={ageColor} emissiveIntensity={0.3} />
      </Torus>
    </group>
  );
}

function Step1JenisKelamin({ sexValue }) {
  const groupRef = useRef();
  
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.015;
  });

  const color = sexValue === '1' ? '#3b82f6' : '#ec4899';

  return (
    <group ref={groupRef}>
      {/* Basis */}
      <Sphere args={[1, 24, 24]}>
        <MeshDistortMaterial color={color} speed={1.2} distort={0.2} emissive={color} emissiveIntensity={0.3} />
      </Sphere>
      {/* Simbol laki-laki */}
      {sexValue === '1' ? (
        <group position={[0, 0.2, 0.8]}>
          <Cylinder args={[0.08, 0.1, 1, 12]} />
          <Cone args={[0.15, 0.4, 12]} position={[0, 0.7, 0]} />
        </group>
      ) : (
        <group position={[0, 0.8, 0.3]}>
          <Sphere args={[0.2, 12, 12]} />
          <Cylinder args={[0.22, 0.25, 0.6, 12]} position={[0, -0.3, 0]} />
        </group>
      )}
    </group>
  );
}

function Step2TekananDarah() {
  const waveRef = useRef();

  useFrame((state) => {
    if (waveRef.current) {
      waveRef.current.scale.setScalar(Math.sin(state.clock.elapsedTime * 6) * 0.4 + 0.8);
    }
  });

  return (
    <group rotation={[0, 0.4, 0]}>
      {/* Pembuluh darah */}
      <Cylinder args={[0.12, 0.22, 4, 20]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
      </Cylinder>
      {/* Pompa */}
      <Sphere args={[0.45, 16, 16]} position={[0, -1.2, 0]}>
        <MeshDistortMaterial color="#b91c1c" speed={2.5} distort={0.3} />
      </Sphere>
      {/* Gelombang tekanan */}
      <Ring ref={waveRef} args={[1, 1.2, 24]} position={[0, 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} transparent opacity={0.7} />
      </Ring>
    </group>
  );
}

function Step3Kolesterol() {
  const plaqueRef = useRef();

  useFrame(() => {
    if (plaqueRef.current) {
      plaqueRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group rotation={[0.1, 0.6, 0]}>
      {/* Arteri tersumbat */}
      <Cylinder args={[0.35, 0.55, 3, 20]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.3} />
      </Cylinder>
      {/* Plak kolesterol */}
      <group ref={plaqueRef} position={[0, 0.3, 0]}>
        <Box args={[0.9, 0.25, 0.6]}>
          <MeshDistortMaterial color="#d97706" speed={0.8} distort={0.4} />
        </Box>
        <Box args={[0.7, 0.15, 0.4]} position={[0, -0.2, 0.1]}>
          <meshStandardMaterial color="#b45309" emissive="#92400e" emissiveIntensity={0.2} />
        </Box>
      </group>
    </group>
  );
}

function Step4GulaDarah() {
  const dripRef = useRef();

  useFrame((state) => {
    if (dripRef.current) {
      dripRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1 - 0.8;
    }
  });

  return (
    <group rotation={[0, 0.3, 0]}>
      {/* Tetesan darah */}
      <Cone args={[0.55, 1.3, 20]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.4} metalness={0.2} />
      </Cone>
      {/* Efek menetes */}
      <Cylinder ref={dripRef} args={[0.08, 0.12, 0.9, 12]} position={[0, -1.1, 0]}>
        <meshStandardMaterial color="#a78bfa" transparent opacity={0.9} />
      </Cylinder>
    </group>
  );
}

function Step5EKG() {
  return (
    <group rotation={[0, 0.5, 0]}>
      {/* Jantung */}
      <Sphere args={[0.75, 24, 24]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0ea5e9" emissive="#0284c7" emissiveIntensity={0.5} />
      </Sphere>
      {/* Elektroda EKG */}
      <Cylinder args={[0.03, 0.06, 1.8, 12]} position={[0.7, 0.4, 0.4]}>
        <meshStandardMaterial color="#0369a1" emissive="#0369a1" emissiveIntensity={0.3} />
      </Cylinder>
      <Cylinder args={[0.03, 0.06, 1.8, 12]} position={[-0.7, 0.4, 0.4]}>
        <meshStandardMaterial color="#0369a1" emissive="#0369a1" emissiveIntensity={0.3} />
      </Cylinder>
      <Cylinder args={[0.03, 0.06, 1.6, 12]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#0369a1" emissive="#0369a1" emissiveIntensity={0.3} />
      </Cylinder>
    </group>
  );
}

function Step6DetakJantung() {
  const heartRef = useRef();

  useFrame((state) => {
    if (heartRef.current) {
      heartRef.current.rotation.y += 0.02;
      heartRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.1);
    }
  });

  return (
    <group ref={heartRef} rotation={[0, 0.7, 0]}>
      {/* Jantung berdenyut */}
      <Icosahedron args={[1, 1.5]}>
        <MeshDistortMaterial color="#dc2626" speed={3.5} distort={0.5} emissive="#b91c1c" emissiveIntensity={0.6} />
      </Icosahedron>
      {/* Gelombang denyut */}
      <Ring args={[1.3, 1.4, 24]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.6} transparent opacity={0.8} />
      </Ring>
    </group>
  );
}

function ResultPrediksi({ result }) {
const riskColor = result?.risk === 'Low' ? '#059669' : '#dc2626';
  const auraRef = useRef();

  useFrame((state) => {
    if (auraRef.current) {
      auraRef.current.rotation.x += 0.01;
      auraRef.current.rotation.y += 0.01;
      auraRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.15);
    }
  });

  return (
    <group scale={1.3}>
      {/* Jantung hasil */}
      <Sphere args={[0.9, 24, 24]} position={[0, 0.1, 0]}>
        <MeshDistortMaterial color={riskColor} speed={4} distort={0.6} emissive={riskColor} emissiveIntensity={0.7} />
      </Sphere>
      {/* Bagian bawah jantung */}
      <Cone args={[0.45, 0.9, 18]} position={[0, -0.7, 0]}>
        <meshStandardMaterial color={riskColor} emissive={riskColor} emissiveIntensity={0.5} />
      </Cone>
      {/* Aura perlindungan */}
      <group ref={auraRef}>
        <Octahedron args={[1.6, 0]} wireframe>
          <meshStandardMaterial color={riskColor} emissive={riskColor} emissiveIntensity={0.4} wireframe />
        </Octahedron>
        <Icosahedron args={[2, 0.1]} wireframe position={[0, 0, 0]}>
          <meshStandardMaterial color={riskColor} emissive={riskColor} emissiveIntensity={0.2} wireframe />
        </Icosahedron>
      </group>
    </group>
  );
}

export default function Medical3D({ step, values, result }) {
  const stepId = step?.id || (result ? 7 : 0);

  const getScene = () => {
    switch (stepId) {
      case 0: return <Step0Usia ageValue={parseInt(values?.age) || 0} />;
      case 1: return <Step1JenisKelamin sexValue={values?.sex} />;
      case 2: return <Step2TekananDarah />;
      case 3: return <Step3Kolesterol />;
      case 4: return <Step4GulaDarah />;
      case 5: return <Step5EKG />;
      case 6: return <Step6DetakJantung />;
      case 7: return <ResultPrediksi result={result} />;
      default: return <Sphere args={[1, 32, 32]}><MeshDistortMaterial color="#10b981" /></Sphere>;
    }
  };

  return (
    <div className="h-[500px] lg:h-[600px] w-full bg-gradient-to-br from-slate-900/70 via-black/50 to-slate-900/70 rounded-3xl overflow-hidden border-4 border-gradient-medical shadow-[0_0_100px_rgba(16,185,129,0.4)] backdrop-blur-xl">
      <Canvas 
        camera={{ position: [3, 2, 4], fov: 55 }} 
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[4, 4, 3]} intensity={1.5} castShadow />
        <pointLight position={[-1.5, 1.5, 1.5]} color="#00ff88" intensity={1} />
        <pointLight position={[1.5, 1, -1]} color="#8888ff" intensity={0.6} />
        <hemisphereLight intensity={0.35} color="#22c55e" groundColor="#000011" />
        
        {getScene()}
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={2.5} 
          maxDistance={7}
          autoRotate 
          autoRotateSpeed={0.6}
          dampingFactor={0.05}
          rotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
