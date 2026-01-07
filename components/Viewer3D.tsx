import React, { Suspense, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  Html,
} from "@react-three/drei";
import { Marker } from "../types";
import { HumanoidModel } from "./HumanoidModel";
import * as THREE from "three";

interface Viewer3DProps {
  gender: "male" | "female";
  markers: Marker[];
  selectedMarkerId: string | null;
  onPointClick: (position: [number, number, number]) => void;
  onMarkerSelect: (id: string | null) => void;
  isModalOpen: boolean;
}

const FPSUpdater: React.FC<{ onUpdate: (fps: number) => void }> = ({
  onUpdate,
}) => {
  const frames = useRef(0);
  const prevTime = useRef(performance.now());

  useFrame(() => {
    frames.current++;
    const time = performance.now();
    if (time >= prevTime.current + 1000) {
      onUpdate(Math.round((frames.current * 1000) / (time - prevTime.current)));
      prevTime.current = time;
      frames.current = 0;
    }
  });

  return null;
};

const MarkerPoint: React.FC<{
  marker: Marker;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  isModalOpen: boolean;
}> = ({ marker, isSelected, onSelect, isModalOpen }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = isSelected ? 1 : 1;
      const pulse = isSelected
        ? Math.sin(state.clock.elapsedTime * 4) * 0.2 + 1
        : 1;
      meshRef.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <group position={marker.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          // Toggle selection: if already selected, deselect
          onSelect(isSelected ? null : marker.id);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.015, 32, 32]} />
        <meshStandardMaterial
          color={isSelected ? "#ef4444" : "#ffffff"}
          emissive={isSelected ? "#ef4444" : "#ffffff"}
          emissiveIntensity={hovered || isSelected ? 2 : 1}
          transparent
          opacity={hovered || isSelected ? 1 : 0.8}
        />
      </mesh>
      {(hovered || isSelected) && !isModalOpen && (
        <Html center position={[0, 0.1, 0]} zIndexRange={[100, 0]}>
          <div
            className="bg-slate-900/95 text-white px-3 py-1.5 rounded-lg border border-slate-700 shadow-2xl text-xs font-bold whitespace-nowrap pointer-events-none antialiased"
            style={{
              transform: `scale(${hovered || isSelected ? 2.2 : 0.5})`,
              opacity: hovered || isSelected ? 1 : 0,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              WebkitFontSmoothing: "antialiased",
              transformOrigin: "center bottom",
            }}
          >
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
  onMarkerSelect,
  isModalOpen,
}) => {
  const [fps, setFps] = useState(0);

  return (
    <div className="w-full h-full cursor-crosshair relative overflow-hidden">
      <Canvas shadows onPointerMissed={() => onMarkerSelect(null)}>
        <color attach="background" args={["#1e293b"]} />
        <PerspectiveCamera makeDefault position={[0, 1.5, 3.5]} fov={45} />
        <OrbitControls
          enablePan={false}
          minDistance={1.5}
          maxDistance={6}
          target={[0, 1, 0]}
        />

        <Suspense fallback={null}>
          <Environment preset="city" environmentIntensity={1} />

          {/* Main Key Light */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* Fill Light */}
          <directionalLight
            position={[-5, 2, 2]}
            intensity={1}
            color="#cbd5e1"
          />

          {/* Rim Light (Backlight) */}
          <spotLight
            position={[0, 5, -10]}
            intensity={2.5}
            angle={0.3}
            penumbra={1}
            color="#60a5fa"
          />

          <ambientLight intensity={0.4} />

          <group>
            <HumanoidModel
              gender={gender}
              onBodyClick={onPointClick}
              onPointerDown={(e) => {
                e.stopPropagation();
                onMarkerSelect(null);
              }}
            />

            {markers.map((marker) => (
              <MarkerPoint
                key={marker.id}
                marker={marker}
                isSelected={selectedMarkerId === marker.id}
                onSelect={onMarkerSelect}
                isModalOpen={isModalOpen}
              />
            ))}
          </group>

          <FPSUpdater onUpdate={setFps} />
        </Suspense>
      </Canvas>

      {/* UI Overlay - Confined to Viewer3D container */}
      <div className="absolute bottom-6 left-6 text-slate-300 text-xs font-medium space-y-1 pointer-events-none">
        <p>Left Click + Drag: Rotate</p>
        <p>Scroll: Zoom</p>
        <p>Double Click Body: Place Marker</p>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-slate-900/20 backdrop-blur-sm px-2 py-1 rounded-md border border-white/5 pointer-events-none">
        <span className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">
          Performance
        </span>
        <span className="text-slate-300 font-mono text-xs">{fps} FPS</span>
      </div>
    </div>
  );
};
