"use strict";

var VIEW_ANGLE = 75, // camera constants
	ASPECT = window.innerWidth/window.innerHeight,
	NEAR = 0.1,
	FAR = 1000000;
var controls;
var pitchSpeed = 0.75, rollSpeed = 1, yawSpeed = 0.5;
var netVel = new THREE.Vector3(0, 0, -1);
var momentum = new THREE.Vector3(0, 0, 0);
var accel = new THREE.Vector3(0, 0, 0);
var planeSpeed = 10;
var vecForRot = new THREE.Vector3(0, 0, 1);
var test;
airplane.useQuaternion = true;
var axes = new THREE.AxisHelper();

// Particle generation data
var width = 20;
var rad;
var angle;

// setting up the renderer, camera, and scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
var renderer = new THREE.WebGLRenderer({ antialias:true });

camera.position.z = 300;
camera.position.y = 100;
camera.position.x = -50;
controls = new THREE.OrbitControls( camera );

// starting the renderer
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Vectors/quaternion to rotate plane
var _q1 = new THREE.Quaternion();
var axisX = new THREE.Vector3( 1, 0, 0 );
var axisZ = new THREE.Vector3( 0, 0, 1 );
	
// Textures
var textureBody = THREE.ImageUtils.loadTexture('textures/texture1.png');
var textureWing = THREE.ImageUtils.loadTexture('textures/texture2.png');
var textureEngine = THREE.ImageUtils.loadTexture('textures/template1.png');
var textureParticle = THREE.ImageUtils.loadTexture('textures/EngineExhaustParticle.png');
var textureGround = THREE.ImageUtils.loadTexture('textures/Ground.png');
alert("Loading textures . . .");
// Materials
var materialBody = new THREE.MeshLambertMaterial({ map: textureBody });
var materialEngine = new THREE.MeshLambertMaterial({ map: textureEngine, side: 2 });
var materialWing = new THREE.MeshLambertMaterial({ map: textureWing });
var materialFloorBox = new THREE.MeshBasicMaterial({ map:textureGround });

// Geometries
var cockpitGeo = new THREE.CylinderGeometry( 0.1, 25, 100, 25 );

var fuselGeo = new THREE.CylinderGeometry( 25, 25, 100, 25 );

var wingGeo = new THREE.BoxGeometry( 200, 3, 66.5 );

var engGeo = new THREE.CylinderGeometry( 25, 21, 40, 15, 1, true );

var floorBoxGeo = new THREE.BoxGeometry( 10000, 100, 10000 );

// Meshes
var floorBox = new THREE.Mesh( floorBoxGeo, materialFloorBox );
floorBox.position.y = -500;
scene.add(floorBox);

var cockpit = new THREE.Mesh( cockpitGeo, materialBody );
cockpit.position.y = 150;

var fuselage = new THREE.Mesh( fuselGeo, materialBody );
fuselage.position.y = 50;

var fuselageBack = new THREE.Mesh( fuselGeo, materialBody );
fuselageBack.position.y = -50;

var leftWing = new THREE.Mesh( wingGeo, materialWing );
leftWing.rotation.x = 1.57;
leftWing.rotation.y = 0.1;
leftWing.position.set( -120, 0, 0 );

var rightWing = new THREE.Mesh( wingGeo, materialWing );
rightWing.rotation.x = 1.57;
rightWing.rotation.y = -0.1;
rightWing.position.set( 120, 0, 0 );

var engine = new THREE.Mesh( engGeo, materialEngine );
engine.position.y = -120;

// Initializing the particles
var particles = new THREE.Geometry;
for (var p = 0; p < 2000; p++) {
	var particle = new THREE.Vector3(0,0,0);
	particles.vertices.push(particle);
}
var particleMaterial = new THREE.PointCloudMaterial({ color: 0xBB17710, map: textureParticle, size: 2});
var particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
particleSystem.sortParticles = true;

// Create the plane object, and rotate it correctly
var plane = new THREE.Object3D();
plane.add(particleSystem);
plane.add(cockpit);
plane.add(fuselage);
plane.add(fuselageBack);
plane.add(leftWing);
plane.add(rightWing);
plane.add(engine);
plane.rotation.x = -1.57;
plane.matrixAutoUpdate = false;
plane.add( axes );
scene.add(plane);

// Create an object for the camera, so you can transform it on world axes
var camObject = new THREE.Object3D();
camObject.add(camera);
scene.add(camObject);


var light = new THREE.AmbientLight( 0x303030 );
scene.add(light);
light = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
light.position.set(45,140,200);
scene.add(light);
	
// method by B1KMusic on StackOverflow
var map = [];
onkeydown = onkeyup = function(e){
	e = e || event; // to deal with IE
	map[e.keyCode] = e.type == 'keydown';
}
// To figure out if the key with keycode x is pressed, check map[x]	
	

// Rotate an object around an arbitrary axis in object space
function rotateOnAxis( object, axis, angle ) { // CHANGED
    
    _q1.setFromAxisAngle( axis, angle );
    object.quaternion.multiplySelf( _q1 );

} 

// The plane's controls
var checkPlaneControls = function() {
	if(map[79]) {
		// O
		// nothing here for now
	}
	if(map[87]) {
		// W
		rotateOnAxis(plane, xAxis, -pitchSpeed * Math.PI / 180);
	}
	if(map[83]) {
		// S
		rotateOnAxis(plane, xAxis, pitchSpeed * Math.PI / 180);
	}
	if(map[81]){
		// Q
		rotateOnAxis(plane, yAxis, -rollSpeed * Math.PI / 180);
	}
	if(map[69]){
		// E
		rotateOnAxis(plane, yAxis, rollSpeed * Math.PI / 180);
	}
	if(map[65]){
		// A
		rotateOnAxis(plane, zAxis, yawSpeed * Math.PI / 180);
	}
	if(map[68]){
		// D
		rotateOnAxis(plane, zAxis, -yawSpeed * Math.PI / 180);
	}
}

// Adjust the location of the engine's particle effect
var updateParticles = function(){
	var particleCount = particles.vertices.length;
	while (particleCount--) {
		var particle = particles.vertices[particleCount];
		particle.y -= Math.random() * 25;
		if(particle.x < 0) {
			particle.x += Math.random() * 1.5;
		} else {
			particle.x -= Math.random() * 1.5;
		}
		
		if(particle.z < 0) {
			particle.z += Math.random();
		} else {
			particle.z -= Math.random();
		}
		
		if ( particle.y <= -400 * Math.random() ) {
			// engine length is 40
			// y of 170 = end of plane's engine
			particle.y = Math.random() * 30 - 132;
			rad = Math.random() * width;
			angle = Math.random() * Math.PI * 2;
			
			particle.x = (rad*Math.cos(angle));
			particle.z = (rad*Math.sin(angle));
		}
	}
	particles.verticesNeedUpdate = true;
}

// Calculate the speed of the plane
var planeDirUpdate = function() {
	momentum.x = netVel.x/10;				// Momentum
	momentum.y = netVel.y/10;
	momentum.z = netVel.z/10;
	accel.x = vecForRot.y;					// broken
	accel.y = vecForRot.x;					// broken
	// add z handling
	netVel.x = momentum.x + accel.x;
	netVel.y = momentum.y + accel.y;
	netVel.z = momentum.z + accel.z;
}

var render = function() {
	vecForRot.applyQuaternion( plane.quaternion ); //updating plane's direction
	controls.update(); 		// calculating camera position
	checkPlaneControls(); 	// updating plane's controls
	planeDirUpdate();		// calculating plane's velocity
	updateParticles();		// moving the exhaust particles
	
	plane.position.x += netVel.x;		// Change the plane's position
	plane.position.y += netVel.y;
	plane.position.z += netVel.z;
	camObject.position.x += netVel.x;	// Move the camera's container object
	camObject.position.y += netVel.y;	// based on the movement of the plane
	camObject.position.z += netVel.z;	// (camera.position.z will move towards the plane)
	
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
render();