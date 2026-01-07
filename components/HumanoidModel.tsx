
import React, { useMemo, useEffect } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface HumanoidModelProps {
  gender: 'male' | 'female';
  onBodyClick: (position: [number, number, number]) => void;
  onPointerDown?: (e: ThreeEvent<MouseEvent>) => void;
}

export const HumanoidModel: React.FC<HumanoidModelProps> = ({ gender, onBodyClick, onPointerDown }) => {
  const modelPath = gender === 'male' ? '/man.glb' : '/female.glb';
  const { scene } = useGLTF(modelPath);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta < 5) {
       onBodyClick([e.point.x, e.point.y, e.point.z]);
    }
  };

  // Material for a minimalist look
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.4,
    metalness: 0.3,
    transparent: true,
    opacity: 0.80,
  }), []);

  // Apply material and visibility logic
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = material;
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Extra safety: hide meshes that don't match the current gender
        const name = child.name.toLowerCase();
        if (gender === 'male' && name.includes('female')) {
          child.visible = false;
        } else if (gender === 'female' && name.includes('male')) {
          child.visible = false;
        } else {
          child.visible = true;
        }
      }
    });
  }, [scene, material, gender]);

  return (
    <group>
      <primitive 
        object={scene} 
        onDoubleClick={handleClick}
        onPointerDown={onPointerDown}
      />
      <gridHelper args={[10, 20, 0x1e293b, 0x0f172a]} position={[0, 0, 0]} />
    </group>
  );
};

// Preload both models
useGLTF.preload('/man.glb');
useGLTF.preload('/female.glb');
