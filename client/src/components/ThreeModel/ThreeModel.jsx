import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import modelUrl from "../../assets/model.glb";

function Model(props) {
  const { scene } = useGLTF(modelUrl);
  const ref = useRef();

  scene.position.set(0, 0, 0);

  const snapRef = useRef({ lastSnap: 0, current: 0, target: 0 });

  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (!ref.current) return;
    timeRef.current += delta;
    const t = timeRef.current;
    const snap = snapRef.current;

    if (t - snap.lastSnap > 2.2) {
      snap.lastSnap = t;
      const steps = [Math.PI / 2, Math.PI * 2 / 3, Math.PI];
      snap.target += steps[Math.floor(Math.random() * steps.length)];
    }

    snap.current += (snap.target - snap.current) * 0.18;
    ref.current.rotation.y = snap.current;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.15;
    ref.current.rotation.z = -1;
  });

  return <primitive ref={ref} object={scene} {...props} />;
}

export default function ThreeModel() {
  // Responsive: plus gros sur PC
  const isDesktop = typeof window !== "undefined" && window.innerWidth > 900;
  const canvasSize = isDesktop ? 600 : 400;
  const modelScale = isDesktop ? 3 : 3;
  return (
    <Canvas style={{ width: canvasSize, height: canvasSize }}>
      <Model scale={modelScale} />
      <ambientLight intensity={1} />
      <directionalLight position={[5, 10, 7]} intensity={10} />
    </Canvas>
  );
}