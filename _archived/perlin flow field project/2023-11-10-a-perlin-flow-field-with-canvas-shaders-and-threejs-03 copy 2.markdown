---
layout: post
title:  "A Perlin-like flow with canvas, shaders and three.js (Part 3)"
date:   2023-11-10 12:00:00 +0200
categories: blog update
---

<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/styles/table-code-highlight.css %}">
<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/posts/2024-10-31-a-perlin-flow-field-with-canvas-shaders-and-threejs-03/scrollama-setup-03.css %}">

# Putting everything together

In [Part 1]({{site.baseurl}}{% link _posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01.markdown %}) and [Part 2]({{site.baseurl}}{% link _posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02.markdown %}), we discussed some of the graphic tools that Darryl Huffman used to create his "Perlin Flow Field" on CodePen.

The way that Darryl made several graphics tools and techniques to work together was something that piqued my curiosity. I did some basic reverse engineering to explore his approach.

As a reminder, this is again a link to Darryl's work:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="vwmYgz" data-user="darrylhuffman" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/darrylhuffman/pen/vwmYgz">
  Perlin Flow Field</a> by Darryl Huffman (<a href="https://codepen.io/darrylhuffman">@darrylhuffman</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<br/>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

In the previous post, we separated Darryl's code into three sections:

- The "context" canvas and the Hair class
- The WebGL (Three.js), the *shader*, and the texture canvas
- The interaction between the texture (aka Garryl's **perlinCanvas**) and the "context" canvas

In this third and last post, we will check how Darryl brought together the canvas figure and the noise function.

# "Screenshots"

We have the canvas strokes and the noise function. Now what?

Extracting that data directly from the openGL API is not an easy task. However, the canvas API is a robust one and includes many helpful methods. In particular, the [image-related methods](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images) are very powerful.

A common trick to extract data from a graphic API, e.g. WebGL or the [video API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas), to be later used for 2D animation with canvas is the "screenshot" method. The canvas API is a robust one and accepts frames of other APIs as images. Those images are translated into canvas data.

Then, if you can take screenshots of every animation frame, much like a GIF or a [stop-motion film](https://en.wikipedia.org/wiki/Stop_motion), you can simulate what it is happening in the target graphic API. 

Darryl wanted the strokes to oscillate based on data coming from the WebGL renderer. More specifically, variations in the rendered noise function's color at specific pixels should drive changes in the rotation of the stroke. Every time a pixel changes color at each time frame interval, that color value should trigger the change of the stroke position, giving the illusion of moving like a wave by re-drawing them as rotating at angles not lower than 0 degrees and not more than 180 degrees with their points opposite to their origins as the center of rotation.

And which functions are common to waves, rotations, and angles? Indeed, [trigonometic functions](https://www.math.net/trigonometric-functions).



A typical way to extract data into canvas from another rendering API (e.g., videos) is by using another canvas element. Darryl made use of this popular trick. 

Considering the effect that effect was Darryl looking for, the trick makes even more sense. Darryl didn't want the coloring of the noise function to be visible - he only wanted the coloring data. If he used the context canvas for directly collecting the noise function output, he also might have to show the rendering of the noise function, and that is what he wanted to prevent.

He then kept his noise function rendering invisible to viewers and use another canvas as an adapter to extract data from it.

# The Code

Let's have a look at the techniques that Darryl used to couple a canvas image with a noise function.

**THE DARRYL'S "PERLIN" CANVAS**  

As we previously mentioned in [Part 1]({{site.baseurl}}{% link _posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01.markdown %}), the canvas that Darryl would use as an adapter (the "Perlin" canvas) was declared with similar properties to the "context" canvas but not appended to any HTML element:

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

The "Perlin" canvas (actually, the **perlinContext**) would be later associated with the **renderer** variable that was declared in line 5 of the original code and which would be linked to the WebGL renderer at line 231, inside the **noiseCanvas** function:

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

How the WebGL renderer is associated with the **perlinContext** can be seen in line 70 of the original code, enclosed in the *canvas* **render** function. What the **perlinContext** takes from the WebGL renderer is a "screenshot", a one-time image of what the WebGL renderer should show at each rendered frame of the **context** canvas.

It is that image, that "screenshot", that is used to collect the data, which is then passed to the **perlinImgData**.

**STROKE'S WAVE MOVEMENT AND THE draw METHOD**

In order to see how the data of the **perlinImgData** was used, we have to come back to the **draw** method of each instance of class **Hair**.

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

**perlinImgData.data** is the one passed to the **draw** method of the instance. The rgba values of every pixel in the "screenshot" would be listed in **perlinImgData.data**. Actually, **perlinImgData.data** is more an [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

The values required to calculate the rotation of the stroke were found using a calculated index, **i**. The calculation of **i** gives an idea of how the color data is arranged in the array. If a pixel were located at position ```(x,y)```, one of its rgba-coded color values would be located at ```(x * width + y) * 4``` in the array.

From the **perlinImgData.data** array, Darryl extracted a single value per pixel using that "mysterious" index. He then entered the value from the array into the ratio of a formula to obtain an angle's output in radians.

The resulting angle was used to calculate the rotation of the stroke using trigonometric formulas.

# In Action

<section id='stickyoverlay'>
    <figure id="scrollfig">
        <!--<p>0</p>-->
        <div id="threejs-container">    </div>
    </figure>
    <div id="test"></div>
    <div class="articlepost">
        <div class='step' data-step='1'>
            <div class="explain">
            <p>Let's see the two graphics together.</p>
          </div>
        </div>
        <div class='step' data-step='2'>
            <div class="explain">
            <p>Here we draw 700 "hairs" as an example. Remember that the "perlin" canvas was eventually instantiated with the same dimensions as the context canvas, but it was not appended to any HTML element. <strong>perlinImgData</strong> was declared at a higher scope and set to "undefined".</p>
<div class="language-javascript highlighter-rouge col02"><div class="highlight"><pre class="highlight col02"><code class="col02 insert"><span class="kd">let</span> <span class="nx">perlinImgData</span> <span class="o">=</span> <span class="kc">undefined</span>

<span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">width</span> <span class="o">=</span> <span class="nx">width</span>
<span class="nx">perlinCanvas</span><span class="p">.</span><span class="nx">height</span> <span class="o">=</span> <span class="nx">height</span>
</code></pre></div></div>
<div class="explain">
</div>
            </div>
        </div>
        <div class='step' data-step='3'>
            <div class="explain">
            <p>So far we haven't used the data coming from the <strong>perlinCanvas</strong>.</p>
            <p>Let's do it!</p>
            </div>
        </div>
<div class='step' data-step='4'>
            <div class="explain">
            <p>The <strong>perlinCanvas</strong> collects a screenshot of the noise flow at each animation frame. The data from the image is then passed to <strong>perlinImgData</strong>.</p>
            </div>
</div>
        <div class='step' data-step='5'>
            <div class="explain">
            <p>You have seen this already! The draw method in class Hair. Notice the <strong>perlinImgData.data</strong>, the index <strong>i</strong> and the canvas API methods, <strong>moveTo</strong> and <strong>lineTo</strong>.</p>
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
        <div class='step' data-step='6'>
            <div class="explain">
            <p>The index is used to look for one of the rgba (0-255) encoded coloring values for the pixel in the data array <strong>perlinImgData.data</strong>. Both canvas are of the same dimension, and the extracted values correspond to pixels on the <strong>perlinContext</strong> screenshot that match <em>exactly the same</em> position as "hair" origin in the <strong>context</strong> canvas. The array's value is entered into a formula to get an "angle" value between 0 and PI.</p>
            <p>This angle would be used to rotate the origin point of the hair.</p>
            </div>
        </div>        
        <div class='step' data-step='7'>
            <div class="explain">
            <p>Now let's overlap both graphics.</p>
            </div>
        </div>
        <div class='step' data-step='8'>
        </div>
        <div class='step' data-step='9'>
        </div>
    </div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
</section>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/threejs/v104/three.v104.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/D3js/v7.8.5/d3.v7.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/scrollama/v2.1.2/scrollama.v2.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/vendor/js/stickyfill/v2.1.0/stickyfill.v2.min.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/posts/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01/2023-10-07-a-perlin-flow-field-with-canvas-shaders-and-threejs-01.js %}"></script>
<script src="{{ site.baseurl }}{% link mngassets/posts/2024-10-31-a-perlin-flow-field-with-canvas-shaders-and-threejs-03/huffman-flow-field-setup-03.js %}"></script>
<script type="module" src="{{ site.baseurl }}{% link mngassets/posts/2024-10-31-a-perlin-flow-field-with-canvas-shaders-and-threejs-03/scrollama-setup-03.js %}"></script>
<script type="module" src="{{ site.baseurl }}{% link mngassets/posts/2023-10-28-a-perlin-flow-field-with-canvas-shaders-and-threejs-02/huffman-flow-field-setup-02.js %}"></script>


# Tada!

If you look closely at the last image, you might notice that the "hairs" move to the right and left based on how light or dark the the passing noise flow is.

This passing noise flow is kept away from the viewer, giving the illusion of an invisible force flowing through the hairs.

# So... What did we learn from this code?

There are few things I learned from this single project:

* the use of flowing noise functions to get effects on canvas-based graphics
* a revision of the power of the canvas API as intermediate to get data between graphical APIs
* a refreshing of rotation programming techniques
* ... and more

In fact, there are still things we can get deeper into by just using this example, but I think we could stop now.

It also like the challenge of getting nice effects with some kind of minimal effort. In the case of the implementation we have just seen, it is fair to say that only when you have at least a basic understanding of all those technologies and techniques is the effort of putting them together  a "minimal" one. But if you notice the few elements used between all those technologies to generate the final effect, then you might agree how the use of few values where enough to make this project a nice to "re-verse".

# Final Remarks

I still find myself ripping at the Darryl's pen as I watch the hairs move as mimicking a natural phenomenon, like a soft water stream passing accross floating grass.

Now, what are your thoughts? Was there anything Darryl Huffman could have done differently? Is this pen one that could work for some of your projects? Is there any other effect that you would like to try using similar techniques?

 I hope that all three of these posts were helpful for you. With this we have completed our analysis of this implementation. Time for something new. Meanwhile, I wish you happy coding!

