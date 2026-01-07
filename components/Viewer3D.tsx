
import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Html, ContactShadows } from '@react-three/drei';
import { Marker } from '../types';
import { HumanoidModel } from './HumanoidModel';
import * as THREE from 'three';

interface Viewer3DProps {
  gender: 'male' | 'female';
  markers: Marker[];
  selectedMarkerId: string | null;
  onPointClick: (position: [number, number, number]) => void;
  onMarkerSelect: (id: string | null) => void;
}

const MarkerPoint: React.FC<{ 
  marker: Marker; 
  isSelected: boolean; 
  onSelect: () => void 
}> = ({ marker, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = isSelected ? 1.5 : 1;
      const pulse = isSelected ? (Math.sin(state.clock.elapsedTime * 4) * 0.2 + 1) : 1;
      meshRef.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <group position={marker.position}>
      <mesh 
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.04, 32, 32]} />
        <meshStandardMaterial 
          color={isSelected ? "#3b82f6" : "#ef4444"} 
          emissive={isSelected ? "#3b82f6" : "#ef4444"}
          emissiveIntensity={hovered || isSelected ? 2 : 0.5}
        />
      </mesh>
      {(hovered || isSelected) && (
        <Html distanceFactor={10} position={[0, 0.1, 0]}>
          <div className="bg-slate-900/90 text-white px-3 py-1.5 rounded-lg border border-slate-700 shadow-xl text-xs font-bold whitespace-nowrap pointer-events-none">
            {marker.title}
          </div>
        </Html>
      )}
    </group>
  );
};

export const Viewer3D: React.FC<Viewer3DProps> = ({ 
  gender, 
  markers, 
  selectedMarkerId, 
  onPointClick, 
  onMarkerSelect 
}) => {
  return (
    <div className="w-full h-full cursor-crosshair">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={45} />
        <OrbitControls 
          enablePan={false} 
          minDistance={1.5} 
          maxDistance={8}
          target={[0, 1, 0]}
        />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          
          <group onPointerMissed={() => onMarkerSelect(null)}>
            <HumanoidModel 
              gender={gender} 
              onBodyClick={onPointClick} 
            />

            {markers.map((marker) => (
              <MarkerPoint 
                key={marker.id} 
                marker={marker} 
                isSelected={selectedMarkerId === marker.id}
                onSelect={() => onMarkerSelect(marker.id)}
              />
            ))}
          </group>

          <ContactShadows 
            position={[0, 0, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={10} 
            resolution={256} 
            color="#000000" 
          />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-6 left-6 text-slate-400 text-xs font-medium space-y-1">
        <p>Left Click + Drag: Rotate</p>
        <p>Scroll: Zoom</p>
        <p>Double Click Body: Place Marker</p>
      </div>
    </div>
  );
};
