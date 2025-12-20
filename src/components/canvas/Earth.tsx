import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

const Earth = () => {
  // Correct: useGLTF must be called directly in a Canvas child
  const earth = useGLTF("/planet/scene.gltf");
  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  );
};

const EarthCanvas = () => {
  const { progress } = useProgress();

  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={1}
      gl={{
        preserveDrawingBuffer: false,
        antialias: false,
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
        depth: true,
        failIfMajorPerformanceCaveat: false
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.5;
      }}
    >
      <Suspense fallback={
        <Html center>
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-white text-2xl font-bold mb-4">
              Loading Earth Model...
            </div>
            <div className="text-white text-lg">
              {Math.round(progress)}%
            </div>
            <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </Html>
      }>
        <OrbitControls
          autoRotate
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

// Cache the loaded GLTF model globally for reuse
useGLTF.preload("/planet/scene.gltf");
export default EarthCanvas;
