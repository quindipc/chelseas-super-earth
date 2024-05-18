"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import getStarfield from "../getStarfield";

import earthTextureImage from "../assets/00_earthmap1k.jpg";
import lightsTextureImage from "../assets/03_earthlights1k.jpg";
import cloudTextureImage from "../assets/04_earthcloudmap.jpg";

// Extract the URL of the image - note: adding this fixes the GET http://localhost:3000/[object%20Object] 404 (Not Found) problem
const earthTextureImageUrl = earthTextureImage.src;
const lightsTextureImageUrl = lightsTextureImage.src;
const cloudTextureImageUrl = cloudTextureImage.src;

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountRefCurrent = mountRef.current;
    //   Create scene
    const scene = new THREE.Scene();

    // Create camera with perspective
    const camera = new THREE.PerspectiveCamera(
      50, // FOV
      window.innerWidth / window.innerHeight,
      0.1, // Near clipping plane
      1000, // Far clipping plane
    );

    // Create a WebGL renderer and set its size
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
    scene.add(earthGroup);

    // Star background
    const stars = getStarfield();
    scene.add(stars);

    // Initialize OrbitControls to enable camera movement with mouse
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Add light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Bright white light
    directionalLight.position.set(-2, 0.5, 1.5); // Position the light
    scene.add(directionalLight);

    // Texture loading
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load(earthTextureImageUrl);
    const lightsTexture = textureLoader.load(lightsTextureImageUrl);
    const cloudTexture = textureLoader.load(cloudTextureImageUrl);

    // Creating materials & mesh
    const detail = 6;
    const geometry = new THREE.IcosahedronGeometry(1, detail);

    const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
    const earthMesh = new THREE.Mesh(geometry, earthMaterial);
    earthGroup.add(earthMesh);

    const lightsMaterial = new THREE.MeshBasicMaterial({
      map: lightsTexture,
      blending: THREE.AdditiveBlending,
      opacity: 0.4,
    });
    const lightsMesh = new THREE.Mesh(geometry, lightsMaterial);
    earthGroup.add(lightsMesh);

    const cloudMaterial = new THREE.MeshBasicMaterial({
      map: cloudTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.1,
    });
    const cloudMesh = new THREE.Mesh(geometry, cloudMaterial);
    cloudMesh.scale.setScalar(1.005);
    earthGroup.add(cloudMesh);

    camera.position.z = 5;

    // Handle animate loop function
    const animate = () => {
      requestAnimationFrame(animate);

      earthMesh.rotation.y += 0.002;
      lightsMesh.rotation.y += 0.002;
      cloudMesh.rotation.y += 0.002;

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
      mountRefCurrent?.removeChild(renderer.domElement);
      controls.dispose();
    };
  }, []);

  return (
    <div ref={mountRef}>
      <div className="mx-auto max-w-7xl p-6 lg:px-8">
        <div className="mx-auto  lg:mx-0">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Chelsea&apos;s Super Earth
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Welcome to my model of Earth. Use the mouse to rotate the Earth.
          </p>
        </div>
      </div>
    </div>
  );
}
