---
layout: post
title:  "A Perlin-like flow with canvas, shaders and three.js (Part 3)"
date:   2023-11-10 12:00:00 +0200
categories: blog update
---

<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/styles/table-code-highlight.css %}">
<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01/scrollama-setup.css %}">

# Putting everything together

In [Part 1]({{site.baseurl}}{% link _posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01.markdown %}) and [Part 2]({{site.baseurl}}{% link _posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02.markdown %}) we discussed some of the graphic tools that Darryl Huffman used to create his "Perlin Flow Field" on CodePen.

Darryl utilized the 2D graphics canvas API, Three.js (the 3D graphics library), and GLSL shaders. The way all those graphic tools were made to work together was something that piqued my curiosity. In an attemp to determine how Darryl obtained that result, I made some basic reverse engineering.

As a reminder, this is again a link to Darryl's work:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="vwmYgz" data-user="darrylhuffman" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/darrylhuffman/pen/vwmYgz">
  Perlin Flow Field</a> by Darryl Huffman (<a href="https://codepen.io/darrylhuffman">@darrylhuffman</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<br/>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

In this third and last post we will check how Darryl brought together the canvas figure and the noise function.

# Trigonometry and The Adapter

We have the canvas strokes and the noise function. Now what?

~~What Darryl wanted from his project was the strokes to move in angles based on matrix data coming from the noise function, the matrix data representing the color of the pixels resulting from the outputs of the noise function at each time interval.~~

Darryl wanted the strokes to move in angles based on matrix data coming from the rendering of the noise. The changes in the position of the stroke were driven by changes in the colors of the rendered noise function: Every time a pixel changed color at each time interval, that color value should trigger the change of the stroke position, giving the illusion of moving like a wave by re-drawing them at angular gradients not lower than 0 degrees and not more than 180 degrees.

And which functions are typical to waves and angles? Indeed - [trigonometic functions](https://www.math.net/trigonometric-functions).

<span style="color:red;">CHECK THIS PART!!!!</span>
Extracting that data directly from the openGL API is not an easy task. But the WebGL API is a powerful one and comes with very useful methods. The canvas API and the WebGL API are strongly related: the WebGL API uses the canvas API for rendering. Therefore, it is possible to render an openGL graphic and still use the canvas API methods to get two-dimensional information about the openGL rendering.

Darryl used another canvas element, he called the Perlin canvas, to extract the data. Here you might ask: if you can use the canvas API to directly extract data from the openGL rendering, why did Darryl use another canvas?

Darryl didn't want the coloring of the noise function to be seeing - he only wanted the data. If he used the context canvas for directly collecting the noise function output, he also had to show the rendering of the noise function, and that is what he wanted to prevent.

The Perlin canvas, in this case, works more like an adapter.

# The Code

In the previous post we separated Darryl's code into three sections:

- The "context" canvas and the Hair class
- The WebGL (Three.js), the *shader*, and the texture canvas
- The interaction between the texture (aka Garryl's "perlinCanvas") and the "context" canvas.

Our focus is the third one.

**THE DARRYL'S "PERLIN" CANVAS**  

As we previously mentioned in [Part 1]({{site.baseurl}}{% link _posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01.markdown %}), the canvas that Darryl would use as an adapter (the "Perlin" canvas) was declared with similar properties to the "context" canvas but not appended to any HTML element:

```javascript
		draw(){
    			let { position, length } = this,
			    { x, y } = position,
			    i = (y * width + x) * 4,
			    d = perlinImgData.data,
			    noise = d[i],
			    angle = (noise / 255) * Math.PI
			
			context.moveTo(x, y)
			context.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
		}
```

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
  8
  9
<span style="color:yellow;"> 10 </span>
<span style="color:yellow;"> 11 </span>
 12
 13
...

 21
 22
<span style="color:yellow;"> 23 </span>
 24
<span style="color:yellow;"> 25 </span>
<span style="color:yellow;"> 26 </span>
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
<span class="kd">const</span> <span class="nx">canvas</span> <span class="o">=</span> <span class="nb">document</span><span class="p">.</span><span class="nx">createElement</span><span class="p">(</span><span class="dl">'</span><span class="s1">canvas</span><span class="dl">'</span><span class="p">),</span>
        <span class="nx">context</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">getContext</span><span class="p">(</span><span class="dl">'</span><span class="s1">2d</span><span class="dl">'</span><span class="p">),</span>
        <span class="nx">perlinCanvas</span> <span class="o">=</span> <span class="nb">document</span><span class="p">.</span><span class="nx">createElement</span><span class="p">(</span><span class="dl">'</span><span class="s1">canvas</span><span class="dl">'</span><span class="p">),</span>
        <span class="nx">perlinContext</span> <span class="o">=</span> <span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">getContext</span><span class="p">(</span><span class="dl">'</span><span class="s1">2d</span><span class="dl">'</span><span class="p">),</span>
        <span class="nx">width</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">width</span> <span class="o">=</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetWidth</span><span class="p">,</span>
        <span class="nx">height</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">height</span> <span class="o">=</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetHeight</span><span class="p">,</span>
...
        
<span class="nb">document</span><span class="p">.</span><span class="nx">body</span><span class="p">.</span><span class="nx">appendChild</span><span class="p">(</span><span class="nx">canvas</span><span class="p">)</span>

<span class="kd">let</span> <span class="nx">perlinImgData</span> <span class="o">=</span> <span class="kc">undefined</span>

<span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">width</span> <span class="o">=</span> <span class="nx">width</span>
<span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">height</span> <span class="o">=</span> <span class="nx">height</span>
</code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>

The "Perlin" canvas (actually, the **perlinContext**) would be later associated to the **renderer** variable that was declared in line 5 of the original code and which would linked to the WebGL renderer at line 231, inside the **noiseCanvas** function:

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
  3
  4
<span style="color:yellow;">  5 </span>
  6
  7
...

 63
...

<span style="color:yellow;"> 69 </span>
<span style="color:yellow;"> 70 </span>
<span style="color:yellow;"> 71 </span>
...

 78
 79
 80
 81
 82
 83
...

<span style="color:yellow;">231 </span>
...

272
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
<span class="kd">let</span> <span class="nx">container</span> <span class="o">=</span> <span class="nb">document</span><span class="p">.</span><span class="nx">body</span><span class="p">,</span>
    <span class="nx">startTime</span> <span class="o">=</span> <span class="k">new</span> <span class="nb">Date</span><span class="p">().</span><span class="nx">getTime</span><span class="p">(),</span>
    <span class="nx">renderer</span>

<span class="kd">function</span> <span class="nx">init</span><span class="p">()</span> <span class="p">{</span> <span class="code-note"> <em><-- The <code>init</code> function sets the canvas elements and renders the "context" canvas</em> </span>
...

 <span class="kd">function</span> <span class="nx">render</span><span class="p">()</span> <span class="p">{</span> <span class="code-note"> <em><-- This <code>render</code> function is inside <code>init</code> and renders the "context" canvas</em> </span>
... 

	<span class="nx">perlinContext</span><span class="p">.</span><span class="nx">clearRect</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">width</span><span class="p">,</span> <span class="nx">height</span><span class="p">)</span>
	<span class="nx">perlinContext</span><span class="p">.</span><span class="nx">drawImage</span><span class="p">(</span><span class="nx">renderer</span><span class="p">.</span><span class="nx">domElement</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="mi">0</span><span class="p">)</span>
	<span class="nx">perlinImgData</span> <span class="o">=</span> <span class="nx">perlinContext</span><span class="p">.</span><span class="nx">getImageData</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">width</span><span class="p">,</span> <span class="nx">height</span><span class="p">)</span>
...

 <span class="p">}</span>
 <span class="nx">render</span><span class="p">()</span>

<span class="p">}</span>

<span class="kd">function</span> <span class="nx">noiseCanvas</span><span class="p">()</span> <span class="p">{</span> <span class="code-note"> <em><-- <code>noiseCanvas</code> focuses on the WebGL graphics and its rendering</em> </span>
...

	<span class="nx">renderer</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">THREE</span><span class="p">.</span><span class="nx">WebGLRenderer</span><span class="p">({</span> <span class="na">alpha</span><span class="p">:</span> <span class="kc">true</span> <span class="p">})</span>
...

<span class="p">}</span>
</code>
</pre>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</div>

How the WebGL renderer is associated to the **perlinContext** can be seen in the line 70 of the original code, enclosed in the *canvas* **render** function. What the **perlinContext** takes from the WebGL renderer is a "screenshot", a one-time image of what the WebGL renderer should show at each rendered frame of the **context** canvas.

It is that image, that "screenshot", what it is used to collect the data, which is then passed to the **perlinImgData**.

**STROKE'S WAVE MOVEMENT AND THE draw METHOD

In order to see how the data of the **perlinImgData** was used we have to come back to the **draw** method of each instance of class **Hair**.

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
 44
 45
 46
 47
<span style="color:yellow;"> 48 </span>
 49
 50
 51
 52
<span style="color:yellow;"> 53 </span>
 54
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
		<span class="nx">draw</span><span class="p">(){</span>
    			<span class="kd">let</span> <span class="p">{</span> <span class="nx">position</span><span class="p">,</span> <span class="nx">length</span> <span class="p">}</span> <span class="o">=</span> <span class="k">this</span><span class="p">,</span>
			    <span class="p">{</span> <span class="nx">x</span><span class="p">,</span> <span class="nx">y</span> <span class="p">}</span> <span class="o">=</span> <span class="nx">position</span><span class="p">,</span>
			    <span class="nx">i</span> <span class="o">=</span> <span class="p">(</span><span class="nx">y</span> <span class="o">*</span> <span class="nx">width</span> <span class="o">+</span> <span class="nx">x</span><span class="p">)</span> <span class="o">*</span> <span class="mi">4</span><span class="p">,</span>
			    <span class="nx">d</span> <span class="o">=</span> <span class="nx">perlinImgData</span><span class="p">.</span><span class="nx">data</span><span class="p">,</span>
			    <span class="nx">noise</span> <span class="o">=</span> <span class="nx">d</span><span class="p">[</span><span class="nx">i</span><span class="p">],</span>
			    <span class="nx">angle</span> <span class="o">=</span> <span class="p">(</span><span class="nx">noise</span> <span class="o">/</span> <span class="mi">255</span><span class="p">)</span> <span class="o">*</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span>
			
			<span class="nx">context</span><span class="p">.</span><span class="nx">moveTo</span><span class="p">(</span><span class="nx">x</span><span class="p">,</span> <span class="nx">y</span><span class="p">)</span>
			<span class="nx">context</span><span class="p">.</span><span class="nx">lineTo</span><span class="p">(</span><span class="nx">x</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">angle</span><span class="p">)</span> <span class="o">*</span> <span class="nx">length</span><span class="p">,</span> <span class="nx">y</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">angle</span><span class="p">)</span> <span class="o">*</span> <span class="nx">length</span><span class="p">)</span>
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

**perlinImgData.data** contains the rgb values of the pixel coloring from the "screenshot" arranged in a list. **perlinImgData.data** is the one passed to the the **draw** method of the instance.

Darryl used a variable **i** as index to search the list. The calculation of the index value is still intriguing to me - I must admit I don't know why Darryl used position and width to calculate the index, but it worked.

The fact is that Darryl used that mysterious index to extract just one value from the **perlinImgData.data** list and used another formula to get an angle based on the ratio of the extracted value against its maximum (255).

It is the resulting angle which is used to re-render the stroke in a different angular position using trigonometric formulas.

# In Action

<section id='stickyoverlay'>
    <figure>
        <!--<p>0</p>-->
    </figure>
    <div class="articlepost">
        <div class='step' data-step='1'>
            <div class="explain">
            <p>Garryl instantiated the two canvas's width and height based on the container's offset (in his case, the body element). The context canvas was made transparent. Here I show a canvas in grey. In addition, he declared an empty "hairs" array as well as the parameters of an object called "circle" with values corresponding to the context canvas. The context canvas was appended to the container.</p>

<div class="language-javascript highlighter-rouge col02">
<div class="highlight"><pre class="highlight col02">
<code class="col02 insert">	
<span class="kd">const</span> <span class="nx">canvas</span> <span class="o">=</span> <span class="nb">document</span><span class="p">.</span><span class="nx">createElement</span><span class="p">(</span><span class="dl">'</span><span class="s1">canvas</span><span class="dl">'</span><span class="p">),</span>
        <span class="nx">context</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">getContext</span><span class="p">(</span><span class="dl">'</span><span class="s1">2d</span><span class="dl">'</span><span class="p">),</span>
        <span class="nx">perlinCanvas</span> <span class="o">=</span> <span class="nb">document</span><span class="p">.</span><span class="nx">createElement</span><span class="p">(</span><span class="dl">'</span><span class="s1">canvas</span><span class="dl">'</span><span class="p">),</span>
        <span class="nx">perlinContext</span> <span class="o">=</span> <span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">getContext</span><span class="p">(</span><span class="dl">'</span><span class="s1">2d</span><span class="dl">'</span><span class="p">),</span>
        <span class="nx">width</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">width</span> <span class="o">=</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetWidth</span><span class="p">,</span>
        <span class="nx">height</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">height</span> <span class="o">=</span> <span class="nx">container</span><span class="p">.</span><span class="nx">offsetHeight</span><span class="p">,</span>
        <span class="nx">circle</span> <span class="o">=</span> <span class="p">{</span>
            <span class="na">x</span><span class="p">:</span> <span class="nx">width</span> <span class="o">/</span> <span class="mi">2</span><span class="p">,</span>
            <span class="na">y</span><span class="p">:</span> <span class="nx">height</span> <span class="o">/</span> <span class="mi">2</span><span class="p">,</span>
            <span class="na">r</span><span class="p">:</span> <span class="nx">width</span> <span class="o">*</span> <span class="p">.</span><span class="mi">2</span>
        <span class="p">},</span>
        <span class="nx">hairs</span> <span class="o">=</span> <span class="p">[]</span>
        <span class="nb">document</span><span class="p">.</span><span class="nx">body</span><span class="p">.</span><span class="nx">appendChild</span><span class="p">(</span><span class="nx">canvas</span><span class="p">)</span>
        </code>
    </pre>
</div>
</div> 

            </div>
        </div>
        <div class='step' data-step='2'>
            <div class="explain">
            <p>The "perlin" canvas was eventually instantiated with the same dimensions as the context canvas, but it was not appended to any HTML element.</p>
<div class="language-javascript highlighter-rouge col02"><div class="highlight"><pre class="highlight col02"><code class="col02 insert"><span class="kd">let</span> <span class="nx">perlinImgData</span> <span class="o">=</span> <span class="kc">undefined</span>

<span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">width</span> <span class="o">=</span> <span class="nx">width</span>
<span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">height</span> <span class="o">=</span> <span class="nx">height</span>
</code></pre></div></div>
            </div>
        </div>
        <div class='step' data-step='3'>
            <div class="explain">
            <p>It is on top of the context canvas that Darryl would randomly draw the strokes.</p>
            </div>
        </div>
        <div class='step' data-step='4'>
            <div class="explain">
            <p>All "hair"'s were instances of the class <em>Hair</em>.
            The class constructor took several inputs. The global <strong>circle</strong> object was one of them. For each instance of Hair, the class constructor generated random values for "r" and "d" of a <a href="https://www.mathsisfun.com/geometry/unit-circle.html" target="_blank">unit circle</a>. These values where then used to calculate random positional (x,y) values enclosed within the global <strong>circle object</strong> by applying the <a href="https://unacademy.com/content/jee/study-material/mathematics/parametric-equations-of-a-circle/" target="_blank">parametric equation of the circle</a>. Addtionally, the class assigned a random length to each stroke.</p>
<div class="language-javascript highlighter-rouge col02"><div class="highlight"><pre class="highlight col02"><code class="col02 insert">
<span class="kd">class</span> <span class="nx">Hair</span> <span class="p">{</span>
    <span class="kd">constructor</span><span class="p">(){</span>
        <span class="kd">let</span> <span class="nx">r</span> <span class="o">=</span> <span class="mi">2</span> <span class="o">*</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">random</span><span class="p">(),</span>
            <span class="nx">d</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sqrt</span><span class="p">(</span><span class="nb">Math</span><span class="p">.</span><span class="nx">random</span><span class="p">())</span>

        <span class="k">this</span><span class="p">.</span><span class="nx">position</span> <span class="o">=</span> <span class="p">{</span>
            <span class="na">x</span><span class="p">:</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">floor</span><span class="p">(</span><span class="nx">circle</span><span class="p">.</span><span class="nx">x</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">r</span><span class="p">)</span> <span class="o">*</span> <span class="nx">d</span> <span class="o">*</span> <span class="nx">circle</span><span class="p">.</span><span class="nx">r</span><span class="p">),</span>
            <span class="na">y</span><span class="p">:</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">floor</span><span class="p">(</span><span class="nx">circle</span><span class="p">.</span><span class="nx">y</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">r</span><span class="p">)</span> <span class="o">*</span> <span class="nx">d</span> <span class="o">*</span> <span class="nx">circle</span><span class="p">.</span><span class="nx">r</span><span class="p">)</span>
        <span class="p">}</span>
        
        <span class="k">this</span><span class="p">.</span><span class="nx">length</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">floor</span><span class="p">(</span><span class="nb">Math</span><span class="p">.</span><span class="nx">random</span><span class="p">()</span> <span class="o">*</span> <span class="mi">10</span><span class="p">)</span> <span class="o">+</span> <span class="mi">10</span>
        <span class="nx">hairs</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="k">this</span><span class="p">)</span>
    <span class="p">}</span>
    ...
</code></pre></div></div>
            </div>
        </div>
        <div class='step' data-step='5'></div>
        <div class='step' data-step='6'>
            <div class="explain">
            <p>In Hair class, Darryl included a method to draw each of the strokes. Notice that there are two elements that will come as very important later: the <strong>perlinImgData</strong> and the canvas API <strong>moveTo</strong> and <strong>lineTo</strong> methods.</p>
<div class="language-javascript highlighter-rouge col02"><div class="highlight"><pre class="highlight col02"><code class="col02 insert">
    ...
    <span class="nx">draw</span><span class="p">(){</span>
            <span class="kd">let</span> <span class="p">{</span> <span class="nx">position</span><span class="p">,</span> <span class="nx">length</span> <span class="p">}</span> <span class="o">=</span> <span class="k">this</span><span class="p">,</span>
            <span class="p">{</span> <span class="nx">x</span><span class="p">,</span> <span class="nx">y</span> <span class="p">}</span> <span class="o">=</span> <span class="nx">position</span><span class="p">,</span>
            <span class="nx">i</span> <span class="o">=</span> <span class="p">(</span><span class="nx">y</span> <span class="o">*</span> <span class="nx">width</span> <span class="o">+</span> <span class="nx">x</span><span class="p">)</span> <span class="o">*</span> <span class="mi">4</span><span class="p">,</span>
            <span class="nx">d</span> <span class="o">=</span> <span class="nx">perlinImgData</span><span class="p">.</span><span class="nx">data</span><span class="p">,</span>
            <span class="nx">noise</span> <span class="o">=</span> <span class="nx">d</span><span class="p">[</span><span class="nx">i</span><span class="p">],</span>
            <span class="nx">angle</span> <span class="o">=</span> <span class="p">(</span><span class="nx">noise</span> <span class="o">/</span> <span class="mi">255</span><span class="p">)</span> <span class="o">*</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span>
        
        <span class="nx">context</span><span class="p">.</span><span class="nx">moveTo</span><span class="p">(</span><span class="nx">x</span><span class="p">,</span> <span class="nx">y</span><span class="p">)</span>
        <span class="nx">context</span><span class="p">.</span><span class="nx">lineTo</span><span class="p">(</span><span class="nx">x</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">angle</span><span class="p">)</span> <span class="o">*</span> <span class="nx">length</span><span class="p">,</span> <span class="nx">y</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">angle</span><span class="p">)</span> <span class="o">*</span> <span class="nx">length</span><span class="p">)</span>
    <span class="p">}</span>
<span class="p">}</span>
</code></pre></div></div>            
            </div>
        </div>
        <div class='step' data-step='7'>
            <div class="explain">
            <p>With a for-loop, Darryl instanted 6000 "hairs". The destination of each new instance is not clear by just looking at the loop. By exploring the code of the class Hair you will find that Darryl made it to use the now global hairs list to register each new instance at the time of the instance construction.</p>
<div class="language-javascript highlighter-rouge col02"><div class="highlight"><pre class="highlight col02"><code class="col02 insert"><span class="k">for</span><span class="p">(</span><span class="kd">var</span> <span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="mi">6000</span><span class="p">;</span> <span class="nx">i</span><span class="o">++</span><span class="p">){</span>
    <span class="k">new</span> <span class="nx">Hair</span><span class="p">()</span>
<span class="p">}</span>
</code></pre></div></div>
            </div>
        </div>
    </div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
</section>
<!--<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.4/TweenLite.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.5/plugins/ColorPropsPlugin.min.js"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/threejs/v104/three.v104.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/D3js/v7.8.5/d3.v7.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/scrollmagic/ScrollMagic.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/scrollama/v2.1.2/scrollama.v2.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/stickyfill/v2.1.0/stickyfill.v2.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01/huffman-flow-field-setup.js %}"></script>
<script type="module" src="{{ site.baseurl }}{% link mngassets/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01/scrollama-setup.js %}"></script>






> Note: keep in mind that Darryl defined *another* function called **render** inside the **noiseCanvas** function to render the WebGL graphics.




~~Why a single image? The renderer might be running the graphics at a different speed as how the canvas can check, and the time to process all the data takes time. This can lead to mistmatches between the collected data~~

With his project, Garryl wanted to animate "hairs" located in a circle of radio "r" in the middle of the viewport. Those hairs were canvas' strokes. They all should move based on a noise function which a pattern that changes over time in a rather regular trend. Because the way it changes the noise function is usually referred as a ***flow***, simulating the usual patterns in the movements of substances in either liquid or gas states.

So, the "liquid" pattern should lead the movement of the hairs.

Yes, but... how?

There are several ways to implement this noise function over the hairs of the "context" canvas. One way is to write the code of the noise function directly in javascript and pass its generated values into the canvas API.

Now, we know that the shader function affects the pixels of the rendered image. If we want to capture the flow effect of the noise function, we need to come up with an idea of how to get the values associated with those pixels at any point in time.

However, the noise function was written for the WebGL API, not the canvas API. There is not simple way to extract values from a WebGL shader into a javascript scope.

Unless that... if we could find an interface that capture those values per pixel affected by the noise function in the WebGL scope and bring them to the javascript scope into our "context" canvas, we could translate those values into a movement function...

Well here a popular trick: a usual method consists in extracting values from the WebGL that also relies on the canvas API and that are revealed in this example:
* With Three.js you can render a WebGL shape over which to run the shader. Three.js is actually WebGL in simpler javascript. It is like the jQuery of WebGL.
* Then you can use a canvas as a "texture" to "cover" that shape.
* The canvas texture is then a subject of the changes of the shader. Those changes are in fact numeric values  and those changes translate into values that you can extract from that texture canvas into the Javascript scope.

Garryl Huffman selected the approach of using an interface.

That canvas that acts as texture of the WebGL scope becomes and interface between the WebGL and the javascript. Although not strictly so, this approach is very close to an [Adapter design pattern](https://refactoring.guru/design-patterns/adapter).

With his project, Garryl wanted to move the  used not one but two canvas elements. They were strongly interlinked - we will explain that better later on.

Both of the canvases were made invisible to the observer.

The first canvas, the "context", contained the line strokes that would be subjected to the animation.

Let's see its functionality.


# Tada!

The last bit of code I want to show you for now is the render of the canvas elements:

```javascript
function render() {
    var now = new Date().getTime();
    currentTime = (now - startTime) / 1000
    
    context.clearRect(0,0,width,height)

    perlinContext.clearRect(0, 0, width, height)
    perlinContext.drawImage(renderer.domElement, 0, 0)
    perlinImgData = perlinContext.getImageData(0, 0, width, height)
    
    context.beginPath()
    hairs.map(hair => hair.draw())
    context.stroke()
    
    requestAnimationFrame( render );
}
render()
```

What I would like to point out is the `hairs.map(hair => hair.draw())`, which is the draw of each stroke. No less important though is what it goes with the **perlinContext** and the value assignment to the global **perlinImgData** which is parameter of the Hair's **draw method**. For the purpose of this example we left the values of the **perlinImgData** all as zero, but if you check Darryl's code and see carefully you will notice that the perlinImgData is feeding data to the draw function and therefore to the position of the hairs in the circle.

# So... What did we learn from this code?

So far, one of the things that for me was very interesting from Darryl Huffman's example was the simplicity of ideas. I won't say the code is very simple, but some of the design concepts of the exercise, like randomly distributing hairs in a circle, were very nice. The use of the class to even append the instances in a global list were kind of smart.

Apart of that, there is still much to reveal about this code. What about the noise function? And what is the role of the "perlinContext" canvas? You might ask. Before we move to the next part, I can say that using two canvas elements is a common trick - using one canvas to extract data from an application (eg. a video) and to feed that data into another canvas to affect a visualization.

 For now, happy coding!

