import React, { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

const App = () => {
  useEffect(() => {
    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Camera Initial Position
    camera.position.set(5, 10, 20);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Ground Texture
    const groundTexture = new THREE.TextureLoader().load("https://images.unsplash.com/photo-1613533107646-4316a9edb900?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JvdW5kJTIwdGV4dHVyZXxlbnwwfHwwfHx8MA%3D%3D");
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(10, 10);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({ map: groundTexture })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Background Texture
    const backgroundTexture = new THREE.TextureLoader().load("https://img.freepik.com/free-photo/beautiful-view-sky-sunset-beach_158538-26143.jpg?t=st=1738912320~exp=1738915920~hmac=f6bea535bfc8f65e572f44a384a9e6ec29436623e1c581758eba9751d1b870da&w=1060");
    scene.background = backgroundTexture;

    // Stack Data Structure
    const stack = [];
    const blockHeight = 1.5;

    // Font Loader for 3D Text
    const fontLoader = new FontLoader();

    // Create a 3D Block with Text
    const createBlock = (value, yPosition) => {
      const blockGeometry = new THREE.BoxGeometry(3, 1, 3);
      const blockMaterial = new THREE.MeshStandardMaterial({ color: 0x0077ff });
      const block = new THREE.Mesh(blockGeometry, blockMaterial);
      block.position.set(0, yPosition, 0);
      block.castShadow = true;

      // Add text to the block
      fontLoader.load("/helvetiker_regular.typeface.json", (font) => {
        const textGeometry = new TextGeometry(value.toString(), {
          font: font,
          size: 0.5,
          height: 0.1,
        });
        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(-0.8, 0.3, 1.6); // Adjust text position
        block.add(text);
      });

      return block;
    };

    // Push Operation
    const pushToStack = (value) => {
      const yPosition = stack.length * blockHeight;
      const block = createBlock(value, yPosition);
      stack.push(block);
      scene.add(block);
    };

    // Pop Operation
    const popFromStack = () => {
      if (stack.length > 0) {
        const block = stack.pop();
        scene.remove(block);
      }
    };

    // Keyboard Controls
    window.addEventListener("keydown", (event) => {
      if (event.code === "KeyP") {
        const value = Math.floor(Math.random() * 100); // Random value
        pushToStack(value);
      }
      if (event.code === "KeyO") {
        popFromStack();
      }
    });

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update controls
      controls.update();

      // Render Scene
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: "absolute", top: "10px", left: "10px", color: "black" }}>
      <h1>3D Stack Visualization</h1>
      <p>Press <strong>P</strong> to Push</p>
      <p>Press <strong>O</strong> to Pop</p>
    </div>
  );
};

export default App;
