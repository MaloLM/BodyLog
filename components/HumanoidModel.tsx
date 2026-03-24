
import React, { useMemo, useEffect } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface HumanoidModelProps {
  gender: 'male' | 'female';
  wireframe?: boolean;
  onBodyClick: (position: [number, number, number]) => void;
  onPointerDown?: (e: ThreeEvent<MouseEvent>) => void;
  onBoundsComputed?: (height: number) => void;
}

export const HumanoidModel: React.FC<HumanoidModelProps> = ({ gender, wireframe = false, onBodyClick, onPointerDown, onBoundsComputed }) => {
  const modelPath = gender === 'male' ? '/man.glb' : '/female.glb';
  const { scene } = useGLTF(modelPath);

  const offset = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    return new THREE.Vector3(-center.x, -box.min.y, -center.z);
  }, [scene]);

  const modelHeight = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    return box.max.y - box.min.y;
  }, [scene]);

  useEffect(() => {
    if (onBoundsComputed) {
      onBoundsComputed(modelHeight);
    }
  }, [modelHeight, onBoundsComputed]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta < 5) {
       onBodyClick([e.point.x, e.point.y, e.point.z]);
    }
  };

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: wireframe ? '#64748b' : '#334155',
    roughness: 0.4,
    metalness: 0.3,
    transparent: true,
    opacity: wireframe ? 0.3 : 0.8,
    wireframe,
  }), [wireframe]);

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
      <group position={[offset.x, offset.y, offset.z]}>
        <primitive
          object={scene}
          onDoubleClick={handleClick}
          onPointerDown={onPointerDown}
        />
      </group>
      <gridHelper args={[10, 20, 0x1e293b, 0x0f172a]} position={[0, 0, 0]} />
    </group>
  );
};

// Preload both models
useGLTF.preload('/man.glb');
useGLTF.preload('/female.glb');
