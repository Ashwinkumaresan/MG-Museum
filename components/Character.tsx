
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Group } from 'three';
import * as THREE from 'three';

interface CharacterProps {
  position: [number, number, number];
  onUpdate: (pos: Vector3, rotation: number) => void;
  moveControls: { forward: boolean; backward: boolean; left: boolean; right: boolean };
  isLocked: boolean;
  onReset?: () => void;
}

const Character: React.FC<CharacterProps> = ({ position, onUpdate, moveControls, isLocked }) => {
  const { camera } = useThree();
  const groupRef = useRef<Group>(null);
  const velocity = useRef(new Vector3());
  const speed = 0.08;
  const acceleration = 0.3;
  const friction = 0.85;

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#000000',
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 1
  }), []);

  useFrame((state, delta) => {
    if (!groupRef.current || isLocked) return;

    // Movement relative to camera perspective (The 'Human' way)
    const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    
    forward.y = 0;
    right.y = 0;
    forward.normalize();
    right.normalize();

    const moveVector = new Vector3(0, 0, 0);
    if (moveControls.forward) moveVector.add(forward);
    if (moveControls.backward) moveVector.sub(forward);
    if (moveControls.left) moveVector.sub(right);
    if (moveControls.right) moveVector.add(right);

    if (moveVector.length() > 0) {
      moveVector.normalize().multiplyScalar(speed);
      velocity.current.lerp(moveVector, acceleration);
      
      // Face the direction of camera (Human perspective)
      const camDir = new Vector3();
      camera.getWorldDirection(camDir);
      const targetRotation = Math.atan2(camDir.x, camDir.z);
      groupRef.current.rotation.y = targetRotation;
    } else {
      velocity.current.multiplyScalar(friction);
    }

    // Apply velocity
    groupRef.current.position.add(velocity.current);

    // Collision Boundaries (Museum Hall)
    groupRef.current.position.x = Math.max(-14.5, Math.min(14.5, groupRef.current.position.x));
    groupRef.current.position.z = Math.max(-4.5, Math.min(4.5, groupRef.current.position.z));

    // Fix Y to floor
    groupRef.current.position.y = -2.5 + 0.8; 

    // Notify parent of position
    onUpdate(groupRef.current.position, groupRef.current.rotation.y);
    
    // Hide character when camera is too close (Standard FP behavior)
    const distToCam = camera.position.distanceTo(groupRef.current.position);
    material.opacity = THREE.MathUtils.smoothstep(distToCam, 0.5, 1.5);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Scribble Humanoid Parts */}
      <mesh position={[0, 0.7, 0]} material={material}>
        <sphereGeometry args={[0.22, 16, 16]} />
      </mesh>
      <mesh position={[0, 0.1, 0]} material={material}>
        <capsuleGeometry args={[0.2, 0.7, 4, 8]} />
      </mesh>
      
      {/* Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.79, 0]}>
        <circleGeometry args={[0.45, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export default Character;
