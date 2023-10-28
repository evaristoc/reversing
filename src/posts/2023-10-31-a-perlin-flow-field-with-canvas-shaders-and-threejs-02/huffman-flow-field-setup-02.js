import {Noise3D} from './simplex-noise-function.js';

class ThreejsScene{
	constructor(width, height){
		this.renderer = new THREE.WebGLRenderer({ alpha : true });
		this.scene = new THREE.Scene();
		this.width = width;
		this.width = 200;
		this.height = height;
		this.height = 200;
		this.setSizeRenderer();
		this.setBasicPerspectiveCamera();
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
	rendererFunc: ()=>{return new THREE.WebGLRenderer({ alpha: true })},
	container: null,
	baseCanvas: null,
	baseContext: null,
	perlinCanvas: null,
	perlinContext: null,
	perlinImageData: null,
	width: 100,
	height: 200,
	circle: {
		x: null,
		y: null,
		r: null
	},

	startTime : new Date().getTime(),
	hairs: []
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

gl_FragColor = vec4(c, c, c*10., 1.0*animationTime);
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

let testScene = new ThreejsScene(200, 200).setBasicPerspectiveCamera();
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


requestAnimationFrame( renderPlane );
const container = document.querySelector('#threejs-container')
container.append(testPlane.renderer.domElement);
//paramsPlane.renderer.render( paramsPlane.scene, paramsPlane.camera );
testPlane.renderer.render(testPlane.scene, testPlane.camera);
}
renderPlane();


export {paramsPlane}
