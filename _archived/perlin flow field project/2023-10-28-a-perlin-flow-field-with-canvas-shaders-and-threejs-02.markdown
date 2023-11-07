---
layout: post
title:  "A Perlin-like flow with canvas, shaders and three.js (Part 2)"
date:   2023-10-28 12:00:00 +0200
categories: blog update
---
<link rel="stylesheet" href="{{ site.baseurl }}{% link src/posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/huffman-flow-field-setup-02.css %}">

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

# The Code (the ```noiseCanvas``` function)

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

<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto; width:auto; padding:.2em .2em;"><table style="border: #202020;" ><tr style="border: #202020;"><td style="border: #202020;"><pre style="border: #202020; background: #202020; margin: 0; line-height: 95%">

   86
   87
  ...

  114
  115
  ...

  144
  145
  146
  147
  ...

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
  ...
</pre></td><td style="border: #202020;"><pre style="border: #202020; background: #202020; margin: 0; line-height: 95%">
<span style="color: #999999; font-style: italic">//</span>
<span style="color: #999999; font-style: italic">// Description : Array and textureless GLSL 2D/3D/4D simplex </span>
<span style="color: #999999; font-style: italic">//               noise functions.</span>
...

<span style="color: #6ab825;">float</span> <span style="color: #447fcf">snoise</span><span style="color: #d0d0d0">(vec3</span> <span style="color: #d0d0d0">v)</span>
<span style="color: #d0d0d0">{</span> 
...

<span style="color: #999999; font-style: italic">// Gradients: 7x7 points over a square, mapped onto an octahedron.</span>
<span style="color: #999999; font-style: italic">// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)</span>
<span style="color: #6ab825;">float</span> <span style="color: #d0d0d0">n_</span> <span style="color: #d0d0d0">=</span> <span style="color: #3677a9">0.142857142857</span><span style="color: #d0d0d0">;</span> <span style="color: #999999; font-style: italic">// 1.0/7.0</span>
<span style="color: #6ab825;">vec3</span>  <span style="color: #d0d0d0">ns</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">n_</span> <span style="color: #d0d0d0">*</span> <span style="color: #d0d0d0">D.wyz</span> <span style="color: #d0d0d0">-</span> <span style="color: #d0d0d0">D.xzx;</span>
...

<span style="color: #999999; font-style: italic">//Normalise gradients</span>
<span style="color: #6ab825;">vec4</span> <span style="color: #d0d0d0">norm</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">taylorInvSqrt(vec4(dot(p0,p0),</span> <span style="color: #d0d0d0">dot(p1,p1),</span> <span style="color: #d0d0d0">dot(p2,</span> <span style="color: #d0d0d0">p2),</span> <span style="color: #d0d0d0">dot(p3,p3)));</span>
<span style="color: #d0d0d0">p0</span> <span style="color: #d0d0d0">*=</span> <span style="color: #d0d0d0">norm.x;</span>
<span style="color: #d0d0d0">p1</span> <span style="color: #d0d0d0">*=</span> <span style="color: #d0d0d0">norm.y;</span>
<span style="color: #d0d0d0">p2</span> <span style="color: #d0d0d0">*=</span> <span style="color: #d0d0d0">norm.z;</span>
<span style="color: #d0d0d0">p3</span> <span style="color: #d0d0d0">*=</span> <span style="color: #d0d0d0">norm.w;</span>

<span style="color: #999999; font-style: italic">// Mix final noise value</span>
<span style="color: #6ab825;">vec4</span> <span style="color: #d0d0d0">m</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">max(</span><span style="color: #3677a9">0.6</span> <span style="color: #d0d0d0">-</span> <span style="color: #d0d0d0">vec4(dot(x0,x0),</span> <span style="color: #d0d0d0">dot(x1,x1),</span> <span style="color: #d0d0d0">dot(x2,x2),</span> <span style="color: #d0d0d0">dot(x3,x3)),</span> <span style="color: #3677a9">0.0</span><span style="color: #d0d0d0">);</span>
<span style="color: #d0d0d0">m</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">m</span> <span style="color: #d0d0d0">*</span> <span style="color: #d0d0d0">m;</span>
<span style="color: #6ab825; font-weight: bold">return</span> <span style="color: #3677a9">42.0</span> <span style="color: #d0d0d0">*</span> <span style="color: #d0d0d0">dot(</span> <span style="color: #d0d0d0">m*m,</span> <span style="color: #d0d0d0">vec4(</span> <span style="color: #d0d0d0">dot(p0,x0),</span> <span style="color: #d0d0d0">dot(p1,x1),</span> 
<span style="color: #d0d0d0">dot(p2,x2),</span> <span style="color: #d0d0d0">dot(p3,x3)</span> <span style="color: #d0d0d0">)</span> <span style="color: #d0d0d0">);</span>
<span style="color: #d0d0d0">}</span>
...
</pre></td></tr></table></div>


We showed just sections of the noise function to highlight the purposed use of gradients. Those gradients are the ones that give the flow behaviour to the noise function.

**THE SHADERS**

Shaders, as you probably know, are functions in WebGL that control the pixel properties. The ***vertex shader*** controls the geometries of the scene, and the ***fragment shader*** control the coloring at each pixel. The shaders are also written in GLSL and therefore are again provided as string:


<!-- HTML generated using hilite.me -->
<div style="background: #202020; overflow:auto; width:auto; padding:.2em .2em;"><table style="border: #202020;" ><tr style="border: #202020;"><td style="border: #202020;"><pre style="border: #202020; background: #202020; margin: 0; line-height: 103%; overflow: hidden;">189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220</pre></td><td style="border: #202020; line-height: 95%; "><pre style="border: #202020; background: #202020; margin: 0; padding:0px; overflow: hidden;">

<span style="color: #66d9ef">const</span> <span style="color: #a6e22e">shaders</span> <span style="color: #f92672">=</span> <span style="color: #f8f8f2">{</span>
      <span style="color: #a6e22e">fragment</span><span style="color: #f92672">:</span> <span style="color: #960050; background-color: #1e0010">`</span>
   </pre>
<pre style="border: #202020; background: #202020; background-color: #1e0010; margin: 0; padding: 0px; overflow: hidden;">
            <span style="color: #6ab825; font-weight: bold">uniform</span> <span style="color: #6ab825">vec2</span> <span style="color: #d0d0d0">resolution;</span>
            <span style="color: #6ab825; font-weight: bold">uniform</span> <span style="color: #6ab825">float</span> <span style="color: #d0d0d0">time;</span>

            <span style="color: #a6e22e">$</span><span style="color: #f8f8f2">{</span><span style="color: #a6e22e">Noise3D</span><span style="color: #f8f8f2">}</span>

            <span style="color: #6ab825; font-weight: bold">void</span> <span style="color: #447fcf">main</span><span style="color: #d0d0d0">()</span> <span style="color: #d0d0d0">{</span>
                <span style="color: #6ab825">float</span> <span style="color: #d0d0d0">speed</span> <span style="color: #d0d0d0">=</span> <span style="color: #3677a9">16.</span><span style="color: #d0d0d0">;</span>
                <span style="color: #6ab825">float</span> <span style="color: #d0d0d0">scale</span> <span style="color: #d0d0d0">=</span> <span style="color: #3677a9">3.5</span><span style="color: #d0d0d0">;</span>

                <span style="color: #6ab825">vec2</span> <span style="color: #d0d0d0">st</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">gl_FragCoord.xy/resolution.xy;</span>
                <span style="color: #d0d0d0">st.x</span> <span style="color: #d0d0d0">*=</span> <span style="color: #d0d0d0">resolution.x/resolution.y;</span>
                <span style="color: #d0d0d0">st</span> <span style="color: #d0d0d0">*=</span> <span style="color: #d0d0d0">scale;</span>

                <span style="color: #6ab825">float</span> <span style="color: #d0d0d0">noise</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">snoise(vec3(st.x,</span> <span style="color: #d0d0d0">st.y,</span> <span style="color: #d0d0d0">time</span> <span style="color: #d0d0d0">*</span> <span style="color: #d0d0d0">speed</span> <span style="color: #d0d0d0">*</span> <span style="color: #3677a9">0.01</span><span style="color: #d0d0d0">));</span>
                <span style="color: #6ab825">float</span> <span style="color: #d0d0d0">c</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">(noise</span> <span style="color: #d0d0d0">+</span> <span style="color: #3677a9">1.</span><span style="color: #d0d0d0">)</span> <span style="color: #d0d0d0">/</span> <span style="color: #3677a9">2.</span><span style="color: #d0d0d0">;</span>

                <span style="color: #d0d0d0">gl_FragColor</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">vec4(c,</span> <span style="color: #d0d0d0">c,</span> <span style="color: #d0d0d0">c,</span> <span style="color: #3677a9">1.</span><span style="color: #d0d0d0">);</span>
            <span style="color: #d0d0d0">}</span></pre>
            <pre style="border: #202020; background: #202020; margin: 0; padding: 0px; overflow: hidden;">   
       <span style="color: #960050; background-color: #1e0010">`</span><span style="color: #f8f8f2">,</span>
       <span style="color: #a6e22e">vertex</span><span style="color: #f92672">: </span><span style="color: #960050; background-color: #1e0010">`</span></pre>
       <pre style="border: #202020; background: #202020; background-color: #1e0010; margin: 0; padding: 0px; overflow: hidden;">

        <span style="color: #6ab825; font-weight: bold">void</span> <span style="color: #447fcf">main</span><span style="color: #d0d0d0">()</span> <span style="color: #d0d0d0">{</span>

            <span style="color: #d0d0d0">gl_Position</span> <span style="color: #d0d0d0">=</span> <span style="color: #d0d0d0">projectionMatrix</span> <span style="color: #d0d0d0">*</span> <span style="color: #d0d0d0">modelViewMatrix</span> <span style="color: #d0d0d0">*</span> <span style="color: #d0d0d0">vec4(position,</span> <span style="color: #3677a9">1.0</span><span style="color: #d0d0d0">);</span>
        <span style="color: #d0d0d0">}</span></pre>
    <pre style="border: #202020; background: #202020; margin: 0; padding:0px; overflow: hidden;"><span style="color: #960050; background-color: #1e0010">`</span>
    <span style="color: #f8f8f2">}</span></pre>
</td></tr></table></div>



Notice that the noise function is inserted within the fragment shader as a string format (**${Noise3D}**). It is here where the noise function (named **snoise**) is eventually called.

It is in the fragment shader where the action is. The final output is collected in (now deprecated) **gl_FragColor**.

> NOTE: For those who don't know much about shaders, the GLSL used to offer a built-in variable, the **gl_FragColor**, that acted as the final control of the pixel coloring output. In more recent versions of GLSL [gl_FragColor became deprecated](https://community.khronos.org/t/about-gl-fragcolor-of-fragment-shader/105102), allowing user-defined fragment shader outputs using the **out** variable qualifier.

The output of the fragment shader is based on a value "*c*", which is modified based on the noise function.

On the contrary, the code of the vertex shader is quite simple. This is because it relies on [built-in uniform variables](https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram) that will be passed from Three.js - **projectionMatrix**, **modelViewMatrix** and **position**. In the way they are set, it is like: "just render the geometry that will be defined later in the Three.js code".

**THREE.JS AND THE PLANE**

In fact, all what Darryl wanted as geometry was a plane. Building a plane in Three.js is quite simple. You just need to instantiate an scene, usually with a camera and possibly some lights, and then define the plane geometry, the material covering that geometry, then create a mesh with both of them and finally register the mesh into the scene.

In the case of Darryl's project though, the material was *the shader* containing the noise (colouring) function:

<pre>
    <code class="javascript">
<pre class="javascript" style="font-family:monospace;">...
&nbsp;
<span style="color: #660066;">let</span> width <span style="color: #339933;">=</span> container.<span style="color: #660066;">offsetWidth</span><span style="color: #339933;">,</span>
    height <span style="color: #339933;">=</span> container.<span style="color: #660066;">offsetHeight</span><span style="color: #339933;">,</span>
    currentTime <span style="color: #339933;">=</span> <span style="color: #CC0000;">0</span><span style="color: #339933;">,</span>
    timeAddition <span style="color: #339933;">=</span> <span style="">Math</span>.<span style="color: #660066;">random</span><span style="color: #009900;">&#40;</span><span style="color: #009900;">&#41;</span> <span style="color: #339933;">*</span> <span style="color: #CC0000;">1000</span>
&nbsp;
<span style="color: #000066; font-weight: bold;">const</span> scene <span style="color: #339933;">=</span> <span style="color: #000066; font-weight: bold;">new</span> THREE.<span style="color: #660066;">Scene</span><span style="color: #009900;">&#40;</span><span style="color: #009900;">&#41;</span><span style="color: #339933;">,</span>
        camera <span style="color: #339933;">=</span> <span style="color: #000066; font-weight: bold;">new</span> THREE.<span style="color: #660066;">OrthographicCamera</span><span style="color: #009900;">&#40;</span> width <span style="color: #339933;">/</span> <span style="color: #339933;">-</span> <span style="color: #CC0000;">2</span><span style="color: #339933;">,</span> width <span style="color: #339933;">/</span> <span style="color: #CC0000;">2</span><span style="color: #339933;">,</span> height <span style="color: #339933;">/</span> <span style="color: #CC0000;">2</span><span style="color: #339933;">,</span> height <span style="color: #339933;">/</span> <span style="color: #339933;">-</span> <span style="color: #CC0000;">2</span><span style="color: #339933;">,</span> <span style="color: #CC0000;">0</span><span style="color: #339933;">,</span> <span style="color: #CC0000;">100</span> <span style="color: #009900;">&#41;</span>
&nbsp;
renderer <span style="color: #339933;">=</span> <span style="color: #000066; font-weight: bold;">new</span> THREE.<span style="color: #660066;">WebGLRenderer</span><span style="color: #009900;">&#40;</span><span style="color: #009900;">&#123;</span> alpha<span style="color: #339933;">:</span> <span style="color: #003366; font-weight: bold;">true</span> <span style="color: #009900;">&#125;</span><span style="color: #009900;">&#41;</span>
&nbsp;
renderer.<span style="color: #660066;">setSize</span><span style="color: #009900;">&#40;</span> container.<span style="color: #660066;">offsetWidth</span><span style="color: #339933;">,</span> container.<span style="color: #660066;">offsetHeight</span> <span style="color: #009900;">&#41;</span>
<span style="color: #006600; font-style: italic;">//container.appendChild(renderer.domElement)</span>
...
&nbsp;
<span style="color: #006600; font-style: italic;">//(the shaderMaterial is defined just before the geometry instantiation bellow)</span>
&nbsp;
let geometry <span style="color: #339933;">=</span> <span style="color: #000066; font-weight: bold;">new</span> THREE.<span style="color: #660066;">PlaneGeometry</span><span style="color: #009900;">&#40;</span> width<span style="color: #339933;">,</span> height<span style="color: #339933;">,</span> <span style="color: #CC0000;">32</span> <span style="color: #009900;">&#41;</span><span style="color: #339933;">;</span>
let plane <span style="color: #339933;">=</span> <span style="color: #000066; font-weight: bold;">new</span> THREE.<span style="color: #660066;">Mesh</span><span style="color: #009900;">&#40;</span> geometry<span style="color: #339933;">,</span> shaderMaterial <span style="color: #009900;">&#41;</span><span style="color: #339933;">;</span>
scene.<span style="color: #660066;">add</span><span style="color: #009900;">&#40;</span> plane <span style="color: #009900;">&#41;</span><span style="color: #339933;">;</span>
plane.<span style="color: #660066;">position</span>.<span style="color: #660066;">z</span> <span style="color: #339933;">=</span> <span style="color: #CC0000;">0.5</span><span style="color: #339933;">;</span>
&nbsp;
&nbsp;
camera.<span style="color: #660066;">position</span>.<span style="color: #660066;">y</span> <span style="color: #339933;">=</span> <span style="color: #CC0000;">0</span><span style="color: #339933;">;</span>
camera.<span style="color: #660066;">position</span>.<span style="color: #660066;">x</span> <span style="color: #339933;">=</span> <span style="color: #CC0000;">0</span><span style="color: #339933;">;</span>
camera.<span style="color: #660066;">position</span>.<span style="color: #660066;">z</span> <span style="color: #339933;">=</span> <span style="color: #CC0000;">100</span><span style="color: #339933;">;</span>
&nbsp;
...</pre>
    </code>
</pre>

```javascript
12 let shaderMaterial = new THREE.ShaderMaterial( {
13    uniforms:       uniforms,
14    vertexShader:   shaders.vertex,
15    fragmentShader: shaders.fragment,
16    //blending:       THREE.AdditiveBlending,
17    depthTest:      false,
18    transparent:    true,
19    vertexColors:   true
20 });
```


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
{% highlight javascript %}
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

{% endhighlight %}

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

# Tada!

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

If you reviewed the code you might have notice that the Three.js renderer and plane had dimensions but that they were not added to any HTML element. That was made on purpose by the author - the apparent changes on the texture of the Three.js plane should stay invisible to the observer.

If you are interested in seeing how the noise function behaves, I have revealed the function by adding it to an HTML element:

<div id="threejs-container"></div>

<script src="{{ site.baseurl }}{% link src/vendor/js/threejs/v104/three.v104.min.js %}"></script>
<script src="{{ site.baseurl }}{% link src/posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02.js %}"></script>
<script type="module" src="{{ site.baseurl }}{% link src/posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/huffman-flow-field-setup-02.js %}"></script>

# So... What did we learn from this code?

In this second part of our analysis of the Darryl Huffman's "Perlin Flow Field" we got the basic ideas of the use of shaders and noise functions in combination with Three.js. We are also unveiling a couple facts, like keeping the noise function invisible to the observer.

In fact, Darryl kept that invisible because his only interest was to extract values from the noise function without showing the graphics, giving this idea of "invisible force" affecting the movement of the "hairs" rendered on the "context" canvas.

However, he needed a way to extract the values from the invisible noise function into the visible canvas. There is a common trick used for that, using again the canvas API as adapter. We will go through it in a third and last post about Darryl's pen.

 For now, happy coding!

