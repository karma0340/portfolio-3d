import { Html, OrbitControls, Preload, useGLTF, useProgress } from "@react-three/drei";
import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";
import { useWebGLContext } from "../../hooks/useWebGLContext";


const Computers: React.FC<{ isMobile: boolean; onLoaded?: () => void }> = ({ isMobile, onLoaded }) => {
  // Correct: useGLTF must be called directly in a Canvas child
  const computer = useGLTF("/desktop_pc/scene.gltf");
  const [hasLoaded, setHasLoaded] = useState(false);
  useEffect(() => {
    if (computer.scene && !hasLoaded) {
      setHasLoaded(true);
      onLoaded?.();
    }
  }, [computer.scene, hasLoaded, onLoaded]);

  return (
    <mesh>
      <hemisphereLight intensity={0.5} groundColor="black" />
      <pointLight intensity={3} position={[0, 5, 0]} />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize={1024}
      />
      <ambientLight intensity={0.7} />
      <directionalLight intensity={1} position={[5, 5, 5]} />
      <primitive
        object={computer.scene}
        scale={isMobile ? [0.6, 0.6, 0.6] : [0.8, 0.8, 0.8]}
        position={isMobile ? [0, -1.5, -1.5] : [0, -2, -0.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { progress } = useProgress();
  const webglContext = useWebGLContext();

  // Use handleModelLoaded to track when model loads
  const handleModelLoaded = () => {
    // console.log('Computer model loaded successfully');
  };

  useEffect(() => {
    // Add a listener for changes to screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      shadows
      frameloop="always"
      dpr={[1, 2]}
      camera={{ position: [10, 3, 5], fov: 30 }}
      gl={{
        preserveDrawingBuffer: true,
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
        depth: true,
        failIfMajorPerformanceCaveat: false
      }}
      style={{ pointerEvents: 'auto', touchAction: 'none' }}
      onCreated={({ gl }) => {
        const context = gl.getContext() as WebGLRenderingContext;
        if (context && webglContext.registerContext) {
          webglContext.registerContext(context);
        }
      }}
    >
      <Suspense fallback={
        <Html center>
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-white text-2xl font-bold mb-4">
              Loading 3D Model...
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
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          maxDistance={10}
          minDistance={3}
        />
        <Computers isMobile={isMobile} onLoaded={handleModelLoaded} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

// Cache the loaded GLTF model globally for reuse
useGLTF.preload("/desktop_pc/scene.gltf");
export default ComputersCanvas;
