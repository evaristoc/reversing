import {Noise3D} from './simplex-noise-function.js';

class ThreejsScene{
	constructor(width, height){
		this.renderer = new THREE.WebGLRenderer({ alpha : true });
		this.scene = new THREE.Scene();
		this.width = width;
		this.height = height;
		this.setSizeRenderer();
		this.setBasicPerspectiveCamera();
	}

	setBasicPerspectiveCamera(){
		this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 0.1, 100);
	}

	// setSceneColorBackground(color){
	// 	this.scene.background = color; 
	// }

	setSizeRenderer(){
		this.renderer.setSize( this.width, this.height );
	}
	
}


class shadedPlane{
	constructor(width, height, uniforms, shaders){
		this.setUniforms(uniforms);
		this.setShaders(shaders);
		//this.planeGeometry = new THREE.PlaneGeometry( width, height, 32 );
		//this.shaderMaterial = this.shaderMaterialMethod();
		//this.plane = new THREE.Mesh( this.planeGeometry, this.shaderMaterial );
		this.width = width;
		this.height = height;
		this.plane = new THREE.Mesh( this.planeGeometry(), this.shaderMaterial() );
	}

	setUniforms(uniforms){
		this.uniforms = uniforms;
	}

	setShaders(shaders){
		this.shaders = shaders;
	}

	planeGeometry(){
		return new THREE.PlaneGeometry( this.width, this.height, 32 );
	}
	
	shaderMaterial(){
		return new THREE.ShaderMaterial( {
			uniforms:       this.uniforms,
			vertexShader:   this.shaders.vertex,
			fragmentShader: this.shaders.fragment,
			//blending:       THREE.AdditiveBlending,
			depthTest:      false,
			transparent:    true,
			vertexColors:   true
			});
	}


	// setUniformsTime(time){
	// 	this.plane.uniforms.time.value = time;
	// }

}


let currentTime = 0,
	timeAddition = Math.random() * 1000,
	paramsPlane = {}


paramsPlane["shaders"] = {
	fragment: `

uniform vec2 resolution;
uniform float time;
uniform float animationTime;

${Noise3D}

void main() {
float speed = 16.;
float scale = 3.5;

vec2 st = gl_FragCoord.xy/resolution.xy;
st.x *= resolution.x/resolution.y;
st *= scale;

float noise = snoise(vec3(st.x, st.y, time * speed * 0.01));
float c = (noise + 1.) / 2.;

gl_FragColor = vec4(c, c, c, 1.0*animationTime);
}

`,
	vertex: `

void main() {

gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
}

let container = document.querySelector('#threejs-container');
let testScene = new ThreejsScene(container.offsetWidth, 200); 

paramsPlane["uniforms"] = {
	time: { value: 1 + timeAddition },
	resolution: { value: new THREE.Vector2(testScene.width, testScene.height) },
	animationTime : {value : 1.0}
	}
paramsPlane["shaderMaterial"] = new THREE.ShaderMaterial( {
uniforms:       paramsPlane.uniforms,
vertexShader:   paramsPlane.shaders.vertex,
fragmentShader: paramsPlane.shaders.fragment,
//blending:       THREE.AdditiveBlending,
depthTest:      false,
transparent:    true,
vertexColors:   true
});

let testPlane = new shadedPlane(testScene.width, testScene.height, paramsPlane["uniforms"], paramsPlane["shaders"]);

testScene.camera.position.set(0,0,10);
testPlane.plane.position.z = 0.5;
testScene.scene.add(testPlane.plane);

let startTime = new Date().getTime();


function renderPlane() {
let now = new Date().getTime();
currentTime = (now - startTime) / 1000;
testPlane.uniforms.time.value = currentTime + timeAddition;

// if(testPlane.uniforms.animationTime.value < 1.0){
// 	testPlane.uniforms.animationTime.value += .002;
// } 

requestAnimationFrame( renderPlane );

const container = document.querySelector('#threejs-container');
container.append(testScene.renderer.domElement);
//console.log(testScene);
testScene.renderer.render(testScene.scene, testScene.camera);
}
renderPlane();


export {paramsPlane}
