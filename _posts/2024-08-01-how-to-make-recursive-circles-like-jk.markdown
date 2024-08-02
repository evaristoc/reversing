---
layout: post
title:  "How to make an animation of recursive tangent circles - a code by JK"
date:   2024-08-01 12:00:00 +0200
categories: blog update
---

<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/styles/table-code-highlight.css %}">
<link rel="stylesheet" href="{{ site.baseurl }}{% link mngassets/posts/2023-11-10-a-perlin-flow-field-with-canvas-shaders-and-threejs-03/scrollama-setup-03.css %}">

https://codepen.io/DonKarlssonSan/pen/jOMROaB

Some people find circles a fascinating form. They are surrounded by mathematical paradigms, like being a closed curve and still being ruled by one of the most interesting irrational numbers, Pi, which is a [transcendental number](https://en.wikipedia.org/wiki/Transcendental_number).

And if you are a fan of circles, why not having several of them, recursively?

This is what JK, or Johan Karlsson, did for one his projects in Codepen:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="jOMROaB" data-pen-title="Recursive Circles III" data-user="DonKarlssonSan" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/DonKarlssonSan/pen/jOMROaB">
  Recursive Circles III</a> by Johan Karlsson (<a href="https://codepen.io/DonKarlssonSan">@DonKarlssonSan</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

There are many other projects about recursivity and circles, but I chose JK's one because I like his projects and the way he codes. He is usually on the search of striking patterns based on few geometric forms, all with very simple code using pure ES5 vanilla Javascript.

In this post, I will be re-versing one of his simplest projects posted on Codepen, "Recursive Circles III". He made it as a part of a series for the 2021 edition of [Genuary](https://genuary.art/), an artificial generated month to carry out a generative art project per day.

The code for this project is truly simple: A very simple css, a one-line html and a javascript of just 58 lines of prettified code, including empty lines, consisting of:

* A canvas instantiation function
* Canvas circles using the `arc` method
* Some lines of code to control for the position and rotation of the circles
* Recursive calls of the drawing function, with a clear termination
* A `draw` function

# The Code

Let's put some attention to the JS code.

JK started his code with an instantiation of the canvas:

```javascript
function drawPattern(x, y, r, angle, iteration) {
  if(iteration < 0) return;
  
  let newR = r * shrinkFactor;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  
  let r2 = r - newR;
  let x1 = Math.cos(angle) * r2 + x;
  let y1 = Math.sin(angle) * r2 + y;
  drawPattern(x1, y1, newR, angle * 1.1, iteration - 1);
  
  let x2 = Math.cos(angle + Math.PI * 2 / 3) * r2 + x;
  let y2 = Math.sin(angle + Math.PI * 2 / 3) * r2 + y;
  drawPattern(x2, y2, newR, angle * 1.2, iteration - 1);
  
  let x3 = Math.cos(angle + Math.PI * 4 / 3) * r2 + x;
  let y3 = Math.sin(angle + Math.PI * 4 / 3) * r2 + y;
  drawPattern(x3, y3, newR, angle * 1.3, iteration - 1);

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
<code class="col01">  6
  7
  8
  9
 10
 11
<span style="color:yellow;"> 12 </span>
 13
 14
 15
 16
 17
 18
<span style="color:yellow;"> 19 </span>
 20
 21
 22
 23</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02">
<span class="kd">let</span> <span class="nx">canvas</span><span class="p">;</span>
<span class="kd">let</span> <span class="nx">ctx</span><span class="p">;</span>
<span class="kd">let</span> <span class="nx">w</span><span class="p">,</span> <span class="nx">h</span><span class="p">;</span>
<span class="kd">let</span> <span class="nx">shrinkFactor</span><span class="p">;</span>

<span class="kd">function</span> <span class="nx">setup</span><span class="p">()</span> <span class="p">{</span>
  <span class="nx">canvas</span> <span class="o">=</span> <span class="nb">document</span><span class="p">.</span><span class="nx">querySelector</span><span class="p">(</span><span class="dl">"</span><span class="s2">#canvas</span><span class="dl">"</span><span class="p">);</span>
  <span class="nx">ctx</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">getContext</span><span class="p">(</span><span class="dl">"</span><span class="s2">2d</span><span class="dl">"</span><span class="p">);</span>
  <span class="nx">resize</span><span class="p">();</span>
  <span class="nb">window</span><span class="p">.</span><span class="nx">addEventListener</span><span class="p">(</span><span class="dl">"</span><span class="s2">resize</span><span class="dl">"</span><span class="p">,</span> <span class="nx">resize</span><span class="p">);</span>
<span class="p">}</span>

<span class="kd">function</span> <span class="nx">resize</span><span class="p">()</span> <span class="p">{</span>
  <span class="nx">w</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">width</span> <span class="o">=</span> <span class="nb">window</span><span class="p">.</span><span class="nx">innerWidth</span><span class="p">;</span>
  <span class="nx">h</span> <span class="o">=</span> <span class="nx">canvas</span><span class="p">.</span><span class="nx">height</span> <span class="o">=</span> <span class="nb">window</span><span class="p">.</span><span class="nx">innerHeight</span><span class="p">;</span>
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

The code above includes the declaration of some high-scope variables, the initialization of the canvas instance
and the resize function. The code doesn't have anything extraordinary: it is really standard, simple and organized.

The following is where the animation takes place:

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
<code class="col01"> 23
 24
 25
 26
 27
 28
 29
 30
 31
 32
 33
 34
 35
 36
 37
 38
 39
 40
 41
 42
 43
 44
 45
 46</code>
</pre>
</div>
</div>
</td>
<td style="padding:0px;">
<div class="language-javascript highlighter-rouge col02">
<div class="highlight" style="margin:0px;">
<pre class="highlight col02" style="margin:0px;">
<code class="col02">
<span class="kd">function</span> <span class="nx">drawPattern</span><span class="p">(</span><span class="nx">x</span><span class="p">,</span> <span class="nx">y</span><span class="p">,</span> <span class="nx">r</span><span class="p">,</span> <span class="nx">angle</span><span class="p">,</span> <span class="nx">iteration</span><span class="p">)</span> <span class="p">{</span>
  <span class="k">if</span><span class="p">(</span><span class="nx">iteration</span> <span class="o">&lt;</span> <span class="mi">0</span><span class="p">)</span> <span class="k">return</span><span class="p">;</span>
  
  <span class="kd">let</span> <span class="nx">newR</span> <span class="o">=</span> <span class="nx">r</span> <span class="o">*</span> <span class="nx">shrinkFactor</span><span class="p">;</span>
  <span class="nx">ctx</span><span class="p">.</span><span class="nx">beginPath</span><span class="p">();</span>
  <span class="nx">ctx</span><span class="p">.</span><span class="nx">arc</span><span class="p">(</span><span class="nx">x</span><span class="p">,</span> <span class="nx">y</span><span class="p">,</span> <span class="nx">r</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">2</span><span class="p">);</span>
  <span class="nx">ctx</span><span class="p">.</span><span class="nx">stroke</span><span class="p">();</span>
  
  <span class="kd">let</span> <span class="nx">r2</span> <span class="o">=</span> <span class="nx">r</span> <span class="o">-</span> <span class="nx">newR</span><span class="p">;</span>
  <span class="kd">let</span> <span class="nx">x1</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">angle</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">x</span><span class="p">;</span>
  <span class="kd">let</span> <span class="nx">y1</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">angle</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">y</span><span class="p">;</span>
  <span class="nx">drawPattern</span><span class="p">(</span><span class="nx">x1</span><span class="p">,</span> <span class="nx">y1</span><span class="p">,</span> <span class="nx">newR</span><span class="p">,</span> <span class="nx">angle</span> <span class="o">*</span> <span class="mf">1.1</span><span class="p">,</span> <span class="nx">iteration</span> <span class="o">-</span> <span class="mi">1</span><span class="p">);</span>
  
  <span class="kd">let</span> <span class="nx">x2</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">angle</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">2</span> <span class="o">/</span> <span class="mi">3</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">x</span><span class="p">;</span>
  <span class="kd">let</span> <span class="nx">y2</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">angle</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">2</span> <span class="o">/</span> <span class="mi">3</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">y</span><span class="p">;</span>
  <span class="nx">drawPattern</span><span class="p">(</span><span class="nx">x2</span><span class="p">,</span> <span class="nx">y2</span><span class="p">,</span> <span class="nx">newR</span><span class="p">,</span> <span class="nx">angle</span> <span class="o">*</span> <span class="mf">1.2</span><span class="p">,</span> <span class="nx">iteration</span> <span class="o">-</span> <span class="mi">1</span><span class="p">);</span>
  
  <span class="kd">let</span> <span class="nx">x3</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">cos</span><span class="p">(</span><span class="nx">angle</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">4</span> <span class="o">/</span> <span class="mi">3</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">x</span><span class="p">;</span>
  <span class="kd">let</span> <span class="nx">y3</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">sin</span><span class="p">(</span><span class="nx">angle</span> <span class="o">+</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">PI</span> <span class="o">*</span> <span class="mi">4</span> <span class="o">/</span> <span class="mi">3</span><span class="p">)</span> <span class="o">*</span> <span class="nx">r2</span> <span class="o">+</span> <span class="nx">y</span><span class="p">;</span>
  <span class="nx">drawPattern</span><span class="p">(</span><span class="nx">x3</span><span class="p">,</span> <span class="nx">y3</span><span class="p">,</span> <span class="nx">newR</span><span class="p">,</span> <span class="nx">angle</span> <span class="o">*</span> <span class="mf">1.3</span><span class="p">,</span> <span class="nx">iteration</span> <span class="o">-</span> <span class="mi">1</span><span class="p">);</span>

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

https://www.youtube.com/watch?v=pBeHXNRPNi4

https://thinkib.net/mathanalysis/page/27758/3-circles-inside-a-circle

**Waves and Trigonometry**

Another interesting aspect of the project is the one used to create the effect of waves passing through the "hairs".

Darryl wanted the strokes to oscillate right and left based on data coming from the WebGL renderer. More specifically, variations in the coloring of the pixels of each "screenshot" should drive changes in the rotation of the stroke, giving the illusion of balancing or waving.

The canvas API offers different solutions for rotating drawings. Examples are:
- an ```arc``` method
- a ```rotate``` method

Darryl used a different approach. He calculated the angle of rotation, positioned the pen in the origin point of the stroke (```(x,y)```) and redraw the stroke using the canvas' [**lineTo**](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo) method based on the angle of rotation.

For that he needed to use some formulas. And which functions are common to waves, rotations, and angles? Indeed, [trigonometic functions](https://www.math.net/trigonometric-functions).

Darryl used one of the values of rgba-encoded colors to calculate the angles of rotation. Remember that rgb-encoded colors are represented by a vector of values ranging from 0 to 255. He needed only one of those three coordinates because in his project all the coordinates had the same value per pixel (grey-scale).


# The Code

Let's see first the use of the canvas interface and then let's explore the balancing movement of the strokes.

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

How the WebGL renderer is associated with the **perlinContext** can be seen in line 70 of the original code, enclosed in the *canvas* **render** function. Here the **perlinContext** takes a "screenshot" of the WebGL renderer. The data of the "screenshot" is then passed to the **perlinImgData** using the [**getImageData** method](https://developer.mozilla.org/en-US/docs/Web/API/ImageData).

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

**perlinImgData** is the one passed to the **draw** method of the instance. The rgba values of every pixel in the "screenshot" would be listed in **perlinImgData.data**. Actually, **perlinImgData.data** is more an [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).

Searching the array was done using an index **i**. The calculation of **i** gives a glance of how the color data is arranged in the array. If a pixel were located at position ```(x,y)``` of the image, one of its rgba-coded color values would be located at ```(y * width + x) * 4``` in the array.

From the **perlinImgData.data** array, Darryl extracted a single value per pixel using that "mysterious" index. He then entered the value from the array into the ratio of a formula to obtain an angle's output in radians within a range between 0 (array's value = 0) and PI (array's value = 255).

The resulting **angle** was used to calculate the rotation of the stroke using trigonometric formulas.

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
            <p>You have seen this before! The draw method in class Hair. Notice the <strong>perlinImgData.data</strong>, the index <strong>i</strong> and the canvas API methods, <strong>moveTo</strong> and <strong>lineTo</strong>.</p>
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
            <p>The index is used to look for one of the rgba (0-255) encoded coloring values for the pixel in the data array <strong>perlinImgData.data</strong>. Both canvas are of the same dimension, and the extracted values correspond to pixels on the <strong>perlinContext</strong> screenshot that match <em>exactly the same</em> position of the "hair" origins in the <strong>context</strong> canvas. The array's value is entered into a formula to get an "angle" value between 0 and PI.</p>
            <p>This angle would be used to re-draw the line as rotated from the origin point of the hair using the **lineTo** method.</p>
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
<script src="{{ site.baseurl }}{% link mngassets/posts/2023-11-10-a-perlin-flow-field-with-canvas-shaders-and-threejs-03/huffman-flow-field-setup-03.js %}"></script>
<script type="module" src="{{ site.baseurl }}{% link mngassets/posts/2023-11-10-a-perlin-flow-field-with-canvas-shaders-and-threejs-03/scrollama-setup-03.js %}"></script>
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

In fact, there are still things we can get deeper into by just using this example, but I think we could stop here.

# Final Remarks

I still find myself ripping at the Darryl's pen as I watch the moving of the hairs mimicking the passing of a soft water stream accross floating grass.

From this project I liked the way some nice effects were obtained with a minimal effort. If you consider all the tools and technology involved you might wonder what I mean with "minimal effort".

It is fair to say that only when you have at least a basic understanding of all those technologies and techniques the effort of putting them together becomes closer to "minimal". And I would not disagree. But for this project in particular is more about the few elements used between all those technologies to generate the final effect. For example, how a single value from the WebGL rendering was enough to create a nice visual effect in the context canvas. 

Now, what are your thoughts? Was there anything Darryl Huffman could have done differently? Is this pen one that could work for some of your projects? Is there any other effect that you would like to try using similar techniques?

 I hope that all three of these posts were helpful for you. With this we have completed our analysis of this implementation. Time for something new. Meanwhile, I wish you happy coding!

