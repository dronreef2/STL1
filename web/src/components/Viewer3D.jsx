import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls, Stage } from '@react-three/drei';

function Model({ url }) {
  // Load the STL file asynchronously
  const geom = useLoader(STLLoader, url);
  
  return (
    <mesh geometry={geom} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="orange" roughness={0.5} metalness={0.1} />
    </mesh>
  );
}

export default function Viewer3D({ modelUrl }) {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Canvas 
        shadows 
        camera={{ position: [30, 30, 30], fov: 50 }}
        gl={{ preserveDrawingBuffer: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} shadows="contact">
            <Model url={modelUrl} />
          </Stage>
        </Suspense>
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={2}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
