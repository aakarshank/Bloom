import "./style.css";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");
const overlay = document.querySelector('.scroll-overlay');
const heading = document.getElementById('heading');

window.addEventListener("mousemove", function(e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.style.transform = `translate(${posX}px, ${posY}px)`;
    cursorOutline.animate(
        {
            transform: `translate(${posX}px, ${posY}px)`
        }, { duration: 700, fill: "forwards" }
    );
});

const paragraphs = document.querySelectorAll("p");
paragraphs.forEach(paragraph => {
    paragraph.addEventListener("mouseenter", () => {
        cursorDot.style.width = "30px";
        cursorDot.style.height = "30px";
        cursorOutline.style.width = "80px";
        cursorOutline.style.height = "80px";
    });

    paragraph.addEventListener("mouseleave", () => {
        cursorDot.style.width = "10px";
        cursorDot.style.height = "10px";
        cursorOutline.style.width = "50px";
        cursorOutline.style.height = "50px";
    });

    paragraph.addEventListener("click", () => {
        const randomWebpage = getRandomWebpage();
        window.location.href = randomWebpage;
    });
});

function getRandomWebpage() {
    const webpages = [
        "https://b44ec6fa-fd01-42cb-95e4-21989bbea3da-00-qapimqkcu8p1.janeway.replit.dev/index.html"
    ];
    const randomIndex = Math.floor(Math.random() * webpages.length);
    return webpages[randomIndex];
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const myDiv = document.getElementById('container');

const bodyBgColor = getComputedStyle(document.body).backgroundColor;
const bodyColor = new THREE.Color(bodyBgColor);
renderer.setClearColor(bodyColor);

let cube;
let gltfModel;
let gltfModel2;

const rgbeLoader = new RGBELoader();
rgbeLoader.load('./HDR3.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 5; 

    const cubeGeometry = new RoundedBoxGeometry(1, 1, 1, 6, 0.1);
    const cubeMaterial = new THREE.MeshPhysicalMaterial({
        roughness: 0,
        metalness: 1,
        transmission: 1,
        ior: 1.5, 
        clearcoat: 1,
        clearcoatRoughness: 0,
        reflectivity: 1,
        envMapIntensity: 1,
        transparent: true,
        opacity: 1 
    });

    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.y = 0.1;

    cube.rotation.x = Math.PI / 4; 
    cube.rotation.y = Math.PI / 4; 
    cube.rotation.z = Math.PI / 8; 

    scene.add(cube);
});

const gltfLoader = new GLTFLoader();
gltfLoader.load('./rocket/scene.gltf', function(gltf) {
    gltfModel = gltf.scene;
    gltfModel.scale.set(0.8, 0.8, 0.8);
    gltfModel.position.set(0, 3, 0);
    gltfModel.visible = false;

    gltfModel.rotation.y = Math.PI / 4; 
    scene.add(gltfModel);
});

const gltfLoader2 = new GLTFLoader();
gltfLoader2.load('./planet_earth.glb', function(gltf) {
    gltfModel2 = gltf.scene;
    gltfModel2.scale.set(0.3, 0.3, 0.3);
    gltfModel2.position.set(0, -1.4, 0);

    gltfModel2.rotation.y = Math.PI / 4; 
    gltfModel2.traverse((node) => {
        if (node.isMesh) {
            node.material.transparent = true;
            node.material.opacity = 0;
        }
    });

    scene.add(gltfModel2);
});

camera.position.z = 1.7;

window.addEventListener('scroll', function() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (cube) {
        cube.rotation.y += 0.1;
        cube.position.x = scrollY * 0.053; 

        const maxScrollCube = 20; 
        cube.material.opacity = Math.max(0, 1 - scrollY / maxScrollCube);
    }

    if (gltfModel) {
        gltfModel.visible = true;
        gltfModel.rotation.y += 0.1;
        gltfModel.position.y = (scrollY - 20) * 0.1; 
    }

    const maxScrollHeading = 30; 
    const headingOpacity = Math.max(0, 1 - scrollY / maxScrollHeading);
    heading.style.opacity = headingOpacity;

    if (gltfModel2) {
        gltfModel2.traverse((node) => {
            if (node.isMesh) {
                const maxScroll = 70; 
                const opacity = Math.min(1, scrollY / maxScroll);
                node.material.opacity = opacity;
            }
        });
    }
});



function animate() {
    requestAnimationFrame(animate);

    if (cube) {
        cube.rotation.x += 0.0009;
        cube.rotation.y += 0.0009;
    }

    if (gltfModel2) {
        gltfModel2.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

let lastScrollTop = 0; 
const div = document.getElementById('container');

window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY || this.document.documentElement.scrollTop;

    if (scrollTop > 70)
        {
            div.style.opacity = 1;
        }
        else
        {
            div.style.opacity = 0;
        }
})

