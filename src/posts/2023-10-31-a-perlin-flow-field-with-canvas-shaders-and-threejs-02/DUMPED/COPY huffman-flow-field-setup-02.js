import {Noise3D} from './simplex-noise-function.js';

class ThreejsScene{
	constructor(width, height){
		this.renderer = new THREE.WebGLRenderer({ alpha : true });
		this.scene = new THREE.Scene();
		this.width = width;
		this.height = height;
	}

	setBasicPerspectiveCamera(){
		this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 0.1, 100);
	}

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
		this.plane = new THREE.Mesh( planeGeometry(), shaderMaterial() );
		this.scene.add(this.plane);
	}
	
	getShadedPlane(){
		return this.plane;
	}

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

${Noise3D}

void main() {
float speed = 16.;
float scale = 3.5;

vec2 st = gl_FragCoord.xy/resolution.xy;
st.x *= resolution.x/resolution.y;
st *= scale;

float noise = snoise(vec3(st.x, st.y, time * speed * 0.01));
float c = (noise + 1.) / 2.;

gl_FragColor = vec4(c, c, c*10., 1.0);
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

paramsPlane["scene"] = new THREE.Scene()
//camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0, 100 )
paramsPlane["renderer"] = new THREE.WebGLRenderer({ alpha: true })

paramsPlane["camera"] = new THREE.PerspectiveCamera(30, paramsPlane.width / paramsPlane.height, 0.1, 100);
//camera.position.set(0, 0, 10);
paramsPlane.scene.background = new THREE.Color(0xffffff);
paramsPlane.renderer.setSize( paramsPlane.width, paramsPlane.height )
//container.appendChild(renderer.domElement)



paramsPlane["uniforms"] = {
time: { value: 1 + timeAddition },
resolution: { value: new THREE.Vector2(paramsPlane.width , paramsPlane.height) }
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

//const light = new THREE.AmbientLight( 0x404040 ); // soft white light
//scene.add( light );

paramsPlane["geometry"] = new THREE.PlaneGeometry( paramsPlane.width, paramsPlane.height, 32 );
//const material = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
paramsPlane["plane"] = new THREE.Mesh( paramsPlane.geometry, paramsPlane.shaderMaterial );
paramsPlane.scene.add( paramsPlane.plane );

let testScene = new ThreejsScene(200, 200);
let testPlane = new shadedPlane(testScene, paramsPlane["uniforms"], paramsPlane["shaders"]);
console.log("testplane", testPlane.scene);

paramsPlane.plane.position.z = 0.5;


//camera.position.y = 0;
//camera.position.x = 0;
//camera.position.z = 100;
paramsPlane.camera.position.set(0, 0, 10);

let startTime = new Date().getTime();

function renderPlane() {
var now = new Date().getTime();
var currentTime = (now - startTime) / 1000;
paramsPlane.uniforms.time.value = currentTime + timeAddition;


requestAnimationFrame( renderPlane );
const container = document.querySelector('#threejs-container')
container.append(paramsPlane.renderer.domElement)
paramsPlane.renderer.render( paramsPlane.scene, paramsPlane.camera );
}
renderPlane();


export {paramsPlane}
