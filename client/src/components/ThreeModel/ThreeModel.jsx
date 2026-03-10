import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import modelUrl from "../../assets/model.glb";

function Model(props) {
  const { scene } = useGLTF(modelUrl);
  scene.rotation.set(0.60, 0, -1);
  scene.position.set(0, 0, 0);
  return <primitive object={scene} {...props} />;
}

export default function ThreeModel() {
  return (
    <Canvas style={{ width: 400, height: 400 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 10, 7]} intensity={10} />
      <Model scale={25} />
    </Canvas>
  );
}
