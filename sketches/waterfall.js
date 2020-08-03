// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.001, 10);
  camera.position.set(0, -1, -0.06);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  // const geometry = new THREE.PlaneGeometry(1, 1, 16, 16);
  const geometry = new THREE.BufferGeometry();
  const DOTS_AMOUNT = 500;
  const points = new Float32Array(DOTS_AMOUNT*DOTS_AMOUNT*3);
  for(let i = 0; i < DOTS_AMOUNT*3; i+=3) {
  	for(let j = 0; j < DOTS_AMOUNT*3; j+=3) {
  		points.set(
  			[
  				(i/(DOTS_AMOUNT*3) - 0.5)*15.,
  				(j/(DOTS_AMOUNT*3) - 0.5)*15.,
  				0.0
			],
			i*DOTS_AMOUNT+j,
		);
  	}
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));

  geometry.needsUpdate = true;

  // Setup a material
  // const material = new THREE.PointsMaterial({
  //   color: "red",
  // });

  const material = new THREE.RawShaderMaterial({
  	uniforms: {
  		time: {type: 'f', value: 0.0},
  	},
  	side: THREE.DoubleSide,
  	fragmentShader,
  	vertexShader,
  	alphaTest: 0.5,
  	transparent: true,
  	depthTest: false,
  	depthWrite: false,
  	blending: THREE.AdditiveBlending
  });

  // Setup a mesh with geometry + material
  const mesh = new THREE.Points(geometry, material);
  scene.add(mesh);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
    	material.uniforms.time.value += 0.06;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
