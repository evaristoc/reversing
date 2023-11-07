---
layout: post
title:  "A Perlin-like flow with canvas, shaders and three.js (Part 2)"
date:   2023-10-28 12:00:00 +0200
categories: blog update
---
<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/huffman-flow-field-setup-02.css %}">
<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/styles/table-code-highlight.css %}">

# Revealing the Noise

In a [previous post]({{site.baseurl}}{% link _posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01.markdown %}) we were revealing how Darryl Huffman worked the figure that will be affected by the animation on his "Perlin Flow Field".

As a reminder, this is again a link to Darryl's work:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="vwmYgz" data-user="darrylhuffman" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/darrylhuffman/pen/vwmYgz">
  Perlin Flow Field</a> by Darryl Huffman (<a href="https://codepen.io/darrylhuffman">@darrylhuffman</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

In this post we will have a look at the noise function.

# The Code (the **noiseCanvas** function)

In the previous post we separated Darryl's code into three sections:

- The "context" canvas and the Hair class
- The noise function, the *shader* and the Three.js plane geometry
- The interaction between the texture (aka Garryl's "perlinCanvas") and the "context" canvas.

Our focus is the second one. In the Darryl's pen all the functionalities for the rendering of the GLSL features were enclosed in the **noiseCanvas** function.

**THE NOISE FUNCTION**

For this project, Garryl Huffman made use of a *noise function*, which could be quickly derived from the name of the pen. "Perlin" is in fact the surname of [Ken Perlin](https://en.wikipedia.org/wiki/Ken_Perlin), the developer of a [noise function that bears his name](https://en.wikipedia.org/wiki/Perlin_noise) and that has been very influential to the digital graphics industry since its introduction in 1983.

It is worth noting though that Garry Huffman might have used the wrong reference to name his pen. By reading the code in the pen you would notice that the noise function used by Garryl is actually authored by Ian McEwan who refers to it as a ***simplex*** noise function. The [simplex noise function](https://en.wikipedia.org/wiki/Simplex_noise) was an improved algorithm made by the same Ken Perlin over its classic Perlin noise. The [simplex noise function by Ian McEwan](https://github.com/ashima/webgl-noise/blob/master/src/noise4D.glsl), in collaboration with [Stefan Gustavson](https://github.com/stegu), is actually one of the several efforts to improve the Perlin's *simplex* noise function.

Now, I won't extend about the noise function here. If you are still looking for a good explanation of noise functions and a clarification of how the Perlin noise differs from the simplex noise I will strongly recommend this [excellent chapter of "The Book of Shaders"](https://thebookofshaders.com/11/). Part of the work made by Ian McEwan and Stefan Gustavson can be found at the (apparently defunt) [Ashima Arts repository](https://github.com/ashima/webgl-noise) or even in recent articles, like [this scientific article dated 2022](https://jcgt.org/published/0011/01/02/paper.pdf).

The noise function is written in [GLSL](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)), which is the default C-style language used to communicate with the openGL graphics API, which is the one associated with the WebGL API. In the Darryl's pen the GLSL script of the noise function is given as a string in the Javascript code:

<div class="codetable-wrap" style="width:auto; overflow-x: auto;">
<table>
<colgroup>
<col width="5%" />
<col width="95%" />
</colgroup>
<tbody>
<tr>
<td style="padding:0px; position:sticky; left:0; opacity:0.70;">
<div class="language-javascript highlighter-rouge">
<div class="highlight" style="margin:0px">
<pre class="highlight" style="margin:0px;">
<code>
 84
 85
 86
 87
...

113
114
115
...

143
144
145
146
...

174
175
176
177
178
179
180
181
182
183
184
185
186
187
188
</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge">
<div class="highlight" style="margin:0px;">
<pre class="highlight" style="margin:0px;">
<code>
	<span class="kd">let</span> <span class="nx">Noise3D</span> <span class="o">=</span> <span class="s2">`
//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
...

float snoise(vec3 v)
{ 
const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
...

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
float n_ = 0.142857142857; // 1.0/7.0
vec3  ns = n_ * D.wyz - D.xzx;
...

//Normalise gradients
vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
p0 *= norm.x;
p1 *= norm.y;
p2 *= norm.z;
p3 *= norm.w;

// Mix final noise value
vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
m = m * m;
return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
dot(p2,x2), dot(p3,x3) ) );
}
`</span>

</code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>

There is a lot a comments here. The idea is to hightlight the **snoise** function (line 113 in original code). I also showed just sections of the noise function to highlight the purposed use of gradients: those gradients are the ones that give the flow behaviour to the noise function.

**THE SHADERS**

Shaders, as you probably know, are functions in WebGL that control the pixel properties. The ***vertex shader*** controls the geometries of the scene, and the ***fragment shader*** control the coloring at each pixel. The shaders are also written in GLSL and therefore are again provided as string:

```javascript
...

const shaders = {
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

            gl_FragColor = vec4(c, c, c, 1.);
            }

    `,
    vertex: `

        void main() {

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `
}

```

Notice that the noise function is inserted within the fragment shader as a string format (**${Noise3D}**). It is here where the noise function (named **snoise**) is eventually called.

It is in the fragment shader where the action is. The final output is collected in (now deprecated) **gl_FragColor**.

> NOTE: For those who don't know much about shaders, the GLSL used to offer a built-in variable, the **gl_FragColor**, that acted as the final control of the pixel coloring output. In more recent versions of GLSL [gl_FragColor became deprecated](https://community.khronos.org/t/about-gl-fragcolor-of-fragment-shader/105102), allowing user-defined fragment shader outputs using the **out** variable qualifier.

The output of the fragment shader is based on a value "*c*", which is modified based on the noise function.

On the contrary, the code of the vertex shader is quite simple. This is because it relies on [built-in uniform variables](https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram) that will be passed from Three.js - **projectionMatrix**, **modelViewMatrix** and **position**. In the way they are set, it is like: "just render the geometry that will be defined later in the Three.js code".

**THREE.JS AND THE PLANE**

In fact, all what Darryl wanted as geometry was a plane. Building a plane in Three.js is quite simple. You just need to instantiate an scene, usually with a camera and possibly some lights, and then define the plane geometry, the material covering that geometry, then create a mesh with both of them and finally register the mesh into the scene.

In the case of Darryl's project though, the material was *the shader* containing the noise (colouring) function:

```javascript
...

let width = container.offsetWidth,
    height = container.offsetHeight,
    currentTime = 0,
    timeAddition = Math.random() * 1000

const scene = new THREE.Scene(),
        camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0, 100 )

renderer = new THREE.WebGLRenderer({ alpha: true })

renderer.setSize( container.offsetWidth, container.offsetHeight )
//container.appendChild(renderer.domElement)
...

//(the shaderMaterial is defined just before the geometry instantiation bellow)

let geometry = new THREE.PlaneGeometry( width, height, 32 );
let plane = new THREE.Mesh( geometry, shaderMaterial );
scene.add( plane );
plane.position.z = 0.5;


camera.position.y = 0;
camera.position.x = 0;
camera.position.z = 100;

...

```

**THE MATERIAL OF THE PLANE**

There is something important when coding with WebGL - you need some way to pass data from outside the shader to the GLSL shader context. The way that is done is through ***uniforms***, which are special GLSL variable qualifiers to identify exactly those variables that could act as inputs.

```javascript
...

let uniforms = {
    time: { value: 1 + timeAddition },
    resolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) }
}

...
```

The uniform that will be important for Darryl's code is the **time** uniform. It will set the pace of the advance of the color of the pixels along the gradient of the noise function. 

Having the corresponding uniforms and the shaders allow for the construction of the Three.js's shader Material instance, named **shaderMaterial** in the code. The shader material is defined a few lines before the instantiation of the plane geometry and right after the uniforms. 

```javascript
...

let shaderMaterial = new THREE.ShaderMaterial( {
    uniforms:       uniforms,
    vertexShader:   shaders.vertex,
    fragmentShader: shaders.fragment,
    //blending:       THREE.AdditiveBlending,
    depthTest:      false,
    transparent:    true,
    vertexColors:   true
});

...
```

**THE RENDER FUNCTION**

In the Darryl's project, the **noiseCanvas** function ended with the **render** function. The render function updates the graphics using the **requestAnimationFrame** but before the rendering the **time** uniform is updated.

```javascript
...
    //these variables were instantiated high in the code, under the shaders
    currentTime = 0,
    timeAddition = Math.random() * 1000
...

function render() {
    var now = new Date().getTime();
    currentTime = (now - startTime) / 1000;
    uniforms.time.value = currentTime + timeAddition;

    requestAnimationFrame( render );
    renderer.render( scene, camera );
}
render();
...
```

The value of the **time** uniform is increased at each rendering frame using a simple implemantion based on the system clock.

# Tada!

If you reviewed the code you might have notice that the Three.js renderer and plane had dimensions but that they were not added to any HTML element. That was made on purpose by the author - the apparent changes on the texture of the Three.js plane should stay invisible to the observer.

If you are interested in seeing how the noise function behaves, I have revealed the function by adding it to an HTML element:

<div id="threejs-container"></div>

<script src="{{ site.baseurl }}{% link mngassets/vendor/js/threejs/v104/three.v104.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02.js %}"></script>
<script type="module" src="{{ site.baseurl }}{% link mngassets/posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/huffman-flow-field-setup-02.js %}"></script>

# So... What did we learn from this code?

In this second part of our analysis of the Darryl Huffman's "Perlin Flow Field" we got the basic ideas of the use of shaders and noise functions in combination with Three.js. We are also unveiling a couple facts, like keeping the noise function invisible to the observer.

In fact, Darryl kept that invisible because his only interest was to extract values from the noise function without showing the graphics, giving this idea of "invisible force" affecting the movement of the "hairs" rendered on the "context" canvas.

However, he needed a way to extract the values from the invisible noise function into the visible canvas. There is a common trick used for that, using again the canvas API as adapter. We will go through it in a third and last post about Darryl's pen.

 For now, happy coding!

