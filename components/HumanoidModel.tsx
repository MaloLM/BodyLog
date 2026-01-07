
import React from 'react';
import { ThreeEvent } from '@react-three/fiber';

interface HumanoidModelProps {
  gender: 'male' | 'female';
  onBodyClick: (position: [number, number, number]) => void;
}

export const HumanoidModel: React.FC<HumanoidModelProps> = ({ gender, onBodyClick }) => {
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // Allow double click or just click to place
    if (e.delta < 5) { // Simple check for click vs drag
       onBodyClick([e.point.x, e.point.y, e.point.z]);
    }
  };

  const isMale = gender === 'male';
  
  // Minimalist stylized body parts
  return (
    <group onDoubleClick={handleClick}>
      {/* Torso */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[isMale ? 0.25 : 0.2, 0.6, 8, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Chest/Bust (Visual difference) */}
      {!isMale && (
        <group position={[0, 1.35, 0.15]}>
          <mesh position={[-0.1, 0, 0]} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0.1, 0, 0]} castShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>
      )}

      {/* Head */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.35, 1.3, 0]} rotation={[0, 0, Math.PI / 12]} castShadow>
        <capsuleGeometry args={[0.06, 0.6, 4, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.35, 1.3, 0]} rotation={[0, 0, -Math.PI / 12]} castShadow>
        <capsuleGeometry args={[0.06, 0.6, 4, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.15, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.8, 4, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0.15, 0.45, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.8, 4, 8]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Subtle Grid Base */}
      <gridHelper args={[10, 20, 0x1e293b, 0x0f172a]} position={[0, 0, 0]} />
    </group>
  );
};
