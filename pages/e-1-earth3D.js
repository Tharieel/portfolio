// 3D-EARTH
// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// CONTAINER
const container = document.getElementById("globe-container");

// CAMERA
const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
camera.position.z = 5;
camera.lookAt(0, 0, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance"
});

renderer.setPixelRatio(1);
container.appendChild(renderer.domElement);

// RESIZE
function setSize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width, height, false);

    camera.aspect = width / height;

    camera.updateProjectionMatrix();
}

setSize();

let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setSize, 150);
});

// WIREFRAME GLOBE
const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1.8, 14, 14),
    new THREE.MeshBasicMaterial({
        color: 0xddeeff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    })
);

scene.add(globe);

// LABEL (DOM)
const labelDiv = document.getElementById("label");

// MARKERS
function createMarker(lat, lon, label, target) {

    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;

    const radius = 1.8; //sitzt auf wireframe //2 wäre etwas weiter weg

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 9, 9),
        new THREE.MeshBasicMaterial({ color: 0xff5533 })
    );

    marker.position.set(x, y, z);

    globe.add(marker);

    marker.userData = {
        label,
        target
    };

    return marker;
}

// MARKER LIST
const markers = [
    createMarker(60, -20, "Home", "#home"),
    createMarker(20, 90, "Kontakt", "#kontakt"),
    createMarker(-20, 160, "Projekte", "#projekte"),
    createMarker(-50, -60, "Blog", "#blog")
];


// RAYCASTER
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let hovered = null;
let lastRayTime = 0;

// MOUSE MOVE
container.addEventListener("mousemove", (event) => {

    const rect = container.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
});

// ANIMATION LOOP
function animate(time) {
    requestAnimationFrame(animate);

    globe.rotation.y += 0.0008;

    const obj = getHoveredObject();

    if (obj !== hovered) {

        hovered = obj;

        if (hovered) {
            labelDiv.innerText = hovered.userData.label;
            labelDiv.style.display = "block";
            document.body.style.cursor = "pointer";
        } else {
            labelDiv.style.display = "none";
            document.body.style.cursor = "default";
        }
}

// LABEL POSITION
if (hovered) {

    const pos = new THREE.Vector3();
    hovered.getWorldPosition(pos);

    pos.project(camera);

    const rect = container.getBoundingClientRect();

    const x = (pos.x * 0.5 + 0.5) * rect.width;
    const y = (-pos.y * 0.5 + 0.5) * rect.height;

    // 👉 klarer sichtbarer Offset
    const offsetX = 1;
    const offsetY = -1;

    labelDiv.style.left = (x + offsetX) + "px";
    labelDiv.style.top = (y + offsetY) + "px";
}

globe.children.forEach(marker => {
    const target = marker === hovered ? 1.8 : 1;

    marker.scale.x += (target - marker.scale.x) * 0.2;
    marker.scale.y += (target - marker.scale.y) * 0.2;
    marker.scale.z += (target - marker.scale.z) * 0.2;
});

    renderer.render(scene, camera);
}

animate(0);

function getHoveredObject() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(globe.children, false);
    return intersects.length ? intersects[0].object : null;
}