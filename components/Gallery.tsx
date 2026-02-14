
import React, { useRef, useState, Suspense, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Text, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { Vector3 } from 'three';
import Character from './Character';
import Artwork from './Artwork';
import { ARTWORKS, GALLERY_SIZE, GALLERY_NAME, CURATORIAL_TEXT } from '../constants';
import { ArtworkData, ControlState } from '../types';

interface GalleryProps {
  controls: ControlState;
  onArtworkFocus: (artwork: ArtworkData | null) => void;
  onNearbyStatus: (status: boolean) => void;
  focusedArtwork: ArtworkData | null;
}

const Scene: React.FC<GalleryProps> = ({ controls, onArtworkFocus, onNearbyStatus, focusedArtwork }) => {
  const { camera } = useThree();
  const playerPosRef = useRef(new Vector3(0, -1.7, 0));
  const playerRotRef = useRef(0);
  const lastToggleTime = useRef(0);
  const [nearbyArtworkId, setNearbyArtworkId] = useState<string | null>(null);

  // Interaction Logic
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const cooldown = 0.5;

    // Handle Closing
    if (focusedArtwork) {
      if ((controls.exit || controls.view) && (time - lastToggleTime.current > cooldown)) {
        onArtworkFocus(null);
        lastToggleTime.current = time;
      }
      return;
    }

    // Handle Opening
    let foundNearby = null;
    for (const art of ARTWORKS) {
      // Correct offset based on whether the art is on the front or back wall
      const offset = art.rotation[1] === Math.PI ? -1.8 : 1.8;
      const ringPos = new Vector3(art.position[0], -2.5, art.position[2] + offset);
      const dist = playerPosRef.current.clone().setY(-2.5).distanceTo(ringPos);

      if (dist < 0.8) {
        foundNearby = art;
        break;
      }
    }

    const foundId = foundNearby?.id || null;
    if (foundId !== nearbyArtworkId) {
      setNearbyArtworkId(foundId);
      onNearbyStatus(!!foundNearby);
    }

    if (foundNearby && controls.view && (time - lastToggleTime.current > cooldown)) {
      onArtworkFocus(foundNearby);
      lastToggleTime.current = time;
    }
  });

  // Camera Management - Human Perspective (First Person)
  useFrame((state, delta) => {
    const eyeLevel = -2.5 + 1.65;

    const targetCamPos = new Vector3(
      playerPosRef.current.x,
      eyeLevel,
      playerPosRef.current.z
    );

    const isMoving = controls.forward || controls.backward || controls.left || controls.right;
    if (isMoving) {
      const time = state.clock.getElapsedTime();
      targetCamPos.y += Math.sin(time * 10) * 0.02;
    }

    camera.position.lerp(targetCamPos, delta * 15);

    const direction = new Vector3();
    camera.getWorldDirection(direction);
    playerRotRef.current = Math.atan2(direction.x, direction.z);
  });

  const handleCharacterUpdate = useCallback((pos: Vector3, rot: number) => {
    playerPosRef.current.copy(pos);
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[GALLERY_SIZE.width + 10, GALLERY_SIZE.depth + 40]} />
        <meshStandardMaterial color="#eeeeee" roughness={0.8} />
      </mesh>

      {/* Hall Walls */}
      {/* Back Wall */}
      <mesh position={[0, 1, -5]} receiveShadow>
        <planeGeometry args={[GALLERY_SIZE.width, GALLERY_SIZE.height]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Front Wall */}
      <mesh position={[0, 1, 5]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[GALLERY_SIZE.width, GALLERY_SIZE.height]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-GALLERY_SIZE.width / 2, 1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, GALLERY_SIZE.height]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[GALLERY_SIZE.width / 2, 1, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, GALLERY_SIZE.height]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.5, 0]}>
        <planeGeometry args={[GALLERY_SIZE.width, 10]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Curatorial Text - Centered on the Back Wall ("Straight Wall") */}
      <group position={[0, 0.5, -4.92]}>
        {/* Wall Wash Light */}
        <spotLight
          position={[0, 4, 4]}
          target-position={[0, -1, 0]}
          intensity={15}
          angle={0.8}
          penumbra={0.6}
          color="#ffffff"
        />

        {/* Gallery Title */}
        <Text
          fontSize={0.5}
          color="black"
          maxWidth={8}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.5}
        >
          {GALLERY_NAME}
        </Text>

        {/* Decorative Separator Line */}
        <mesh position={[0, -0.6, 0.01]}>
          <planeGeometry args={[1, 0.006]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Curatorial Description */}
        <Text
          position={[0, -1.6, 0]}
          fontSize={0.12}
          color="#444444"
          maxWidth={4.5}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          lineHeight={1.7}
          letterSpacing={0.02}
        >
          {CURATORIAL_TEXT}
        </Text>

        {/* Intro Meta Info */}
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.16}
          color="#aaaaaa"
          textAlign="center"
          anchorX="center"
          letterSpacing={0.3}
        >
          @the_techys_studio Presents
        </Text>
      </group>

      {/* Artworks */}
      {ARTWORKS.map((art) => (
        <Artwork
          key={art.id}
          data={art}
          isActive={focusedArtwork?.id === art.id}
          isNearby={nearbyArtworkId === art.id}
        />
      ))}

      {/* Character */}
      <Character
        position={[0, -1.7, 0]}
        onUpdate={handleCharacterUpdate}
        moveControls={controls}
        isLocked={false}
      />

      <PointerLockControls />
    </>
  );
};

const Gallery: React.FC<GalleryProps> = (props) => {
  return (
    <div className="w-full h-full bg-[#f8f8f8]">
      <Canvas shadows dpr={window.devicePixelRatio}>
        <PerspectiveCamera makeDefault position={[0, 0.5, 0]} fov={65} />
        <Suspense fallback={null}>
          <Scene {...props} />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Gallery;
