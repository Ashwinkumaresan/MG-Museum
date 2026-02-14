
import React, { useMemo, useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { ArtworkData } from '../types';
import * as THREE from 'three';

interface ArtworkProps {
  data: ArtworkData;
  isActive: boolean;
  isNearby: boolean;
}

const Artwork: React.FC<ArtworkProps> = ({ data, isActive, isNearby }) => {
  const { gl } = useThree();
  const texture = useTexture(data.imageUrl) as THREE.Texture;
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const glassMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Dynamic Dimension Calculation
  const { width, height, frameWidth, frameHeight, lampWidth } = useMemo(() => {
    const img = texture.image as HTMLImageElement;
    const aspect = img.width / img.height;

    // Constraints
    const MAX_HEIGHT = 2.6;
    const MAX_WIDTH = 4.0;

    let w = MAX_WIDTH;
    let h = w / aspect;

    if (h > MAX_HEIGHT) {
      h = MAX_HEIGHT;
      w = h * aspect;
    }

    return {
      width: w,
      height: h,
      frameWidth: w + 0.2,
      frameHeight: h + 0.2,
      lampWidth: Math.min(w * 0.8, 1.6) // Cap lamp width so it doesn't look ridiculous on huge panoramic
    };
  }, [texture]);

  // Explicit target for the spotlight to ensure it points at the artwork
  const lightTarget = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(0, 0, 0); // Center of artwork
    return obj;
  }, []);

  useFrame((state, delta) => {
    if (spotLightRef.current) {
      // Smoothly interpolate intensity based on focus state
      // Increased max intensity to 50 to ensure visibility against environment
      const targetIntensity = isActive ? 50 : 0;
      spotLightRef.current.intensity = THREE.MathUtils.lerp(
        spotLightRef.current.intensity,
        targetIntensity,
        delta * 3 // Approx 300-500ms transition
      );
    }

    if (glassMaterialRef.current) {
      // Fade glass reflections in/out
      const targetOpacity = isActive ? 0.2 : 0;
      glassMaterialRef.current.opacity = THREE.MathUtils.lerp(
        glassMaterialRef.current.opacity,
        targetOpacity,
        delta * 3
      );
    }
  });

  useEffect(() => {
    if (texture) {
      // 1. Anisotropy: Maximize for oblique viewing angles
      texture.anisotropy = gl.capabilities.getMaxAnisotropy();

      // 2. Filters: Linear filtering for smooth, high-quality scaling
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // 3. Force update
      texture.needsUpdate = true;
    }
  }, [texture, gl]);

  // Global floor is at Y = -2.5. Calculate local offset from artwork center.
  const floorOffset = -2.5 - data.position[1];
  const railingHeight = 0.8;
  const railingWidth = Math.max(3.6, width + 1.0); // Ensure railing covers wider artworks

  return (
    <group position={data.position} rotation={data.rotation}>
      {/* Add the target to the scene graph */}
      <primitive object={lightTarget} />

      <spotLight
        ref={spotLightRef}
        target={lightTarget}
        position={[0, 3, 2]} // Lower and closer for better angle
        intensity={0} // Controlled by useFrame
        distance={15}
        angle={0.6} // Slightly wider
        penumbra={0.5}
        color="#fff5e6" // Warm museum white
        castShadow
        shadow-bias={-0.0001}
      />

      {/* Frame: Modern Black Matte */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[frameWidth, frameHeight, 0.12]} />
        <meshStandardMaterial color="#050505" roughness={0.6} />
      </mesh>

      {/* Picture Light Fixture - Dynamic Position */}
      <group position={[0, frameHeight / 2, 0.1]}>
        {/* Arms connecting to frame */}
        <mesh position={[-lampWidth / 3, 0.1, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.4]} />
          <meshStandardMaterial color="#B08D55" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[lampWidth / 3, 0.1, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.4]} />
          <meshStandardMaterial color="#B08D55" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Lamp Head Cylinder */}
        <mesh position={[0, 0.1, 0.35]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, lampWidth]} />
          <meshStandardMaterial color="#B08D55" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Emissive Strip (Bulb simulation) */}
        <mesh position={[0, 0.06, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[lampWidth * 0.9, 0.06]} />
          <meshBasicMaterial color="#ffffee" />
        </mesh>
      </group>

      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Glass Layer */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          ref={glassMaterialRef}
          roughness={0.05} // Extremely smooth
          transmission={0.98} // High transmission
          thickness={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
          envMapIntensity={2} // Boost reflections
          color="#ffffff"
          transparent
          opacity={0} // Initial opacity (animated by useFrame)
        />
      </mesh>

      {/* Museum Railing - Grounded to Floor */}
      <group position={[0, floorOffset, 1.8]}>
        {/* Horizontal Bar */}
        <mesh position={[0, railingHeight, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, railingWidth]} />
          <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.2} />
        </mesh>

        {/* Left Post */}
        <mesh position={[-railingWidth / 2, railingHeight / 2, 0]}>
          <cylinderGeometry args={[0.025, 0.025, railingHeight]} />
          <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.2} />
        </mesh>

        {/* Right Post */}
        <mesh position={[railingWidth / 2, railingHeight / 2, 0]}>
          <cylinderGeometry args={[0.025, 0.025, railingHeight]} />
          <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.2} />
        </mesh>

        {/* Floor Interaction Marker - Placed exactly at floor level */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.45, 0.48, 64]} />
          <meshBasicMaterial
            color={isNearby ? "#000000" : "#333333"}
            transparent
            opacity={isNearby ? 0.8 : 0.2}
          />
        </mesh>
      </group>

      {/* Sub-label Plate - Reposition relative to new height */}
      <mesh position={[width / 2 + 0.25, -height / 2 + 0.1, 0.08]}>
        <planeGeometry args={[0.4, 0.2]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
    </group>
  );
};

export default Artwork;
