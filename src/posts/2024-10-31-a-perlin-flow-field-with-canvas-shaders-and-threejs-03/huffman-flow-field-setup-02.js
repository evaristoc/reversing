import {Noise3D} from './simplex-noise-function.js';

class ThreejsScene{
	constructor(width, height){
		this.renderer = new THREE.WebGLRenderer({ alpha : true });
		this.scene = new THREE.Scene();
		//this.setWidthandHeight(width, height);
		this.width = 200;
		this.height = 200;
		this.setSizeRenderer();
		this.setBasicPerspectiveCamera();
	}

	setWidthandHeight(w,h){
		this.width = w;
		this.height = h;
	}

	setBasicPerspectiveCamera(){
		this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 0.1, 100);
	}

	// getBasicPerspectiveCamera(){
	// 	console.log(this.camera);
	// 	return this.camera;
	// }

	setSceneColorBackground(color){
		this.scene.background = color; 
	}

	setSizeRenderer(){
		this.renderer.setSize( this.width, this.height );
	}
	
}


class shadedPlane extends ThreejsScene{
	constructor(scene, uniforms, shaders){
		super(scene);
		this.setUniforms(uniforms);
		this.setShaders(shaders);
		this.setShadedPlane();
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

	setShadedPlane(){
		this.plane = new THREE.Mesh( this.planeGeometry(), this.shaderMaterial() );
		this.scene.add(this.plane);
	}
	
	getShadedPlane(){
		return this.plane;
	}

	// setUniformsTime(time){
	// 	this.plane.uniforms.time.value = time;
	// }

}

let paramsPlane = {
	width: 100,
	height: 200,
	startTime : new Date().getTime(),
}


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

let currentTime = 0,
timeAddition = Math.random() * 1000

paramsPlane["uniforms"] = {
time: { value: 1 + timeAddition },
resolution: { value: new THREE.Vector2(paramsPlane.width , paramsPlane.height) },
animationTime : {value : 0.0}
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

let container = document.querySelector('#threejs-container')

let testScene = new ThreejsScene(container.offsetWidth, 200);
console.log(testScene);
let testPlane = new shadedPlane(testScene, paramsPlane["uniforms"], paramsPlane["shaders"]);

testPlane.camera.position.set(0,0,10);
testPlane.plane.position.z = 0.5;

let startTime = new Date().getTime();


function renderPlane() {
var now = new Date().getTime();
var currentTime = (now - startTime) / 1000;
testPlane.uniforms.time.value = currentTime + timeAddition;
//console.log(testPlane.uniforms.time);
if(testPlane.uniforms.animationTime.value < 1.0){
	testPlane.uniforms.animationTime.value += .002;
} 

const container = document.querySelector('#threejs-container');
container.append(testPlane.renderer.domElement);
requestAnimationFrame( renderPlane );
testPlane.renderer.render(testPlane.scene, testPlane.camera);
}
renderPlane();


export {paramsPlane}
