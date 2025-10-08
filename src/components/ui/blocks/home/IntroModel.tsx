"use client";
import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import gsap from "gsap";

function Loader() {
  const { progress, active } = useProgress();
  if (!active) return null;

  return (
    <Html center>
      <div className='flex flex-col items-center bg-black/70 p-6 rounded-2xl text-white text-center backdrop-blur-md shadow-lg'>
        <p className='text-lg font-semibold'>Load model...</p>

        <div className='w-40 h-2 bg-gray-600 rounded-full mt-3 overflow-hidden'>
          <div
            className='h-full bg-cyan-400 transition-all duration-200'
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className='mt-2 text-sm opacity-80'>{progress.toFixed(0)}%</span>
      </div>
    </Html>
  );
}

function Model() {
  const { scene } = useGLTF("/models/52.glb");

  useEffect(() => {
    gsap.to(scene.rotation, { y: 2 * Math.PI, repeat: -1, duration: 5, ease: "linear" });
  }, [scene]);

  return <primitive object={scene} scale={2.5} />;
}

export default function IntroModel() {
  return (
    <div className='h-screen w-full bg-transparent'>
      <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} />
        <Model />
        <OrbitControls />
        <Loader />
      </Canvas>
    </div>
  );
}
