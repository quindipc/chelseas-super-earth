import * as THREE from "three";

// Define interface for the shape of the parameter object for getFresnelMat function
interface FresnelMatParams {
  rimHex?: number; // color for the rim
  facingHex?: number; // color for the facing surface
}

function getFresnelMat({ rimHex = 0x99ccff, facingHex = 0x000000 }: FresnelMatParams = {}): THREE.ShaderMaterial {
  // Define uniforms for the shader material
  const uniforms = {
    color1: { value: new THREE.Color(rimHex) },
    color2: { value: new THREE.Color(facingHex) }, 
    fresnelBias: { value: 0.1 },
    fresnelScale: { value: 1.0 },
    fresnelPower: { value: 4.0 }, 
  };

  // Vertex shader code
  const vs = `
  uniform float fresnelBias;
  uniform float fresnelScale;
  uniform float fresnelPower;
  
  varying float vReflectionFactor;
  
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  
    vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
  
    vec3 I = worldPosition.xyz - cameraPosition;
  
    vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
  
    gl_Position = projectionMatrix * mvPosition;
  }
  `;

  // Fragment shader code
  const fs = `
  uniform vec3 color1;
  uniform vec3 color2;
  
  varying float vReflectionFactor;
  
  void main() {
    float f = clamp( vReflectionFactor, 0.0, 1.0 );
    gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
  }
  `;

  // Create and return a ShaderMaterial with the defined vertex and fragment shaders
  const fresnelMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true, 
    blending: THREE.AdditiveBlending, 
    // wireframe: true, // Uncomment to enable wireframe mode for debugging
  });

  return fresnelMat;
}

export { getFresnelMat };
