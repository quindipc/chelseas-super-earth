"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import earthTextureImage from "../assets/00_earthmap1k.jpg";
// Extract the URL of the image - note: adding this fixes the GET http://localhost:3000/[object%20Object] 404 (Not Found) problem
const earthTextureImageUrl = earthTextureImage.src;


export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //   Create scene
    const scene = new THREE.Scene();

    // Create camera with perspective
    const camera = new THREE.PerspectiveCamera(
      75, // FOV
      window.innerWidth / window.innerHeight,
      0.1, // Near clipping plane
      1000, // Far clipping plane
    );

    // Create a WebGL renderer and set its size
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    // Initialize OrbitControls to enable camera movement with mouse
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Add light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Bright white light
    directionalLight.position.set(5, 5, 5); // Position the light
    scene.add(directionalLight);

    // Texture loading
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(earthTextureImageUrl);

    // Creating geometry, material, mesh
    const geometry = new THREE.IcosahedronGeometry(1, 12);
    const material = new THREE.MeshStandardMaterial({ map: earthTexture });
    const earthMesh = new THREE.Mesh(geometry, material);
    scene.add(earthMesh);

    camera.position.z = 5;

    // Handle animate loop function
    const animate = () => {
      requestAnimationFrame(animate);

      earthMesh.rotation.x += 0.001;
      earthMesh.rotation.y += 0.002;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resizing
    const handleWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      mountRef.current?.removeChild(renderer.domElement);
      controls.dispose();
    };
  }, []);

  return (
    <div ref={mountRef}>
      <div className="mx-auto max-w-7xl p-6 lg:px-8">
        <div className="mx-auto  lg:mx-0">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Chelsea's Earth
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
      </div>
    </div>
  );
}
