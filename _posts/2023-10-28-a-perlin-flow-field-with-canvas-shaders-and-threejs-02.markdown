---
layout: post
title:  "A Perlin-like flow with canvas, shaders and three.js (Part 2)"
date:   2023-10-28 12:00:00 +0200
categories: blog update
---
<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/huffman-flow-field-setup-02.css %}">
<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/styles/table-code-highlight.css %}">

In a [previous post]({{site.baseurl}}{% link _posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01.markdown %}) we discussed how Darryl Huffman created the figure on his "Perlin Flow Field" that will be affected by the animation.

This is again a link to Darryl's work:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="vwmYgz" data-user="darrylhuffman" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/darrylhuffman/pen/vwmYgz">
  Perlin Flow Field</a> by Darryl Huffman (<a href="https://codepen.io/darrylhuffman">@darrylhuffman</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

Darryl utilized the 2D graphics canvas API, Three.js (the 3D graphics library), and GLSL shaders. The way all those graphic tools were made to work together was something that piqued my curiosity. In an attemp to determine how Darryl obtained that result, I made some basic reverse engineering.

One thing I found nice from Darryl's project was his use of a **noise function** for the animation. 

Adding noise with shaders is very nice!

Yeah... But let's be honest - unless you truly understand shaders and what those noise functions do, it might be very challenging to programatically get the required effect.

In this post we will have an helicopter view at the noise function.

# The Code (the **noiseCanvas** function)

In the previous post we separated Darryl's code into three sections:

- The "context" canvas and the Hair class
- The noise function, the *shader* and the Three.js plane geometry
- The interaction between the texture (aka Garryl's "perlinCanvas") and the "context" canvas.

Our focus is the second one. The **noiseCanvas** function in Darryl's pen contained all of the functionality needed to render the GLSL graphics.

**THE NOISE FUNCTION**

For this project, Garryl Huffman utilized a *noise function*, which could be quickly derived from the name of the pen. "Perlin" is in fact the surname of [Ken Perlin](https://en.wikipedia.org/wiki/Ken_Perlin), the developer of a [noise function that bears his name](https://en.wikipedia.org/wiki/Perlin_noise), which has had a significant impact on the digital graphics sector since its introduction in 1983.

However, it is worth noting that Garry Huffman may have given an inappropiate name to his pen. By reading the javascript code of his pen, you would notice that the noise function used by Garryl is actually authored by Ian McEwan who refers to it as a ***simplex*** noise function. The [simplex noise function](https://en.wikipedia.org/wiki/Simplex_noise) was an improved algorithm made by the same Ken Perlin over its classic Perlin noise. The [simplex noise function by Ian McEwan](https://github.com/ashima/webgl-noise/blob/master/src/noise4D.glsl), in collaboration with [Stefan Gustavson](https://github.com/stegu), is actually one of the several efforts to improve the Perlin's *simplex* noise function.

Now, I won't extend about the noise function here. If you are still looking for a good explanation of noise functions and a clarification of how the Perlin noise differs from the simplex noise I will strongly recommend this [excellent chapter of "The Book of Shaders"](https://thebookofshaders.com/11/). Part of the work made by Ian McEwan and Stefan Gustavson can be found at the (apparently defunt) [Ashima Arts repository](https://github.com/ashima/webgl-noise) or even in recent articles, like [this scientific article dated 2022](https://jcgt.org/published/0011/01/02/paper.pdf).

The noise function is written in [GLSL](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)), which is the default C-style language used to communicate with the [openGL graphics API](https://www.khronos.org/opengles/), which is the base of the [WebGL API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL), the openGL for the web. In the Darryl's pen the GLSL script of the noise function is given as a string in the Javascript code:

<div class="codetable-wrap" style="width:auto; overflow-x: auto;">
<table>
<colgroup>
<col width="5%" />
<col width="95%" />
</colgroup>
<tbody>
<tr>
<td style="padding:0px; position:sticky; left:0; opacity:0.70;">
<div class="language-javascript highlighter-rouge col01">
<div class="highlight" style="margin:0px">
<pre class="highlight col01" style="margin:0px;">
<code class="col01">
 84
 85
 86
 87
...

<span style="color:yellow;">113 </span>
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
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02">
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

The syntax of the simplex function is around 100 lines long so there is a lot of excluded lines here. I wanted only to hightlight the **snoise** function (line 113 in Darryl's code). Notice the purposed use of gradients: those gradients are the ones that give the flow behaviour to the noise function.

**THE SHADERS**

Shaders, as you probably know, are functions in openGL / WebGL that control the pixel properties. The ***vertex shader*** controls the geometries of the scene, and the ***fragment shader*** control the coloring at each pixel. The shaders are also written in GLSL and therefore are again provided as string:

<div class="codetable-wrap" style="width:auto; overflow-x: auto;">
<table>
<colgroup>
<col width="5%" />
<col width="95%" />
</colgroup>
<tbody>
<tr>
<td style="padding:0px; position:sticky; left:0; opacity:0.70;">
<div class="language-javascript highlighter-rouge col01">
<div class="highlight" style="margin:0px">
<pre class="highlight col01" style="margin:0px;">
<code class="col01">
...
190
191
192
193
194
195
<span style="color:yellow;">196 </span>
197
198
199
200
201
202
203
204
205
<span style="color:yellow;">206 </span>
207
208
<span style="color:yellow;">209 </span>
210
211
212
213
214
215
216
<span style="color:yellow;">217 </span>
218
219
220
221
...
</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02">
...
	<span class="kd">const</span> <span class="nx">shaders</span> <span class="o">=</span> <span class="p">{</span>
		<span class="na">fragment</span><span class="p">:</span> <span class="s2">`

uniform vec2 resolution;
uniform float time;

</span><span class="p">${</span><span class="nx" >Noise3D</span><span class="p">}</span><span class="s2">

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

`</span><span class="p">,</span>
		<span class="na">vertex</span><span class="p">:</span> <span class="s2">`

void main() {

gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`</span>
	<span class="p">}</span>

...
</code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>

Notice that the simplex function is inserted within the fragment shader as a string format (**${Noise3D}**). It is here, in the fragment shader, where the noise function (**snoise**) would be eventually used.

In fact, it is in the fragment shader where the action takes place. Large part of that action is finally collected in a variable "c" as a single value, which is then used to set the final output collected as **gl_FragColor**. (*OBSERVATION: recent versions of GLSL are not forcing anymore the use of the **gl_FragColor** as fragment shader output, but rather allowing [user-defined fragment shader outputs](https://community.khronos.org/t/about-gl-fragcolor-of-fragment-shader/105102)*)

On the contrary, the code of the vertex shader is rather less "turbulent". It relies fully on [built-in uniform variables](https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram) that will be passed from Three.js - **projectionMatrix**, **modelViewMatrix** and **position**. In the way they are set in Darryl's code it is like saying: "just render the geometry that will be defined in the Three.js code as it is".

**THREE.JS AND THE PLANE**

And all what Darryl wanted as geometry was just a simple plane. Building a plane in Three.js is quite simple. You just need to instantiate an scene, usually with a camera and possibly some lights, make a renderer available, and then define the plane geometry, the material covering that geometry, then create a mesh with both of them and finally register the mesh into the scene.

<div class="codetable-wrap" style="width:auto; overflow-x: auto;">
<table>
<colgroup>
<col width="5%" />
<col width="95%" />
</colgroup>
<tbody>
<tr>
<td style="padding:0px; position:sticky; left:0; opacity:0.70;">
<div class="language-javascript highlighter-rouge col01">
<div class="highlight" style="margin:0px">
<pre class="highlight col02" style="margin:0px;">
<code class="col01">...
223
224
225
226
227
<span style="color:yellow;">228</span>
<span style="color:yellow;">229</span>
230
<span style="color:yellow;">231</span>
232
233
234
...

252
<span style="color:yellow;">253</span>
<span style="color:yellow;">254</span>
<span style="color:yellow;">255</span>
256
257
258
259
260
261
...
</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02">    ...
	<span class="kd">let</span> <span class="nx">width</span> <span class="o">=</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetWidth</span><span class="p">,</span>
	    <span class="nx">height</span> <span class="o">=</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetHeight</span><span class="p">,</span>
	    <span class="nx">currentTime</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span>
	    <span class="nx">timeAddition</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">random</span><span class="p">()</span> <span class="o">*</span> <span class="mi">1000</span>

	<span class="kd">const</span> <span class="nx">scene</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">Scene</span><span class="p">(),</span>
		 <span class="nx">camera</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">OrthographicCamera</span><span class="p">(</span> <span class="nx">width</span> <span class="o">/</span> <span class="o">-</span> <span class="mi">2</span><span class="p">,</span> <span class="nx">width</span> <span class="o">/</span> <span class="mi">2</span><span class="p">,</span> <span class="nx">height</span> <span class="o">/</span> <span class="mi">2</span><span class="p">,</span> <span class="nx">height</span> <span class="o">/</span> <span class="o">-</span> <span class="mi">2</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="mi">100</span> <span class="p">)</span>
	
	<span class="nx">renderer</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">WebGLRenderer</span><span class="p">({</span> <span class="na">alpha</span><span class="p">:</span> <span class="kc">true</span> <span class="p">})</span>

	<span class="nx">renderer</span><span class="p">.</span><span class="nx">setSize</span><span class="p">(</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetWidth</span><span class="p">,</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetHeight</span> <span class="p">)</span>
	<span class="c1">//container.appendChild(renderer.domElement)</span>
    ...


	<span class="kd">let</span> <span class="nx">geometry</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">PlaneGeometry</span><span class="p">(</span> <span class="nx">width</span><span class="p">,</span> <span class="nx">height</span><span class="p">,</span> <span class="mi">32</span> <span class="p">);</span>
	<span class="kd">let</span> <span class="nx">plane</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">Mesh</span><span class="p">(</span> <span class="nx">geometry</span><span class="p">,</span> <span class="nx">shaderMaterial</span> <span class="p">);</span>
	<span class="nx">scene</span><span class="p">.</span><span class="nx">add</span><span class="p">(</span> <span class="nx">plane</span> <span class="p">);</span>
	<span class="nx">plane</span><span class="p">.</span><span class="nx">position</span><span class="p">.</span><span class="nx">z</span> <span class="o">=</span> <span class="mf">0.5</span><span class="p">;</span>


	<span class="nx">camera</span><span class="p">.</span><span class="nx">position</span><span class="p">.</span><span class="nx">y</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
	<span class="nx">camera</span><span class="p">.</span><span class="nx">position</span><span class="p">.</span><span class="nx">x</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
	<span class="nx">camera</span><span class="p">.</span><span class="nx">position</span><span class="p">.</span><span class="nx">z</span> <span class="o">=</span> <span class="mi">100</span><span class="p">;</span>
    ...
</code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>

Until here all very simple. In the case of Darryl's project though, the material of the plane was the shader. Furthermore, a *dynamically changing* shader material.

**THE MATERIAL OF THE PLANE**

If you see how Darryl added the shader material to the plane using Three.js, you might agree that adding a shader material to a Three.js mesh is fairly simple. This is simpler if the shader material doesn't involve any dynamic changes, being rather a *static* material. But what if you would like the material to change based on values that change in your javascript code?

For that, you need some way to pass data from outside the shader to the GLSL shader context. The way that is done is through ***uniforms***, which are special GLSL variables that could act as inputs/outputs that communicate with scopes external to GLSL.

<div class="codetable-wrap" style="width:auto; overflow-x: auto;">
<table>
<colgroup>
<col width="5%" />
<col width="95%" />
</colgroup>
<tbody>
<tr>
<td style="padding:0px; position:sticky; left:0; opacity:0.70;">
<div class="language-javascript highlighter-rouge col01">
<div class="highlight" style="margin:0px">
<pre class="highlight col01" style="margin:0px;">
<code class="col01">...
237
238
<span style="color:yellow;">239</span>
240
241
242
...</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02"><span class="p">...</span>

<span class="kd">let</span> <span class="nx">uniforms</span> <span class="o">=</span> <span class="p">{</span>
    <span class="na">time</span><span class="p">:</span> <span class="p">{</span> <span class="na">value</span><span class="p">:</span> <span class="mi">1</span> <span class="o">+</span> <span class="nx">timeAddition</span> <span class="p">},</span>
    <span class="na">resolution</span><span class="p">:</span> <span class="p">{</span> <span class="na">value</span><span class="p">:</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">Vector2</span><span class="p">(</span><span class="nx">container</span><span class="p">.</span><span class="nx">offsetWidth</span><span class="p">,</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetHeight</span><span class="p">)</span> <span class="p">}</span>
<span class="p">}</span>

<span class="p">...</span></code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>

The uniform that will be important for Darryl's code is the **time** uniform. The **time** will set the pace of the advance of the color of the pixels along the gradient of the noise function. 

Having the corresponding uniforms and the shaders complete the construction of the Three.js's shader Material instance, named **shaderMaterial** in the code. 

<div class="codetable-wrap" style="width:auto; overflow-x: auto;">
<table>
<colgroup>
<col width="5%" />
<col width="95%" />
</colgroup>
<tbody>
<tr>
<td style="padding:0px; position:sticky; left:0; opacity:0.70;">
<div class="language-javascript highlighter-rouge col01">
<div class="highlight" style="margin:0px">
<pre class="highlight col01" style="margin:0px;">
<code class="col01">...
242
243
244
245
246
247
248
249
250
251
252
...</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02"><span class="p">...</span>

<span class="kd">let</span> <span class="nx">shaderMaterial</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">ShaderMaterial</span><span class="p">(</span> <span class="p">{</span>
    <span class="na">uniforms</span><span class="p">:</span>       <span class="nx">uniforms</span><span class="p">,</span>
    <span class="na">vertexShader</span><span class="p">:</span>   <span class="nx">shaders</span><span class="p">.</span><span class="nx">vertex</span><span class="p">,</span>
    <span class="na">fragmentShader</span><span class="p">:</span> <span class="nx">shaders</span><span class="p">.</span><span class="nx">fragment</span><span class="p">,</span>
    <span class="c1">//blending:       THREE.AdditiveBlending,</span>
    <span class="na">depthTest</span><span class="p">:</span>      <span class="kc">false</span><span class="p">,</span>
    <span class="na">transparent</span><span class="p">:</span>    <span class="kc">true</span><span class="p">,</span>
    <span class="na">vertexColors</span><span class="p">:</span>   <span class="kc">true</span>
<span class="p">});</span>

<span class="p">...</span></code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>

**THE RENDER FUNCTION**

In the Darryl's project, the **noiseCanvas** function ended with the **render** function. The render function updates the graphics using the **requestAnimationFrame** but before the rendering the **time** uniform is updated.

<div class="codetable-wrap" style="width:auto; overflow-x: auto;">
<table>
<colgroup>
<col width="5%" />
<col width="95%" />
</colgroup>
<tbody>
<tr>
<td style="padding:0px; position:sticky; left:0; opacity:0.70;">
<div class="language-javascript highlighter-rouge col01">
<div class="highlight" style="margin:0px">
<pre class="highlight col01" style="margin:0px;">
<code class="col01">...
225
226
...

<span style="color:yellow;">263 </span>
264
265
<span style="color:yellow;">266 </span>
267
<span style="color:yellow;">268 </span>
269
270
271
...
</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02">    ...
	    <span class="nx">currentTime</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span>
	    <span class="nx">timeAddition</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">random</span><span class="p">()</span> <span class="o">*</span> <span class="mi">1000</span>
    ...

	<span class="kd">function</span> <span class="nx">render</span><span class="p">()</span> <span class="p">{</span>
		<span class="kd">var</span> <span class="nx">now</span> <span class="o">=</span> <span class="k">new</span> <span class="nb">Date</span><span class="p">().</span><span class="nx">getTime</span><span class="p">();</span>
		<span class="nx">currentTime</span> <span class="o">=</span> <span class="p">(</span><span class="nx">now</span> <span class="o">-</span> <span class="nx">startTime</span><span class="p">)</span> <span class="o">/</span> <span class="mi">1000</span><span class="p">;</span>
		<span class="nx">uniforms</span><span class="p">.</span><span class="nx">time</span><span class="p">.</span><span class="nx">value</span> <span class="o">=</span> <span class="nx">currentTime</span> <span class="o">+</span> <span class="nx">timeAddition</span><span class="p">;</span>

		<span class="nx">requestAnimationFrame</span><span class="p">(</span> <span class="nx">render</span> <span class="p">);</span>
		<span class="nx">renderer</span><span class="p">.</span><span class="nx">render</span><span class="p">(</span> <span class="nx">scene</span><span class="p">,</span> <span class="nx">camera</span> <span class="p">);</span>
	<span class="p">}</span>
	<span class="nx">render</span><span class="p">();</span>
    ...
</code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>

The value of the **time** uniform is increased at each rendering frame using a simple implemantion based on the system clock.

# Tada!

If you reviewed the code you might have notice that the Three.js renderer and plane had dimensions but that they were not added to any HTML element. That was made on purpose by the author - the apparent changes on the texture of the Three.js plane should stay invisible to the viewer.

If you are interested in seeing how the noise function behaves, I have revealed the function by adding it to an HTML element:

<div id="threejs-container"></div>

<script src="{{ site.baseurl }}{% link mngassets/vendor/js/threejs/v104/three.v104.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02.js %}"></script>
<script type="module" src="{{ site.baseurl }}{% link mngassets/posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/huffman-flow-field-setup-02.js %}"></script>

# So... What did we learn from this code?

In this second part of our analysis of the Darryl Huffman's "Perlin Flow Field" we got the basic ideas of the use of shaders and noise functions in combination with Three.js. We are also unveiling a couple facts, like keeping the noise function invisible to the viewer.

In fact, Darryl kept that invisible because his only interest was to extract values from the noise function without showing the graphics, giving this idea of "invisible force" affecting the movement of the "hairs" rendered on the "context" canvas.

However, he needed a way to extract the values from the invisible noise function into the visible canvas. There is a common trick used for that, using again the canvas API as adapter. We will go through it in a third and last post about Darryl's pen.

 For now, happy coding!

